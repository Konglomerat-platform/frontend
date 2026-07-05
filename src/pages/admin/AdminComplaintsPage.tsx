import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { localize } from "../../lib/format";
import { listComplaints } from "../../services/supportService";

export function AdminComplaintsPage() {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.resolvedLanguage || i18n.language;
  const { data: complaints = [] } = useQuery({ queryKey: ["complaints"], queryFn: listComplaints });
  return (
    <WorkspaceLayout role="admin" active="complaints">
      <PageTitle title={t("complaints")} />
      <Panel title={t("complaintsList")} count={complaints.length}>
        {complaints.map((item) => (
          <Link className="list-row" key={item.id} to={`/admin/complaints/${item.id}`}>
            <div className="avatar">{item.from[0]}</div>
            <div className="grow"><b>{item.from}</b><small>{localize(item.text, activeLang)}</small></div>
            <span className={`tag ${item.status === "resolved" ? "green" : "amber"}`}>{t(item.status, { defaultValue: item.status })}</span>
          </Link>
        ))}
      </Panel>
    </WorkspaceLayout>
  );
}
