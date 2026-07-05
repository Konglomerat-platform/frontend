import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { listComplaints } from "../../services/supportService";

export function AdminComplaintsPage() {
  const { data: complaints = [] } = useQuery({ queryKey: ["complaints"], queryFn: listComplaints });
  return (
    <WorkspaceLayout role="admin" active="complaints">
      <PageTitle title="Жалобы" />
      <Panel title="Список жалоб" count={complaints.length}>
        {complaints.map((item) => (
          <Link className="list-row" key={item.id} to={`/admin/complaints/${item.id}`}>
            <div className="avatar">{item.from[0]}</div>
            <div className="grow"><b>{item.from}</b><small>{typeof item.text === "string" ? item.text : item.text.ru}</small></div>
            <span className={`tag ${item.status === "resolved" ? "green" : "amber"}`}>{item.status}</span>
          </Link>
        ))}
      </Panel>
    </WorkspaceLayout>
  );
}
