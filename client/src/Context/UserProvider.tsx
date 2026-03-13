// hooks
import { type ReactNode, useState, useEffect, useCallback } from "react";
// types
import type { UserContextType, User } from "../types/auth.types";
// context
import UserContext from "./UserContext";
//refreshToken
import { refreshAuth } from "../services/authService";
//axioseClient
import axiosClient, {
  setAxiosToken,
  initializeTokenRefresh,
} from "../services/axiosClient";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // fuction for bazyabi infomation user
  const fetchUserAndToken = useCallback(async () => {
    //start loding
    setIsLoading(true);
    try {
      //get information user and token
      const response = await refreshAuth();

      if (response && response.accessToken && response.user) {
        setTokenState(response.accessToken);
        setUserState(response.user);
        // Set  token in  axios client for  requests
        setAxiosToken(response.accessToken);
      } else {
        //if not token =>deleate infomation user and token
        setUserState(null);
        setTokenState(null);
        setAxiosToken(null);
      }
    } catch (error) {
      console.error("خطا در بازیابی اطلاعات کاربر با refresh token:", error);
      setUserState(null);
      setTokenState(null);
      setAxiosToken(null);
    } finally {
      // finish loading
      setIsLoading(false);
    }
  }, []);
  const handleAuthUpdate = useCallback(
    (newToken: string | null, newUser: User | null) => {
      setTokenState(newToken);
      setUserState(newUser);
      setAxiosToken(newToken);
    },
    [],
  );


  useEffect(() => {
   
    const tokenRefreshHandler = initializeTokenRefresh(handleAuthUpdate);

    // Then, fetch user and token information
    fetchUserAndToken()
      .then(() => {})
      .catch((error) => {
        console.error("Error during initial fetchUserAndToken:", error);

        handleAuthUpdate(null, null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [fetchUserAndToken, handleAuthUpdate, initializeTokenRefresh]);

  //update function setuser
  const setUser = useCallback((userData: User | null) => {
    setUserState(userData);
  }, []);

  //update function token
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    setAxiosToken(newToken); // Also update the axios client token
  }, []);
  //if logout => deleat information context
  const logout = useCallback(() => {
    setUserState(null);
    setTokenState(null);
    setAxiosToken(null);
    console.log("کاربر با موفقیت خارج شد .");
  }, []);

  const contextValue: UserContextType = {
    user,
    token,
    setUser,
    setToken,
    logout,
    isLoading,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
