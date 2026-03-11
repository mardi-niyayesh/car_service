//hooks
import { useContext } from "react";
//context
import UserContext from "../Context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    throw new Error(
      "کامپوننت ما  خارج از یوزپروایدر قرار گرفته یا مقدار ندارد",
    );
  }
  return context;
};
