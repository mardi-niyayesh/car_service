import { type RegisterFormData } from "../types/auth.types";
import { type LoginFormData } from "../types/auth.types";
import { type ResetPasswordtype } from "../types/auth.types";

import { setAxiosToken } from "./axiosClient";

export const registerUser = async (userData: RegisterFormData) => {
  try {
    console.log("data send to server:", userData);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    console.log("statuse Response:", response.status);
    const data = await response.json();
    console.log("Response to server:", data);
    return data;
  } catch (error) {
    console.error("  Error Request:", error);
    throw error;
  }
};

export const loginUser = async (userData: LoginFormData) => {
  try {
    console.log("data send to server :", userData);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    console.log("statuse Response:", response.status);

    const data = await response.json();
    console.log("Response to server:", data);
    if (data.response?.data?.accessToken) {
      setAxiosToken(data.response.data.accessToken);
    }
    return data;
  } catch (err) {
    console.error("Error Request:", err);
    throw err;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const response = await fetch("/api/auth/forget-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log("Response to server:", data);
    return data;
  } catch (err) {
    console.error("Error Request:", err);
    throw err;
  }
};

export const resetPassword = async ({ password, token }: ResetPasswordtype) => {
  try {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, token }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.log("Error to set again password");
    }
    return data;
  } catch (err) {
    console.log("Error to set again password :", err);
    return err;
  }
};
