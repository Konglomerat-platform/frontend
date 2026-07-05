import { useState, type ReactNode } from "react";

import { SiteHeader } from "../components/layout/SiteHeader";
import { AdminSidebar, CompanySidebar } from "../components/layout/Sidebars";
import { useBodyClass } from "../hooks/useBodyClass";

type WorkspaceLayoutProps = {
  role: "admin" | "company";
  active: string;
  children: ReactNode;
  chatPage?: boolean;
};

export function WorkspaceLayout({ role, active, children, chatPage = false }: WorkspaceLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useBodyClass("tg-page", chatPage);

  return (
    <>
      <SiteHeader nav={[]} navOpen={sidebarOpen} onMenuClick={() => setSidebarOpen((value) => !value)} />
      {sidebarOpen ? <button className="mobile-backdrop show" aria-label="Close menu" onClick={() => setSidebarOpen(false)} /> : null}
      <div className="app-shell">
        <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
          {role === "admin" ? (
            <AdminSidebar active={active} onNavigate={() => setSidebarOpen(false)} />
          ) : (
            <CompanySidebar active={active} onNavigate={() => setSidebarOpen(false)} />
          )}
        </aside>
        <main className="workspace">{children}</main>
      </div>
    </>
  );
}
