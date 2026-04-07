//hooks
import { useContext } from "react";
//context
import UserContext from "../Context/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined || context === null) {
    throw new Error("  components above useprovider");
  }
  return context;
};
