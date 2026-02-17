import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { token, role } = useAuth();
  const location = useLocation();

  // Not logged in → force redirect
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in but no permission
  if (roles && !roles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
