//hooks
import { type ReactNode } from "react";
import { useState, useEffect } from "react";
//types
import { type User } from "../types/auth.types";
//context
import UserContext from "./UserContext";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState(
    localStorage.getItem("token") || null,
  );

  //use useEffect for get information user az localstorage vaghti load or refresh :)
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserState(parsedUser);
      } catch (error) {
        console.error(
          "نتونستیم اطلاعات یوزر رو از لوکال استوریج بگیریم :",
          error,
        );
        localStorage.removeItem("userData");
      }
    }
  }, []);

  // update information user and seve to localstorege
  const setUser = (userData: User | null) => {
    setUserState(userData);
    if (userData) {
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
      } catch (error) {
        console.error(
          "نتونستیم اطلاعات یوزر رو از لوکال استوریج بگیریم :",
          error,
        );
      }
    } else {
      localStorage.removeItem("userData");
    }
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
    localStorage.removeItem("userData");
  };
  const contextValue = { user, token, setUser, setToken, logout };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
export default UserProvider;
