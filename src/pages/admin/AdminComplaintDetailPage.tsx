import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { localize } from "../../lib/format";
import { getComplaint, updateComplaint } from "../../services/supportService";

export function AdminComplaintDetailPage() {
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation();
  const activeLang = i18n.resolvedLanguage || i18n.language;
  const qc = useQueryClient();
  const { data: complaint } = useQuery({ queryKey: ["complaint", id], queryFn: () => getComplaint(id), enabled: !!id });
  const update = useMutation({ mutationFn: (body: unknown) => updateComplaint(id, body), onSuccess: () => qc.invalidateQueries({ queryKey: ["complaint", id] }) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate({ reply: new FormData(event.currentTarget).get("reply") });
  }

  return (
    <WorkspaceLayout role="admin" active="complaints">
      <PageTitle title={t("complaint")} />
      <Link className="crumb" to="/admin/complaints">{t("backToComplaints")}</Link>
      {complaint ? (
        <div className="panel panel-body">
          <h2>{complaint.from}</h2>
          <p className="muted">{complaint.contact}</p>
          <p>{localize(complaint.text, activeLang)}</p>
          {complaint.reply ? <div className="notify-banner"><b>{t("adminReply")}</b><span>{complaint.reply}</span></div> : null}
          <form onSubmit={submit}>
            <div className="form-group"><label>{t("reply")}</label><textarea className="form-control" name="reply" rows={4} defaultValue={complaint.reply || ""} /></div>
            <button className="btn btn-primary">{t("replyAction")}</button>
            <button className="btn btn-soft" type="button" onClick={() => update.mutate({ status: "resolved" })}>{t("markResolved")}</button>
          </form>
        </div>
      ) : null}
    </WorkspaceLayout>
  );
}
