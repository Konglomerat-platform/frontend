import { Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { createComplaint } from "../../services/supportService";

export function ComplaintPage() {
  const { t } = useTranslation();
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
      <main className="complaint-page container">
        <section className="card complaint-card">
          <h1>{t("sendComplaint")}</h1>
          {sent ? (
            <div className="success"><Check /> {t("complaintSent")}</div>
          ) : (
            <form onSubmit={submit}>
              <div className="form-group"><label>{t("nameOrCompany")}</label><input className="form-control" name="name" required /></div>
              <div className="form-group"><label>{t("emailOrPhone")}</label><input className="form-control" name="contact" required /></div>
              <div className="form-group"><label>{t("complaintText")}</label><textarea className="form-control" name="text" rows={5} required /></div>
              <button className="btn btn-primary btn-block">{t("send")}</button>
            </form>
          )}
        </section>
      </main>
    </>
  );
}
