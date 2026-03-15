// hooks
import { type ReactNode, useState, useEffect, useCallback } from "react";
// types
import type { UserContextType, User } from "../types/auth.types";
// context
import UserContext from "./UserContext";
//refreshToken
import { refreshAuth } from "../services/authService";
//axioseClient
import { setAxiosToken, initializeTokenRefresh } from "../services/axiosClient";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  console.log("user:", user);
  console.log("token:", token);

  // fuction for bazyabi infomation user
  const fetchUserAndToken = useCallback(async () => {
    //start loding
    setIsLoading(true);
    try {
      const ResponseData = await refreshAuth();

      console.log("Full response from refreshAuth:", ResponseData);

      const accessToken = ResponseData?.response?.data?.accessToken;
      const user = ResponseData?.response?.data?.user;

      
      if (accessToken && user) {
        // console.log("Found User:", user);
        // console.log("Found Access Token:", accessToken);

        setTokenState(accessToken);
        setUserState(user); 
        // Set token in axios client for requests
        setAxiosToken(accessToken);
      } else {
        
        // console.log("Token or user not found in the response.");
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
  }, [setIsLoading, setTokenState, setUserState, setAxiosToken]); 

  const handleAuthUpdate = useCallback(
    (newToken: string | null, newUser: User | null) => {
      setTokenState(newToken);
      setUserState(newUser);
      setAxiosToken(newToken);
    },
    [],
  );

  useEffect(() => {
    initializeTokenRefresh(handleAuthUpdate);
  }, [handleAuthUpdate]);

  // start loading or refrash page
  useEffect(() => {
    fetchUserAndToken();
  }, [fetchUserAndToken]);

  //update function setuser
  const setUser = useCallback((userData: User | null) => {
    setUserState(userData);
  }, []);

  //update function token
  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    setAxiosToken(newToken);
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
