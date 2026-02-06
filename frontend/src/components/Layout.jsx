import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useState } from "react";

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar collapsed={collapsed} />

      <div className="flex flex-col flex-1">
        <Topbar onToggleSidebar={() => setCollapsed(!collapsed)} />

        <main className="flex-1 bg-slate-100 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
