import { createContext, useState } from "react";
import {type ReactNode } from "react";
//types
import { type User } from "../types/auth.types";
//creat context
export const UserContext = createContext<{
  user: User | null;
  token: string | null;
  setUser: (userData: User | null) => void;
  setToken: (newToken: string | null) => void;
  logout: () => void;
} | null>(null);

// a component to access to UserContext
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState(
    localStorage.getItem("token") || null,
  );
  // update information user
  const setUser = (userData: User | null) => {
    setUserState(userData);
  };
  // update token user
  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
  };

  const logout = () => {
    setUserState(null);
    setTokenState(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
