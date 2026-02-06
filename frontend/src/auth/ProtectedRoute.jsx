import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { token, role } = useAuth();

  // 🔴 FIX: redirect to login + replace
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <h3>Access Denied</h3>;
  }

  return children;
}
