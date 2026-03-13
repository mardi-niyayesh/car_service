//hooks
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
//types
import type { RefreshResponse, User } from "../types/auth.types";
//refresh Token
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
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getCurrentToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

let isRefreshing = false;

let tokenUpdateCallback:
  | ((token: string | null, user: User | null) => void)
  | null = null;

export const initializeTokenRefresh = (
  callback: (token: string | null, user: User | null) => void,
) => {
  tokenUpdateCallback = callback;
};

axiosClient.interceptors.response.use(
  // if response=success ==> response
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (
      error.response?.status === 403 &&
      //first requset for refreshToken
      !originalRequest._retry &&
      tokenUpdateCallback
    ) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        // if not requset for refreshToken
        isRefreshing = true;
        try {
          // get user and token
          const responseData: RefreshResponse | null = await apiRefreshAuth();

          if (responseData && responseData.accessToken && responseData.user) {
            const newToken = responseData.accessToken;
            const newUser = responseData.user;

            // update token and user
            if (tokenUpdateCallback) {
              tokenUpdateCallback(newToken, newUser);
            }

            //setting token for axioseClient
            setAxiosToken(newToken);

            //updata header request for new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }

            // again request for new token
            return axiosClient(originalRequest);
          } else {
            console.error(
              "رفرش توکن ناموفق بوده است. کاربر باید دوباره وارد شود.",
            );

            // if error refreshtoken => deleat information UserProvider
            if (tokenUpdateCallback) {
              tokenUpdateCallback(null, null);
            }
          }
        } catch (refreshError) {
          console.error("خطا در طول رفرش توکن:", refreshError);

          // if error UserProvider => deleat information user
          if (tokenUpdateCallback) {
            tokenUpdateCallback(null, null);
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // if chand requset for refreshToken => await
        await new Promise((resolve) => setTimeout(resolve, 100));

        // agein send request to refreshToken
        return axiosClient(originalRequest);
      }
    }
    // reject the promise
    return Promise.reject(error);
  },
);

export default axiosClient;

