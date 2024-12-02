import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, user, redirect = "/login" }) => {
  if (!user) return <Navigate to={redirect} />;
  return children || <Outlet />;
};

export default ProtectedRoute;
