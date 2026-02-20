import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import ProtectedRoute from "./auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Stock from "./pages/Stock";
import Suppliers from "./pages/Suppliers";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

export default function App() {
  const { token, role, loading } = useAuth();

  if (loading) return null; // ✅ IMPORTANT

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={!token ? <Login /> : <Navigate to="/" replace />}
      />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard role={role} />} />
        <Route path="products" element={<Products />} />
        <Route path="stock" element={<Stock />} />
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="reports" element={<Reports />} />

        <Route
          path="users"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN"]}>
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="settings"
          element={
            <ProtectedRoute roles={["SUPER_ADMIN", "ADMIN", "STAFF"]}>
              <Settings />
            </ProtectedRoute>
          }
          />
      </Route>

      {/* Proper Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
