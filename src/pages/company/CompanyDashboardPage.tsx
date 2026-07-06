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
  const { t, i18n } = useTranslation();
  const { data: orders = [] } = useQuery({ queryKey: ["orders"], queryFn: listOrders });
  const { data: conferences = [] } = useQuery({ queryKey: ["conferences"], queryFn: listConferences });
  const activeLang = i18n.resolvedLanguage || i18n.language;

  return (
    <WorkspaceLayout role="company" active="workspace">
      <PageTitle title={t("workspace")} sub={t("businessManagement")} />
      {conferences[0] ? (
        <div className="notify-banner">
          <Video />
          <div className="grow"><b>{t("directorCreatedConference")}</b><span>{conferences[0].name} · {conferences[0].date} {conferences[0].time}</span></div>
          <a
            className="btn btn-primary btn-sm"
            href={conferences[0].link || "#"}
            target={conferences[0].link ? "_blank" : undefined}
            rel={conferences[0].link ? "noreferrer" : undefined}
          >
            {t("joinConference")}
          </a>
        </div>
      ) : null}
      <div className="grid cols-4 mt-3">
        <Quick href="/company/content" icon={<Package />} title={t("content")} />
        <Quick href="/company/report" icon={<FileText />} title={t("myReport")} />
        <Quick href="/company/chats" icon={<MessageCircle />} title={t("chats")} />
        <Quick href="/company/rnd" icon={<FlaskConical />} title={t("rndCenter")} />
      </div>
      <Panel title={t("buyerRequests")} count={orders.length}>
        {orders.length ? orders.map((order) => (
          <div className="list-row" key={order.id}>
            <div className="avatar">{localize(order.product.name, activeLang)[0]}</div>
            <div className="grow"><b>{order.customer.name}</b><small>{order.customer.contact} · {localize(order.product.name, activeLang)} · x{order.qty}</small></div>
            <span className="tag">{t(order.status, { defaultValue: order.status })}</span>
          </div>
        )) : <p className="muted">{t("noOrders")}</p>}
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
