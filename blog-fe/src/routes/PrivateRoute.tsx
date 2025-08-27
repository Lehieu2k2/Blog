import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getAuthToken } from "../config";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  // Check if user has valid token from cookies
  const token = getAuthToken();
  const isAuthenticated = token && token.length > 0;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
