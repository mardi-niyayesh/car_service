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

    // console.log("token in interceptor:", token);
    // console.log("heder in  Authorization:", token ? `Bearer ${token}` : "Not");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // console.error("Request Interceptor Error:", error);
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
      // console.error(" Refresh token endpoint failed. Logging out.");
      if (tokenUpdateCallback) {
        tokenUpdateCallback(null, null);
      }
      return Promise.reject(error);
    }

    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (originalRequest._retryCount >= 3) {
      // console.error(" Maximum retry attempts (3) reached. Logging out.");
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
          console.log(" Token refreshed successfully.");
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
          // console.error(
          //   "Token refresh failed: No valid token or user received.",
          // );
          if (tokenUpdateCallback) {
            tokenUpdateCallback(null, null);
          }
          return Promise.reject(error);
        }
      } catch (refreshError: any) {
        // console.error(
        //   ` Error during token refresh (attempt ${originalRequest._retryCount}):`,
        //   refreshError,
        // );

        if (refreshError?.response?.status === 401) {
          // console.error(" Refresh token is invalid or expired. Logging out.");
          if (tokenUpdateCallback) {
            tokenUpdateCallback(null, null);
          }
          return Promise.reject(refreshError);
        }

        // console.log(
        //   ` Retrying request (attempt ${originalRequest._retryCount})...`,
        // );
        return axiosClient(originalRequest);
      } finally {
        isRefreshing = false;
      }
    } else {
      // console.log(" Refresh in progress, adding request to queue.");
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
          // console.error(" Retry failed after queue processing:", err);
          return Promise.reject(err);
        });
    }
  },
);

export default axiosClient;
