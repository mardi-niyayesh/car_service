import axiosClient from "./axiosClient";
import type { AxiosResponse } from "axios";

import type { RefreshResponse } from "../types/auth.types";

export async function refreshAuth(): Promise<RefreshResponse | null> {
  try {
    const response: AxiosResponse<RefreshResponse> = await axiosClient.post(
      `/auth/refresh`,
      {},
    );

    return response.data;
  } catch (error) {
    // console.error("خطا در رفرش توکن و دریافت اطلاعات کاربر:", error);

    return null;
  }
}
