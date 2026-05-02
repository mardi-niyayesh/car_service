export const LogoutUser = async () => {
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
    }

    const data = await response.json();
    console.log(" Response server  ", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
