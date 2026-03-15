import { useUser } from "../../hooks/useUser";

export const LogoutUser = async () => {
  const { logout,setToken,setUser } = useUser();
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      console.log("statuse", response.status);
      logout();
      setToken(null)
      setUser(null)
    }

    const data = await response.json();
    console.log("داده دریافتی از سرور", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
