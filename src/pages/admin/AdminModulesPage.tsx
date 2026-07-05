import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { listManagementModules, updateManagementModule } from "../../services/operationsService";

export function AdminModulesPage() {
  const qc = useQueryClient();
  const { data: modules = {} } = useQuery({ queryKey: ["modules"], queryFn: listManagementModules });
  const keys = Object.keys(modules);
  return (
    <WorkspaceLayout role="admin" active="modules">
      <PageTitle title="Бошқарув модуллари" sub="13 блок · 100 модул" />
      <div>
        {keys.map((key) => (
          <div className="module-block open" key={key}>
            <div className="mb-head"><div className="mb-titles"><b>{key}</b><small>{modules[key] ? "Включено" : "Выключено"}</small></div></div>
            <div className="mb-body">
              <div className="module-row">
                <span className="m-name">{key}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={modules[key]}
                    onChange={(event) => updateManagementModule(key, event.target.checked).then(() => qc.invalidateQueries({ queryKey: ["modules"] }))}
                  />
                  <span className="slider" />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WorkspaceLayout>
  );
}
