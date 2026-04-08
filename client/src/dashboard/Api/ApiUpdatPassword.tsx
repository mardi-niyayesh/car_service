import axiosClient from "../../services/axiosClient";
type UpdateUserData = {
  oldPassword: string;
  newPassword: string;
};

//Updata Email and Age User
export const useUpdatePassword = () => {
  const FetchUpdatepassword = async (data: UpdateUserData) => {
    try {
      const response = await axiosClient.patch("/users/password", {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      if (response.status === 200) {
        console.log("Update successful, status:", response.data);

        alert("رمزعبور کاربر با موفقیت به‌روزرسانی شد.");
        console.log("Update successful, status:", response.data);
        return response.data;
      }
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        alert("رمز عبور فعلی وارد شده صحیح نیست");
      }
      console.error("Error updatePassword :", err);
      throw err;
    }
  };

  return FetchUpdatepassword;
};
