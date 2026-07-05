import { FileText } from "lucide-react";
import { useState } from "react";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { generateReport } from "../../services/operationsService";

export function CompanyReportPage() {
  const [report, setReport] = useState<Record<string, string> | null>(null);
  return (
    <WorkspaceLayout role="company" active="report">
      <PageTitle title="Мой месячный отчёт" />
      <div className="panel panel-body center">
        <FileText size={48} />
        <p className="muted">Просмотрите индивидуальный месячный отчёт этой компании.</p>
        <button className="btn btn-primary" onClick={() => generateReport().then(setReport)}>Открыть отчёт</button>
        {report ? <pre>{JSON.stringify(report, null, 2)}</pre> : null}
      </div>
    </WorkspaceLayout>
  );
}
