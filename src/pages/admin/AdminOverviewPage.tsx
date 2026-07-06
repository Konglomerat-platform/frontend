import { Bot, Building2, FileText, FlaskConical, Package, Video } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { getStats } from "../../services/operationsService";

export function AdminOverviewPage() {
  const { t } = useTranslation();
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: getStats });

  return (
    <WorkspaceLayout role="admin" active="overview">
      <PageTitle title={t("adminCenter")} sub={t("adminCenterSub")} />
      <div className="grid cols-4">
        <Stat icon={<Building2 />} label={t("companies")} value={stats?.companies || 30} />
        <Stat icon={<Bot />} label={t("aiRequests")} value={stats?.aiRequests || 4820} />
        <Stat icon={<FlaskConical />} label={t("startups")} value={stats?.startups || 10} />
        <Stat icon={<Package />} label={t("showrooms")} value={stats?.showrooms || 0} />
        <Stat icon={<FileText />} label={t("complaints")} value={stats?.complaints || 0} />
        <Stat icon={<Video />} label={t("conferences")} value={stats?.conferences || 0} />
      </div>
    </WorkspaceLayout>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <div className="card stat-tile">
      <div className="s-top"><span className="s-ico">{icon}</span></div>
      <span className="s-num">{value}</span>
      <span className="s-lbl">{label}</span>
    </div>
  );
}
