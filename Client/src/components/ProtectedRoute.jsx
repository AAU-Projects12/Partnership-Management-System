import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/" replace />;
  }

  // Render the protected component if user is authenticated
  return children;
};

export default ProtectedRoute;
