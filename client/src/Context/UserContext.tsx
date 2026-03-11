//hooks
import { createContext } from "react";
//types
import { type User } from "../types/auth.types";
//creat context
const UserContext = createContext<{
  user: User | null;
  token: string | null;
  setUser: (userData: User | null) => void;
  setToken: (newToken: string | null) => void;
  logout: () => void;
} | null>(null);

export default UserContext;
