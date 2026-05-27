import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type GaurdRouteType = {
  children: React.ReactNode;
  requiredPermission: string | string[]; 
  fallbackPath?: string;
};

export const GaurdRoute = ({
  children,
  requiredPermission,
  fallbackPath = "/",
}: GaurdRouteType) => {
  const { hasPermission, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }


  const hasAccess = Array.isArray(requiredPermission)
    ? requiredPermission.some(perm => hasPermission(perm))
    : hasPermission(requiredPermission);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};