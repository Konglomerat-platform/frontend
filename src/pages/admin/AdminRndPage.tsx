import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { localize } from "../../lib/format";
import { listRndSubmissions, updateRndSubmission } from "../../services/innovationService";

export function AdminRndPage() {
  const { t, i18n } = useTranslation();
  const activeLang = i18n.resolvedLanguage || i18n.language;
  const qc = useQueryClient();
  const { data: rnd = [] } = useQuery({ queryKey: ["rnd-admin"], queryFn: listRndSubmissions });
  function decide(id: string, status: string) {
    updateRndSubmission(id, { status }).then(() => qc.invalidateQueries({ queryKey: ["rnd-admin"] }));
  }
  return (
    <WorkspaceLayout role="admin" active="rnd">
      <PageTitle title={t("rndCenter")} />
      <Panel title={t("queue")} count={rnd.length}>
        {rnd.map((item) => (
          <div className={`card rnd-card ${item.status}`} key={item.id}>
            <h3>{localize(item.name, activeLang)}</h3>
            <div className="rnd-meta"><span>{item.company}</span><span>{item.cat}</span><span>{t(item.status, { defaultValue: item.status })}</span></div>
            <p className="muted">{localize(item.desc, activeLang)}</p>
            <div className="row">
              <button className="btn btn-primary btn-sm" onClick={() => decide(item.id, "approved")}>{t("approve")}</button>
              <button className="btn btn-danger btn-sm" onClick={() => decide(item.id, "rejected")}>{t("reject")}</button>
            </div>
          </div>
        ))}
      </Panel>
    </WorkspaceLayout>
  );
}
