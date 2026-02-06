import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  Boxes,
  ArrowLeftRight,
  Truck,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
} from "lucide-react";

const iconMap = {
  Dashboard: LayoutDashboard,
  Products: Boxes,
  "Stock In/Out": ArrowLeftRight,
  Suppliers: Truck,
  Reports: BarChart3,
  Users: Users,
};

const menuConfig = {
  SUPER_ADMIN: [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Stock In/Out", path: "/stock" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Reports", path: "/reports" },
    { name: "Users", path: "/users" },
  ],
  ADMIN: [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Stock In/Out", path: "/stock" },
    { name: "Suppliers", path: "/suppliers" },
    { name: "Reports", path: "/reports" },
  ],
  STAFF: [
    { name: "Dashboard", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Stock In/Out", path: "/stock" },
  ],
  VIEWER: [
    { name: "Dashboard", path: "/" },
    { name: "Reports", path: "/reports" },
  ],
};

export default function Sidebar({ collapsed }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menus = menuConfig[role] || [];

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout(); // clear auth
    navigate("/login", { replace: true }); // 🔴 FIX URL
  };

  return (
    <aside
      className={`bg-slate-900 text-slate-200 flex flex-col justify-between transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top */}
      <div>
        <div className="p-4 text-lg font-semibold tracking-wide">
          {!collapsed && "InventoX"}
        </div>

        <nav className="space-y-1 px-2">
          {menus.map((m) => {
            const Icon = iconMap[m.name] || LayoutDashboard;
            const active = location.pathname === m.path;

            return (
              <Link
                key={m.name}
                to={m.path}
                className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 ${
                  active ? "bg-slate-800" : ""
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{m.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-2 border-t border-slate-800">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded"
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </Link>

        {/* Profile */}
        <div className="relative mt-1">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded"
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            {!collapsed && <span className="flex-1 text-left">Profile</span>}
          </button>

          {profileOpen && !collapsed && (
            <div className="absolute bottom-12 left-0 w-full bg-slate-800 rounded shadow">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-slate-700 text-left"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
