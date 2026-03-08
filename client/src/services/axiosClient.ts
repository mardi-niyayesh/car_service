import axios from "axios";
import type { AxiosInstance, AxiosError } from "axios";
import { refreshToken } from "./authService";

const API_BASE_URL = "http://localhost:3000/api";

const axiosClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//handel count Refresh for not conflict
let isRefreshing = false;
//count requests to server for refreshToken
let refreshCount = 0;

axiosClient.interceptors.response.use(
  //response=success
  (response) => response,
  async (error: AxiosError) => {
    //for retry requset to new accsee token
    const originalRequest = error.config;

    if (error.response?.status === 403 && refreshCount < 3 && originalRequest) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshCount++;

        try {
          const newToken = await refreshToken();

          if (newToken && originalRequest) {
            //add new Token to header request
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosClient(originalRequest);
          }
        } catch (err) {
          console.error("Refresh token failed:", err);
        } finally {
          isRefreshing = false;
        }
      } else {
        //if other request =>isRefreshing = true
        await new Promise((resolve) => setTimeout(resolve, 100));
        return axiosClient(originalRequest);
      }
    }

    if (refreshCount > 3) {
      localStorage.removeItem("accessToken");
      //for Preventing loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }

      refreshCount = 0;
    }
    //if error not 403 or other error => reject
    return Promise.reject(error);
  },
);

export default axiosClient;
