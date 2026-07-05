import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { localize } from "../../lib/format";
import { createRndSubmission, listRndSubmissions } from "../../services/innovationService";

export function CompanyRndPage() {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const { data: rnd = [] } = useQuery({ queryKey: ["rnd"], queryFn: listRndSubmissions });
  const create = useMutation({ mutationFn: createRndSubmission, onSuccess: () => qc.invalidateQueries({ queryKey: ["rnd"] }) });
  const activeLang = i18n.resolvedLanguage || i18n.language;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create.mutate({ name: { ru: data.get("name") }, cat: data.get("cat"), desc: { ru: data.get("desc") }, patent: data.get("patent") === "on" });
    event.currentTarget.reset();
  }

  return (
    <WorkspaceLayout role="company" active="rnd">
      <PageTitle title={t("rndCenter")} sub={t("rndSubtitle")} />
      <form className="panel panel-body" onSubmit={submit}>
        <div className="form-group"><label>{t("projectName")}</label><input className="form-control" name="name" required /></div>
        <div className="form-group"><label>{t("direction")}</label><input className="form-control" name="cat" required /></div>
        <div className="form-group"><label>{t("description")}</label><textarea className="form-control" name="desc" rows={3} /></div>
        <label className="module-row"><input name="patent" type="checkbox" /> {t("patentRequest")}</label>
        <button className="btn btn-primary">{t("send")}</button>
      </form>
      <Panel title={t("reviewQueue")} count={rnd.length}>
        {rnd.map((item) => <div className="list-row" key={item.id}><div className="grow"><b>{localize(item.name, activeLang)}</b><small>{item.cat} · {t(item.status, { defaultValue: item.status })}</small></div></div>)}
      </Panel>
    </WorkspaceLayout>
  );
}
