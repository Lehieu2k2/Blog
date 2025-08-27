import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../config";

interface PublicRouteProps {
  children: ReactNode;
  restricted?: boolean; // If true, redirect authenticated users to dashboard
}

const PublicRoute = ({ children, restricted = false }: PublicRouteProps) => {
  // Check if user has valid token from cookies
  const token = getAuthToken();
  const isAuthenticated = token && token.length > 0;

  // If route is restricted and user is authenticated, redirect to dashboard
  if (restricted && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the public component
  return <>{children}</>;
};

export default PublicRoute;
