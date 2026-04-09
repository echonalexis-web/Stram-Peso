import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) {
    return null; // Or a spinner/loading indicator
  }

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && ![].concat(requiredRole).includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};
