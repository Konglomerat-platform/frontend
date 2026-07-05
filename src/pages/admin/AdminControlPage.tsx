import { FileText, Video } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function AdminControlPage() {
  const { t } = useTranslation();

  return (
    <WorkspaceLayout role="admin" active="control">
      <PageTitle title={t("controlPanel")} />
      <div className="control-grid">
        <div className="panel panel-body">
          <div className="zone-title"><Video /> {t("createConference")}</div>
          <p className="muted">{t("createConferenceHint")}</p>
          <a className="btn btn-primary" href="/admin/conferences">{t("createConference")}</a>
        </div>
        <div className="panel panel-body">
          <div className="zone-title"><FileText /> {t("monthlyReportAll")}</div>
          <p className="muted">{t("monthlyReportAllHint")}</p>
          <button className="btn btn-primary">{t("monthlyReportAll")}</button>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
