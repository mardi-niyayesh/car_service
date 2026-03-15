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
      // Ensure Authorization header is always a string
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // Handle request errors if any
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  },
);

let isRefreshing = false;
// Use a queue to hold requests that are waiting for a new token
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
  tokenUpdateCallback = callback;
  // If a callback is set, we can now process the queued requests
  if (failedQueue.length) {
    const queue = failedQueue.slice();
    failedQueue = [];
    queue.forEach(({ resolve, reject }) => {
      resolve();
    });
  }
};

// Function to process the queue of failed requests
const processQueue = (
  error: AxiosError,
  resolve: (value?: any) => void,
  reject: (reason?: any) => void,
) => {
  failedQueue.push({ resolve, reject });
};

axiosClient.interceptors.response.use(
  // Success handler
  (response) => {
    return response;
  },
  // Error handler
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    if (error.response?.status === 401 || error.response?.status === 403) {
      if (originalRequest && !originalRequest._retry && tokenUpdateCallback) {
        originalRequest._retry = true; 

        if (!isRefreshing) {
          isRefreshing = true;
          try {
            console.log("Attempting to refresh token...");
            const responseData: RefreshResponse | null = await apiRefreshAuth();

            if (responseData?.accessToken && responseData.user) {
              console.log("Token refreshed successfully.");
              const newToken = responseData.accessToken;
              const newUser = responseData.user;

              // Update  token state and callback
              setAxiosToken(newToken);
              if (tokenUpdateCallback) {
                tokenUpdateCallback(newToken, newUser);
              }

              // Update the Authorization header for the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
              }

              // Process the queue of requests that failed while refreshing
              const queue = failedQueue.slice();
              failedQueue = []; // Clear the queue

              queue.forEach(({ resolve }) => resolve()); // Resolve all waiting requests

              // Retry the original failed request with the new token
              return axiosClient(originalRequest);
            } else {
              console.error(
                "Token refresh failed: No valid token or user received.",
              );
              // If refresh failed, log out the user
              if (tokenUpdateCallback) {
                tokenUpdateCallback(null, null);
              }
              // Reject the original request
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Error during token refresh process:", refreshError);
            // If any error occurs during refresh, log out the user
            if (tokenUpdateCallback) {
              tokenUpdateCallback(null, null);
            }
            // Reject the original request
            return Promise.reject(refreshError || error); 
          } finally {
            isRefreshing = false;
          }
        } else {
    
          console.log("Refresh in progress, adding request to queue.");
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
              // If retry fails after queue processing
              console.error("Retry failed after queue processing:", err);
              return Promise.reject(err);
            });
        }
      } else if (originalRequest && originalRequest._retry && isRefreshing) {
      
        console.log("Request already marked for retry, adding to queue.");
        return new Promise((resolve, reject) => {
          processQueue(error, resolve, reject);
        })
          .then(() => {
            // Retry with the latest token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${getCurrentToken()}`;
            }
            return axiosClient(originalRequest);
          })
          .catch((err) => {
            console.error(
              "Retry failed after queue processing (already retried):",
              err,
            );
            return Promise.reject(err);
          });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
