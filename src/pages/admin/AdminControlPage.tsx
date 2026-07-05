import { FileText, Video } from "lucide-react";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function AdminControlPage() {
  return (
    <WorkspaceLayout role="admin" active="control">
      <PageTitle title="Бошқарув панели" />
      <div className="control-grid">
        <div className="panel panel-body">
          <div className="zone-title"><Video /> Конференция yaratish</div>
          <p className="muted">Barcha kompaniyalar uchun onlayn uchrashuv tashkil eting.</p>
          <a className="btn btn-primary" href="/admin/conferences">Конференция yaratish</a>
        </div>
        <div className="panel panel-body">
          <div className="zone-title"><FileText /> Oylik umumiy hisobot</div>
          <p className="muted">Barcha kompaniyalar bo'yicha yagona hisobot.</p>
          <button className="btn btn-primary">Monthly Report ALL</button>
        </div>
      </div>
    </WorkspaceLayout>
  );
}
