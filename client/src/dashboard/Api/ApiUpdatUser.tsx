import axiosClient from "../../services/axiosClient";
import { useUser } from "../../hooks/useUser";
import { setAxiosToken } from "../../services/axiosClient";

type UpdateUserData = {
  display_name: string;
  age: number;
};

//Updata Email and Age User
export const useUpdateUser = () => {
  const { user, setUser } = useUser();

  const FetchUpdateUser = async (data: UpdateUserData) => {
    try {
      const response = await axiosClient.patch("/users/profile", {
        display_name: data.display_name,
        age: Number(data.age),
      });
      console.log("Update successful, status:", response.data);
      if (response.status === 200) {
        console.log("Update successful, status:", response.data);

        if (setUser) {
          setUser({
            ...user,
            ...response.data.response.data.user,
          });
          setAxiosToken(response.data.accessToken);
          return {
            ok: true,
            message: "پروفایل شما با موفقیت به روزرسانی شد ",
          };
        }
      }
      return {
        ok: false,
        message: "خطا در به روز رسانی پروفایل کاربر",
      };
    } catch (err) {
      console.log("Error in update user ", err);
      const status = err?.response?.status;
      if (status === 409) {
        return {
          ok: false,
          message: "  هیچ تغییری در پروفایل خود ایجاد نکردید",
        };
      } else {
        return { ok: false, message: "خطایی در سرور رخ داده است." };
      }
    }
  };

  return FetchUpdateUser;
};
