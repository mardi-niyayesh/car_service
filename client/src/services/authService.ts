import axios from "axios";
import type { AxiosResponse } from "axios";
//types
import type { RefreshResponse } from "../types/auth.types";

// const API_BASE_URL = "http://localhost:3000/api";

  export async function refreshAuth(): Promise<RefreshResponse | null> {
  try {
    const response: AxiosResponse<RefreshResponse> = await axios.post(
      `api/auth/refresh`,
      {},
    );    
    console.log(response.data)
   return response.data;
  } catch (error) {
    console.error("خطا در رفرش توکن و دریافت اطلاعات کاربر:", error);
    return null;
  }
}
