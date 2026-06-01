import axiosClient from "../../../services/axiosClient";
import { useUser } from "../../../hooks/useUser";
import { setAxiosToken } from "../../../services/axiosClient";

type UpdateUserData = {
  display_name?: string;
  age?: number;
};

export const useUpdateUser = () => {
  const { user, setUser } = useUser();

  const FetchUpdateUser = async (data: UpdateUserData) => {
    try {
      const payload: any = {};
      if (data.display_name !== undefined)
        payload.display_name = data.display_name;
      if (data.age !== undefined) payload.age = data.age;

      const response = await axiosClient.patch("/users/profile", payload);
      console.log("Update successful, status:", response.status);

      if (response.status === 200) {
        if (setUser) {
          setUser({
            ...user,
            ...response.data.response.data.user,
          });
          setAxiosToken(response.data.accessToken);
          return {
            ok: true,
            message: "پروفایل شما با موفقیت به روزرسانی شد",
          };
        }
      }
      return {
        ok: false,
        message: "خطا در به روز رسانی پروفایل کاربر",
      };
    } catch (err: any) {
      console.log("Error in update user ", err);
      const status = err?.response?.status;
      if (status === 409) {
        return {
          ok: false,
          message: "هیچ تغییری در پروفایل خود ایجاد نکردید",
        };
      }

      const serverMsg =
        err?.response?.data?.message || "خطایی در سرور رخ داده است.";
      return { ok: false, message: serverMsg };
    }
  };

  return FetchUpdateUser;
};
