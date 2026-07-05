import { BarChart3, FileText, FlaskConical, Grid3X3, Home, MessageCircle, Newspaper, Package, Settings, SlidersHorizontal, Video } from "lucide-react";
import { NavLink } from "react-router";

type SidebarProps = {
  active: string;
  onNavigate?: () => void;
};

export function AdminSidebar({ active, onNavigate }: SidebarProps) {
  return (
    <>
      <div className="side-label">Панель Директора</div>
      {adminLinks.map((item) => (
        <NavLink key={item.key} className={`side-link ${active === item.key ? "active" : ""}`} to={item.href} onClick={onNavigate}>
          <span className="ic">
            <item.Icon />
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

export function CompanySidebar({ active, onNavigate }: SidebarProps) {
  return (
    <>
      <div className="side-label">Кабинет компании</div>
      {companyLinks.map((item) => (
        <NavLink key={item.key} className={`side-link ${active === item.key ? "active" : ""}`} to={item.href} onClick={onNavigate}>
          <span className="ic">
            <item.Icon />
          </span>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </>
  );
}

const adminLinks = [
  { key: "overview", href: "/admin", label: "Обзор", Icon: BarChart3 },
  { key: "control", href: "/admin/control", label: "Управление", Icon: SlidersHorizontal },
  { key: "modules", href: "/admin/modules", label: "Модули", Icon: Grid3X3 },
  { key: "conferences", href: "/admin/conferences", label: "Конференции", Icon: Video },
  { key: "chats", href: "/admin/chats", label: "Чаты", Icon: MessageCircle },
  { key: "rnd", href: "/admin/rnd", label: "R&D центр", Icon: FlaskConical },
  { key: "complaints", href: "/admin/complaints", label: "Жалобы", Icon: FileText },
];

const companyLinks = [
  { key: "workspace", href: "/company", label: "Рабочее пространство", Icon: Home },
  { key: "content", href: "/company/content", label: "Контент", Icon: Package },
  { key: "report", href: "/company/report", label: "Мой отчёт", Icon: Newspaper },
  { key: "chats", href: "/company/chats", label: "Чаты", Icon: MessageCircle },
  { key: "rnd", href: "/company/rnd", label: "R&D центр", Icon: FlaskConical },
];
