import { Bot, Building2, FileText, FlaskConical, Package, Video } from "lucide-react";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { getStats } from "../../services/operationsService";

export function AdminOverviewPage() {
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: getStats });
  return (
    <WorkspaceLayout role="admin" active="overview">
      <PageTitle title="Бошқарув маркази" sub="Konglomerat - 30 компаний под единым контролем" />
      <div className="grid cols-4">
        <Stat icon={<Building2 />} label="Компании" value={stats?.companies || 30} />
        <Stat icon={<Bot />} label="AI запросы" value={stats?.aiRequests || 4820} />
        <Stat icon={<FlaskConical />} label="Стартапы" value={stats?.startups || 10} />
        <Stat icon={<Package />} label="Шоурумы" value={stats?.showrooms || 0} />
        <Stat icon={<FileText />} label="Жалобы" value={stats?.complaints || 0} />
        <Stat icon={<Video />} label="Конференции" value={stats?.conferences || 0} />
      </div>
      <Panel title="AI активность">
        <div className="chart-holder"><div className="bars"><span className="bar" style={{ height: "55%" }} /><span className="bar" style={{ height: "80%" }} /><span className="bar" style={{ height: "40%" }} /><span className="bar" style={{ height: "72%" }} /></div></div>
      </Panel>
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
