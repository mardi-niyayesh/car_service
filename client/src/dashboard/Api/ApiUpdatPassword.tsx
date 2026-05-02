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

        return {
          ok: true,
          message: " رمز عبور شما با موفقیت به روز رسانی شد",
        };
      }
      return {
        ok: false,
        message: "خطایی در به روز رسانی رمز عبور رخ داد ",
      };
    } catch (err) {
      console.error("Error updatePassword :", err);
      const status = err.response?.status;

      if (status === 401) {
        return {
          ok: false,
          message: " رمز عبور فعلی وارد شده صحیح نیست !  ",
        };
      } else {
        return { ok: false, message: "خطایی در سرور رخ داده است." };
      }
    }
  };

  return FetchUpdatepassword;
};
