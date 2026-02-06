import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  // Restore auth on refresh
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("auth"));

    if (!saved) return;

    if (Date.now() > saved.expiresAt) {
      localStorage.removeItem("auth");
      return;
    }

    setToken(saved.token);
    setRole(saved.role);
  }, []);

  // Login
  const login = (t, r) => {
    const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours

    localStorage.setItem(
      "auth",
      JSON.stringify({ token: t, role: r, expiresAt })
    );

    setToken(t);
    setRole(r);
  };

  // Logout (NO navigation here)
  const logout = () => {
    localStorage.removeItem("auth");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
