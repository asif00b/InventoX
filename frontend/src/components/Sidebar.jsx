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
  Menu,
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

export default function Sidebar({ collapsed, setCollapsed }) {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const menus = menuConfig[role] || [];
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
    if (!collapsed) setProfileOpen(false);
  };

  return (
    <aside
      className={`bg-slate-900 text-slate-200 flex flex-col justify-between transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top + Menu */}
      <div>
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded hover:bg-slate-800 transition"
          >
            <Menu size={20} />
          </button>

          {!collapsed && (
            <span className="text-lg font-semibold tracking-wide">
              InventoX
            </span>
          )}
        </div>

        {/* Menu */}
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
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? m.name : ""}
              >
                <Icon size={18} />
                {!collapsed && <span>{m.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-2 border-t border-slate-800">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Settings" : ""}
        >
          <Settings size={18} />
          {!collapsed && <span>Settings</span>}
        </Link>

        <div className="relative mt-1">
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Profile" : ""}
          >
            <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center">
              <User size={16} />
            </div>
            {!collapsed && (
              <span className="flex-1 text-left">Profile</span>
            )}
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

          {collapsed && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-3 py-2 hover:bg-slate-800 rounded mt-1"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
