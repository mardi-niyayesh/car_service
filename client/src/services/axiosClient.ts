import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";

import type { RefreshResponse, User } from "../types/auth.types";

import { refreshAuth as apiRefreshAuth } from "../services/authService";

const API_BASE_URL = "/api";

let currentToken: string | null = null;

export const setAxiosToken = (token: string | null) => {
  currentToken = token;
};

const getCurrentToken = () => currentToken;

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getCurrentToken();

    if (config.url?.includes("/auth/refresh")) {
      delete config.headers.Authorization;
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

let tokenUpdateCallback:
  | ((token: string | null, user: User | null) => void)
  | null = null;

export const initializeTokenRefresh = (
  callback: (token: string | null, user: User | null) => void,
) => {
  console.log("initializeTokenRefresh call");
  tokenUpdateCallback = callback;
  if (failedQueue.length) {
    const queue = failedQueue.slice();
    failedQueue = [];
    queue.forEach(({ resolve }) => {
      resolve();
    });
  }
};

const processQueue = (
  error: AxiosError,
  resolve: (value?: any) => void,
  reject: (reason?: any) => void,
) => {
  failedQueue.push({ resolve, reject });
};

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retryCount?: number;
    };

    if (error.response?.status !== 401 && error.response?.status !== 403) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
     
      if (tokenUpdateCallback) {
        tokenUpdateCallback(null, null);
      }
      return Promise.reject(error);
    }

    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (originalRequest._retryCount >= 3) {

      if (tokenUpdateCallback) {
        tokenUpdateCallback(null, null);
      }
      return Promise.reject(error);
    }

    if (!isRefreshing) {
      isRefreshing = true;
      originalRequest._retryCount += 1;

      try {
        console.log(
          ` Attempting to refresh token (attempt ${originalRequest._retryCount})...`,
        );
        const responseData: RefreshResponse | null = await apiRefreshAuth();

        const newToken = responseData?.response?.data?.accessToken;
        const newUser = responseData?.response?.data?.user;

        if (newToken && newUser) {
       
          setAxiosToken(newToken);
          if (tokenUpdateCallback) {
            tokenUpdateCallback(newToken, newUser);
          }

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          const queue = failedQueue.slice();
          failedQueue = [];
          queue.forEach(({ resolve }) => resolve());

          return axiosClient(originalRequest);
        } else {
     
          if (tokenUpdateCallback) {
            tokenUpdateCallback(null, null);
          }
          return Promise.reject(error);
        }
      } catch (refreshError: any) {


        if (refreshError?.response?.status === 401) {
      
          if (tokenUpdateCallback) {
            tokenUpdateCallback(null, null);
          }
          return Promise.reject(refreshError);
        }


        return axiosClient(originalRequest);
      } finally {
        isRefreshing = false;
      }
    } else {
   
      return new Promise((resolve, reject) => {
        processQueue(error, resolve, reject);
      })
        .then(() => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${getCurrentToken()}`;
          }
          return axiosClient(originalRequest);
        })
        .catch((err) => {
   
          return Promise.reject(err);
        });
    }
  },
);

export default axiosClient;
