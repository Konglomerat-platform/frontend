import { Layers, LogOut, Menu, X } from "lucide-react";
import { Link, NavLink } from "react-router";

import { useAuth } from "../../auth/AuthContext";
import { LanguageSwitch } from "../ui/LanguageSwitch";
import { NotificationsBell } from "../ui/NotificationsBell";
import { ThemeToggle } from "../ui/ThemeToggle";

export type HeaderNavItem = { href: string; label: string };

type SiteHeaderProps = {
  nav?: HeaderNavItem[];
  navOpen?: boolean;
  onMenuClick?: () => void;
  onNavClose?: () => void;
  showNotifications?: boolean;
};

export function SiteHeader({ nav = publicNav, navOpen = false, onMenuClick, onNavClose, showNotifications = true }: SiteHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <div id="header">
      <header className="site-header">
        <div className="container header-inner">
          <button className="icon-btn menu-toggle" type="button" aria-label="Menu" onClick={onMenuClick}>
            {navOpen ? <X /> : <Menu />}
          </button>
          <Link className="brand" to="/">
            <span className="logo-mark">
              <Layers />
            </span>
            <span>
              <span className="logo-text">Konglomerat</span>
              <small>National AI Business OS</small>
            </span>
          </Link>
          <nav className={`header-nav ${navOpen ? "open" : ""}`}>
            {nav.map((item) => (
              <NavLink key={item.href} to={item.href} onClick={onNavClose}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-tools">
            <LanguageSwitch />
            <ThemeToggle />
            {user && showNotifications ? <NotificationsBell /> : null}
            {user ? (
              <button className="btn btn-soft btn-sm" type="button" onClick={logout}>
                <LogOut /> Выйти
              </button>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                Войти
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

const publicNav: HeaderNavItem[] = [
  { href: "/#about", label: "О нас" },
  { href: "/#showrooms", label: "Шоурумы" },
  { href: "/favorites", label: "Избранное" },
  { href: "/#news", label: "Новости" },
  { href: "/assistant", label: "AI-ассистент" },
  { href: "/complaint", label: "Жалоба" },
];
