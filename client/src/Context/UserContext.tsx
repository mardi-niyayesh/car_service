import { createContext } from "react";
import { type UserContextType } from "../types/auth.types";

const UserContext = createContext<UserContextType | null>(null);

export default UserContext;
