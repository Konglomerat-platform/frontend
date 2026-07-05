import { Layers, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router";

import { useAuth } from "../../auth/AuthContext";
import { LanguageSwitch } from "../ui/LanguageSwitch";
import { NotificationsBell } from "../ui/NotificationsBell";
import { ThemeToggle } from "../ui/ThemeToggle";

export type HeaderNavItem = { href: string; labelKey: string };

type SiteHeaderProps = {
  nav?: HeaderNavItem[];
  navOpen?: boolean;
  onMenuClick?: () => void;
  onNavClose?: () => void;
  showNotifications?: boolean;
};

export function SiteHeader({ nav = publicNav, navOpen = false, onMenuClick, onNavClose, showNotifications = true }: SiteHeaderProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [localNavOpen, setLocalNavOpen] = useState(false);
  const hasHeaderNav = nav.length > 0;
  const menuOpen = onMenuClick ? navOpen : localNavOpen;
  const canToggleMenu = Boolean(onMenuClick || hasHeaderNav);

  function handleMenuClick() {
    if (onMenuClick) {
      onMenuClick();
      return;
    }
    setLocalNavOpen((value) => !value);
  }

  function handleNavClose() {
    setLocalNavOpen(false);
    onNavClose?.();
  }

  return (
    <div id="header">
      <header className="site-header">
        <div className="container header-inner">
          {canToggleMenu ? (
            <button className="icon-btn menu-toggle" type="button" aria-label="Menu" aria-expanded={menuOpen} onClick={handleMenuClick}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          ) : null}
          <Link className="brand" to="/">
            <span className="logo-mark">
              <Layers />
            </span>
            <span>
              <span className="logo-text">{t("brand")}</span>
              <small>{t("tagline")}</small>
            </span>
          </Link>
          <nav className={`header-nav ${hasHeaderNav && menuOpen ? "open" : ""}`}>
            {nav.map((item) => (
              <NavLink key={item.href} to={item.href} onClick={handleNavClose}>
                {t(item.labelKey)}
              </NavLink>
            ))}
          </nav>
          <div className="header-tools">
            <LanguageSwitch />
            <ThemeToggle />
            {user && showNotifications ? <NotificationsBell /> : null}
            {user ? (
              <button className="btn btn-soft btn-sm" type="button" onClick={logout}>
                <LogOut /> {t("logout")}
              </button>
            ) : (
              <Link className="btn btn-primary btn-sm" to="/login">
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

const publicNav: HeaderNavItem[] = [
  { href: "/#about", labelKey: "about" },
  { href: "/#showrooms", labelKey: "showrooms" },
  { href: "/favorites", labelKey: "favorites" },
  { href: "/#news", labelKey: "news" },
  { href: "/assistant", labelKey: "assistant" },
  { href: "/complaint", labelKey: "complaint" },
];
