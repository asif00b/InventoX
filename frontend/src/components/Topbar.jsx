import { useState, useRef, useEffect } from "react";
import { Sun, Moon, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Topbar() {
  const { role, user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("EN");
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout(); // clear auth
    navigate("/login", { replace: true }); // 🔴 FIX URL
  };

  return (
    <header className="h-14 bg-slate-900 text-slate-200 border-b border-slate-800 flex items-center justify-end px-4 gap-3">
      {/* Theme */}
      <button
        onClick={() => setDark(d => !d)}
        className="p-2 hover:bg-slate-800 rounded"
      >
        {dark ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Language */}
      <button
        onClick={() => setLang(l => (l === "EN" ? "BN" : "EN"))}
        className="text-xs border border-slate-700 px-2 py-1 rounded hover:bg-slate-800"
      >
        {lang}
      </button>

      {/* Profile */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 px-2 py-1 hover:bg-slate-800 rounded"
        >
          <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
            <User size={16} />
          </div>
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-44 bg-slate-800 border border-slate-700 rounded shadow-md overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-700">
              <div className="text-sm font-medium">
                {user?.name || user?.username || "User"}
              </div>
              <div className="text-xs text-slate-400">
                {role}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-700 text-left"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
