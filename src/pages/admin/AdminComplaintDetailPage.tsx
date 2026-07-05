import { FormEvent } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { getComplaint, updateComplaint } from "../../services/supportService";

export function AdminComplaintDetailPage() {
  const { id = "" } = useParams();
  const qc = useQueryClient();
  const { data: complaint } = useQuery({ queryKey: ["complaint", id], queryFn: () => getComplaint(id), enabled: !!id });
  const update = useMutation({ mutationFn: (body: unknown) => updateComplaint(id, body), onSuccess: () => qc.invalidateQueries({ queryKey: ["complaint", id] }) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate({ reply: new FormData(event.currentTarget).get("reply") });
  }

  return (
    <WorkspaceLayout role="admin" active="complaints">
      <PageTitle title="Жалоба" />
      <Link className="crumb" to="/admin/complaints">К жалобам</Link>
      {complaint ? (
        <div className="panel panel-body">
          <h2>{complaint.from}</h2>
          <p className="muted">{complaint.contact}</p>
          <p>{typeof complaint.text === "string" ? complaint.text : complaint.text.ru}</p>
          {complaint.reply ? <div className="notify-banner"><b>Ответ администратора</b><span>{complaint.reply}</span></div> : null}
          <form onSubmit={submit}>
            <div className="form-group"><label>Ответ</label><textarea className="form-control" name="reply" rows={4} defaultValue={complaint.reply || ""} /></div>
            <button className="btn btn-primary">Ответить</button>
            <button className="btn btn-soft" type="button" onClick={() => update.mutate({ status: "resolved" })}>Отметить решённой</button>
          </form>
        </div>
      ) : null}
    </WorkspaceLayout>
  );
}
