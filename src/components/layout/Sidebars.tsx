import { BarChart3, FileText, FlaskConical, Home, MessageCircle, Newspaper, Package, SlidersHorizontal, Video } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type SidebarProps = {
  active: string;
  onNavigate?: () => void;
};

type SidebarLink = {
  key: string;
  href: string;
  labelKey: string;
  Icon: typeof BarChart3;
};

export function AdminSidebar({ active, onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="side-label">{t("directorPanel")}</div>
      {adminLinks.map((item) => (
        <Link key={item.key} className={`side-link ${active === item.key ? "active" : ""}`} to={item.href} onClick={onNavigate}>
          <span className="ic">
            <item.Icon />
          </span>
          <span>{t(item.labelKey)}</span>
        </Link>
      ))}
    </>
  );
}

export function CompanySidebar({ active, onNavigate }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <>
      <div className="side-label">{t("company")}</div>
      {companyLinks.map((item) => (
        <Link key={item.key} className={`side-link ${active === item.key ? "active" : ""}`} to={item.href} onClick={onNavigate}>
          <span className="ic">
            <item.Icon />
          </span>
          <span>{t(item.labelKey)}</span>
        </Link>
      ))}
    </>
  );
}

const adminLinks: SidebarLink[] = [
  { key: "overview", href: "/admin", labelKey: "overview", Icon: BarChart3 },
  { key: "control", href: "/admin/control", labelKey: "control", Icon: SlidersHorizontal },
  { key: "conferences", href: "/admin/conferences", labelKey: "conferences", Icon: Video },
  { key: "chats", href: "/admin/chats", labelKey: "chats", Icon: MessageCircle },
  { key: "rnd", href: "/admin/rnd", labelKey: "rndCenter", Icon: FlaskConical },
  { key: "complaints", href: "/admin/complaints", labelKey: "complaints", Icon: FileText },
];

const companyLinks: SidebarLink[] = [
  { key: "workspace", href: "/company", labelKey: "workspace", Icon: Home },
  { key: "content", href: "/company/content", labelKey: "content", Icon: Package },
  { key: "report", href: "/company/report", labelKey: "myReport", Icon: Newspaper },
  { key: "chats", href: "/company/chats", labelKey: "chats", Icon: MessageCircle },
  { key: "rnd", href: "/company/rnd", labelKey: "rndCenter", Icon: FlaskConical },
];
