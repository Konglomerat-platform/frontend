import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { listRndSubmissions, updateRndSubmission } from "../../services/innovationService";
import { localize } from "../../lib/format";

export function AdminRndPage() {
  const qc = useQueryClient();
  const { data: rnd = [] } = useQuery({ queryKey: ["rnd-admin"], queryFn: listRndSubmissions });
  function decide(id: string, status: string) {
    updateRndSubmission(id, { status }).then(() => qc.invalidateQueries({ queryKey: ["rnd-admin"] }));
  }
  return (
    <WorkspaceLayout role="admin" active="rnd">
      <PageTitle title="R&D центр" />
      <Panel title="Очередь" count={rnd.length}>
        {rnd.map((item) => (
          <div className={`card rnd-card ${item.status}`} key={item.id}>
            <h3>{localize(item.name)}</h3>
            <div className="rnd-meta"><span>{item.company}</span><span>{item.cat}</span><span>{item.status}</span></div>
            <p className="muted">{localize(item.desc)}</p>
            <div className="row">
              <button className="btn btn-primary btn-sm" onClick={() => decide(item.id, "approved")}>Одобрить</button>
              <button className="btn btn-danger btn-sm" onClick={() => decide(item.id, "rejected")}>Отклонить</button>
            </div>
          </div>
        ))}
      </Panel>
    </WorkspaceLayout>
  );
}
