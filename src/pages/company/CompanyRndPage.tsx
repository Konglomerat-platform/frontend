import { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { createRndSubmission, listRndSubmissions } from "../../services/innovationService";
import { localize } from "../../lib/format";

export function CompanyRndPage() {
  const { i18n } = useTranslation();
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
      <PageTitle title="R&D центр" sub="Startap loyihalar va patent arizalarini yuboring." />
      <form className="panel panel-body" onSubmit={submit}>
        <div className="form-group"><label>Название проекта</label><input className="form-control" name="name" required /></div>
        <div className="form-group"><label>Направление</label><input className="form-control" name="cat" required /></div>
        <div className="form-group"><label>Описание</label><textarea className="form-control" name="desc" rows={3} /></div>
        <label className="module-row"><input name="patent" type="checkbox" /> Патентная заявка</label>
        <button className="btn btn-primary">Отправить</button>
      </form>
      <Panel title="Очередь рассмотрения" count={rnd.length}>
        {rnd.map((item) => <div className="list-row" key={item.id}><div className="grow"><b>{localize(item.name, activeLang)}</b><small>{item.cat} · {item.status}</small></div></div>)}
      </Panel>
    </WorkspaceLayout>
  );
}
