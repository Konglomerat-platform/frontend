import { FileText } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { generateReport } from "../../services/operationsService";

export function CompanyReportPage() {
  const { t } = useTranslation();
  const [report, setReport] = useState<Record<string, string> | null>(null);

  return (
    <WorkspaceLayout role="company" active="report">
      <PageTitle title={t("monthlyReport")} />
      <div className="panel panel-body center">
        <FileText size={48} />
        <p className="muted">{t("monthlyReportHint")}</p>
        <button className="btn btn-primary" onClick={() => generateReport().then(setReport)}>{t("openReport")}</button>
        {report ? <pre>{JSON.stringify(report, null, 2)}</pre> : null}
      </div>
    </WorkspaceLayout>
  );
}
