import { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageTitle } from "../../components/ui/PageTitle";
import { Panel } from "../../components/ui/Panel";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { createConference, listConferences } from "../../services/operationsService";

export function AdminConferencesPage() {
  const qc = useQueryClient();
  const { data: conferences = [] } = useQuery({ queryKey: ["conferences"], queryFn: listConferences });
  const create = useMutation({ mutationFn: createConference, onSuccess: () => qc.invalidateQueries({ queryKey: ["conferences"] }) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    create.mutate({ name: data.get("name"), date: data.get("date"), time: data.get("time"), desc: data.get("desc"), link: data.get("link") });
    event.currentTarget.reset();
  }

  return (
    <WorkspaceLayout role="admin" active="conferences">
      <PageTitle title="Конференции" />
      <form className="panel panel-body" onSubmit={submit}>
        <div className="form-group"><label>Название</label><input className="form-control" name="name" required /></div>
        <div className="grid cols-2"><div className="form-group"><label>Дата</label><input className="form-control" name="date" type="date" required /></div><div className="form-group"><label>Время</label><input className="form-control" name="time" type="time" required /></div></div>
        <div className="form-group"><label>Описание</label><textarea className="form-control" name="desc" /></div>
        <div className="form-group"><label>Ссылка</label><input className="form-control" name="link" /></div>
        <button className="btn btn-primary">Создать</button>
      </form>
      <Panel title="Запланировано" count={conferences.length}>
        {conferences.map((item) => <div className="list-row" key={item.id}><div className="grow"><b>{item.name}</b><small>{item.date} · {item.time}</small></div><span className="tag">{item.joined}/{item.total}</span></div>)}
      </Panel>
    </WorkspaceLayout>
  );
}
