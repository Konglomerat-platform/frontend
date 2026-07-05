import { Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { localize } from "../../lib/format";
import { createOrder } from "../../services/commerceService";
import { getProduct } from "../../services/catalogService";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation();
  const [sent, setSent] = useState(false);
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id), enabled: !!id });
  const order = useMutation({ mutationFn: createOrder, onSuccess: () => setSent(true) });
  const activeLang = i18n.resolvedLanguage || i18n.language;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    order.mutate({ productId: id, name: data.get("name"), contact: data.get("contact"), qty: data.get("qty") });
  }

  if (!product) return <><SiteHeader /><main className="section container">{t("loading")}</main></>;
  const image = product.image || product.images?.[0];

  return (
    <>
      <SiteHeader />
      <main className="detail">
        <Link className="crumb" to="/#showrooms">{t("showrooms")}</Link>
        <div className="detail-grid">
          <section>
            <div className="detail-media detail-visual">{image ? <img className="detail-img" src={image} alt="" /> : <span>{product.ico || product.icon}</span>}</div>
            <h1>{localize(product.name, activeLang)}</h1>
            <p className="muted">{localize(product.desc, activeLang)}</p>
            <ul className="feature-list">
              <li><Check /> {t("guaranteedQuality")}</li>
              <li><Check /> {t("verifiedByKonglomerat")}</li>
              <li><Check /> {t("nationwideDelivery")}</li>
            </ul>
          </section>
          <aside className="card buy-panel">
            <div className="detail-price">{product.price}</div>
            <p className="muted">{product.company}</p>
            {sent ? (
              <div className="success"><Check /> {t("orderAccepted")}</div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-group"><label>{t("name")}</label><input className="form-control" name="name" required /></div>
                <div className="form-group"><label>{t("contact")}</label><input className="form-control" name="contact" required /></div>
                <div className="form-group"><label>{t("quantity")}</label><input className="form-control" name="qty" defaultValue="1" type="number" min="1" /></div>
                <button className="btn btn-primary btn-block">{t("placeOrder")}</button>
              </form>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
