import { Navigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

type GaurdRouteType = {
  children: React.ReactNode;
  requiredPermission: string;
  //if not accesss => what page?
  fallbackPath?: string;
};

export const GaurdRoute = ({
  //All pages
  children,
  requiredPermission,
  fallbackPath = "/dashboard",
}: GaurdRouteType) => {
  const { hasPermission, isLoading } = useUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
