import axiosClient from "../../services/axiosClient";
import { useUser } from "../../hooks/useUser";
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

      if (response.status === 200) {
        console.log("Update successful, status:", response.data);
        if (setUser) {
          setUser({
            ...user,
            ...response.data.response.data.user,
          });
        }
        alert("اطلاعات کاربر با موفقیت به‌روزرسانی شد.");
        console.log("Update successful, status:", response.data);
        return response.data;
      }
    } catch (err) {
      const status = err.response?.status;

      if (status === 409) {
        alert("هیچ تغییری شناسایی نشد.");
      } else if (status === 400) {
        alert("خطا در به روز رسانی اطلاعات");
      } else {
        alert("خطایی در سرور رخ داده است");
      }
      console.error("Error in FetchUpdateUser:", err);
      throw err;
    }
  };

  return FetchUpdateUser;
};
