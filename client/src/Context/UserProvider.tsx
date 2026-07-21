import { type ReactNode, useState, useEffect, useCallback } from "react";
import type { UserContextType, User } from "../types/auth.types";
import UserContext from "./UserContext";
import { refreshAuth } from "../services/authService";
import { setAxiosToken, initializeTokenRefresh } from "../services/axiosClient";

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUserAndToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const ResponseData = await refreshAuth();

     

      const accessToken = ResponseData?.response?.data?.accessToken;
      const user = ResponseData?.response?.data?.user;

      if (accessToken && user) {
     

        setTokenState(accessToken);
        setUserState(user);
        setAxiosToken(accessToken);
      }
    } catch (error: any) {
      

      if (error?.response?.status === 401) {
        
        setUserState(null);
        setTokenState(null);
        setAxiosToken(null);
      }
    } finally {
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
    initializeTokenRefresh(handleAuthUpdate);
  }, [handleAuthUpdate]);

  useEffect(() => {
    fetchUserAndToken();
  }, [fetchUserAndToken]);

  const setUser = useCallback((userData: User | null) => {
    setUserState(userData);
  }, []);

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    setAxiosToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setUserState(null);
    setTokenState(null);
    setAxiosToken(null);
   
  }, []);

  const hasPermission = useCallback(
    (permission: string | string[]): boolean => {
      const isOwner =
        user?.roles?.includes("owner") ||
        user?.permissions?.includes("owner.all");

      if (isOwner) {
        return true;
      }

      const userPermissions = user?.permissions ?? [];
      if (Array.isArray(permission)) {
        return permission.some((p) => userPermissions.includes(p));
      }
      return userPermissions.includes(permission);
    },
    [user],
  );

  const hasRole = useCallback(
    (roleName: string) => {
      if (!user) return false;

      const userRole = user?.role?.name;

      if (!userRole) return false;

      return userRole === roleName;
    },
    [user],
  );

  const contextValue: UserContextType = {
    user,
    token,
    setUser,
    setToken,
    logout,
    isLoading,
    hasPermission,
    hasRole,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
