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
          return {
            success: true,
            message: " update information user, to Success",
          };
          setAxiosToken(response.data.accessToken);
        }
        return { success: false, message: " Errror..." };
      }
    } catch (err) {
      console.log("Error in update user ", err);

      return { success: false, message: "Error in connection server " };
    }
  };

  return FetchUpdateUser;
};
