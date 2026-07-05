import { FileText, FlaskConical, MessageCircle, Package, Video } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { listOrders } from "../../services/commerceService";
import { listConferences } from "../../services/operationsService";
import { localize } from "../../lib/format";

export function CompanyDashboardPage() {
  const { i18n } = useTranslation();
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: listOrders });
  const { data: conferences = [] } = useQuery({ queryKey: ["conferences"], queryFn: listConferences });
  const activeLang = i18n.resolvedLanguage || i18n.language;

  return (
    <WorkspaceLayout role="company" active="workspace">
      <PageTitle title="Рабочее пространство" sub="Бизнес управление" />
      {conferences[0] ? (
        <div className="notify-banner">
          <Video />
          <div className="grow"><b>Директор создал конференцию!</b><span>{conferences[0].name} · {conferences[0].date} {conferences[0].time}</span></div>
          <a className="btn btn-primary btn-sm" href={conferences[0].link || "#"}>Join Conference</a>
        </div>
      ) : null}
      <div className="grid cols-4 mt-3">
        <Quick href="/company/content" icon={<Package />} title="Контент" />
        <Quick href="/company/report" icon={<FileText />} title="Мой отчёт" />
        <Quick href="/company/chats" icon={<MessageCircle />} title="Чаты" />
        <Quick href="/company/rnd" icon={<FlaskConical />} title="R&D центр" />
      </div>
      <Panel title="Заявки покупателей" count={orders.length}>
        {orders.length ? orders.map((order) => (
          <div className="list-row" key={order.id}>
            <div className="avatar">{localize(order.product.name, activeLang)[0]}</div>
            <div className="grow"><b>{order.customer.name}</b><small>{order.customer.contact} · {localize(order.product.name, activeLang)} · x{order.qty}</small></div>
            <span className="tag">{order.status}</span>
          </div>
        )) : <p className="muted">Пока заказов нет.</p>}
      </Panel>
    </WorkspaceLayout>
  );
}

function Quick({ href, icon, title }: { href: string; icon: ReactNode; title: string }) {
  return (
    <Link className="card stat-tile" to={href}>
      <div className="s-top"><span className="s-ico">{icon}</span></div>
      <b className="s-lbl">{title}</b>
    </Link>
  );
}
