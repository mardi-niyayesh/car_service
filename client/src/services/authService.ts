import axios from "axios";
import type { AxiosResponse } from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export async function refreshToken(): Promise<string | null> {
  try {
    const response: AxiosResponse<{
      accessToken: string;
      refreshToken?: string;
    }> = await axios.post(`${API_BASE_URL}/auth/refresh`, {});

    const newAccessToken = response.data.accessToken;

    if (newAccessToken) {
      localStorage.setItem("accessToken", newAccessToken);
    }

    return newAccessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);

    localStorage.removeItem("accessToken");

    return null;
  }
}
