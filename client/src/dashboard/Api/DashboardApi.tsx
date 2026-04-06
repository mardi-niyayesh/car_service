import axiosClient from "../../services/axiosClient";
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
    console.log("داده دریافتی از سرور", data);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//Updat Email and Naame User
export const UpdateInformationUser = async (data) => {
  try {
    const response = await axiosClient.patch("/users/profile", {
      display_name: data.display_name,
      age: Number(data.age),
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//Updat Password User
export const UpdatePasswordUser = async (data) => {
  try {
    const response = await axiosClient.patch("/users/password", {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
