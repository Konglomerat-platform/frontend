import { Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { createComplaint } from "../../services/supportService";

export function ComplaintPage() {
  const [sent, setSent] = useState(false);
  const mutation = useMutation({ mutationFn: createComplaint, onSuccess: () => setSent(true) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    mutation.mutate({ name: data.get("name"), contact: data.get("contact"), text: data.get("text") });
  }

  return (
    <>
      <SiteHeader />
      <main className="section container">
        <section className="card auth-card">
          <h1>Отправить жалобу</h1>
          {sent ? (
            <div className="success"><Check /> Жалоба отправлена!</div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-group"><label>Имя или компания</label><input className="form-control" name="name" required /></div>
              <div className="form-group"><label>Email или телефон</label><input className="form-control" name="contact" required /></div>
              <div className="form-group"><label>Текст жалобы</label><textarea className="form-control" name="text" rows={5} required /></div>
              <button className="btn btn-primary btn-block">Отправить</button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
