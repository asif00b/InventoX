import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ added

  const navigate = useNavigate();

  // Restore auth on refresh
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("auth"));

    if (saved && Date.now() <= saved.expiresAt) {
      setToken(saved.token);
      setRole(saved.role);
    } else {
      localStorage.removeItem("auth");
    }

    setLoading(false); // ✅ important
  }, []);

  // Login
  const login = (t, r) => {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000;

    localStorage.setItem(
      "auth",
      JSON.stringify({ token: t, role: r, expiresAt })
    );

    setToken(t);
    setRole(r);

    navigate("/", { replace: true }); // ✅ FIXED
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("auth");
    setToken(null);
    setRole(null);
    navigate("/login", { replace: true }); // cleaner
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
