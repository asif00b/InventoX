import { BrowserRouter, Routes, Route } from "react-router-dom";
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
  const { token, role } = useAuth();

  if (!token) return <Login />;

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard role={role} />} />

          <Route path="/products" element={<Products />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/reports" element={<Reports />} />

          <Route
            path="/users"
            element={
              <ProtectedRoute roles={["SUPER_ADMIN"]}>
                <Users />
              </ProtectedRoute>
            }
          />

          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
