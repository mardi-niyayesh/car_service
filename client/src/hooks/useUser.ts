import { useContext } from "react";
import { UserContext } from "../Context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    // اگر context مقدار null یا undefined داشت، یعنی خارج از Provider استفاده شده.
    // در اینجا یک خطا پرتاب می‌کنیم تا مشکل مشخص شود.
    throw new Error("کامپوننت ما  خارج از یوزپروایدر قرار گرفته یا مقدار ندارد");
  }
  return context; 
};
