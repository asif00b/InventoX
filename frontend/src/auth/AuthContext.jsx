import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function getJwtExpiry(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000; // exp is in seconds
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= RESTORE SESSION ================= */

  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed?.token) {
        const expiry = getJwtExpiry(parsed.token);

        if (!expiry || Date.now() > expiry) {
          localStorage.removeItem("auth");
        } else {
          setToken(parsed.token);
          setRole(parsed.role);
        }
      }
    }

    setLoading(false);
  }, []);

  /* ================= LOGIN ================= */

  const login = (jwtToken, userRole) => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: jwtToken,
        role: userRole,
      })
    );

    setToken(jwtToken);
    setRole(userRole);
  };

  /* ================= LOGOUT ================= */

  const logout = () => {
    localStorage.removeItem("auth");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);