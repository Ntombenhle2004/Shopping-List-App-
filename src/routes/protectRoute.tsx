import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../Reduxhooks";

const ProtectedRoute: React.FC<{ redirectPath?: string }> = ({
  redirectPath = "/login",
}) => {
  const isAuthenticated = useAppSelector(
    (state) => state.login.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default ProtectedRoute;
