import { Check } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useParams } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { localize } from "../../lib/format";
import { createOrder } from "../../services/commerceService";
import { getProduct } from "../../services/catalogService";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  const [sent, setSent] = useState(false);
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id), enabled: !!id });
  const order = useMutation({ mutationFn: createOrder, onSuccess: () => setSent(true) });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    order.mutate({ productId: id, name: data.get("name"), contact: data.get("contact"), qty: data.get("qty") });
  }

  if (!product) return <><SiteHeader /><main className="section container">Loading...</main></>;
  const image = product.image || product.images?.[0];

  return (
    <>
      <SiteHeader />
      <main className="detail">
        <Link className="crumb" to="/#showrooms">Шоурумы</Link>
        <div className="detail-grid">
          <section>
            <div className="detail-media detail-visual">{image ? <img className="detail-img" src={image} alt="" /> : <span>{product.ico || product.icon}</span>}</div>
            <h1>{localize(product.name)}</h1>
            <p className="muted">{localize(product.desc)}</p>
            <ul className="feature-list">
              <li><Check /> Гарантированное качество</li>
              <li><Check /> Подтверждено Konglomerat</li>
              <li><Check /> Доставка по всей стране</li>
            </ul>
          </section>
          <aside className="card buy-panel">
            <div className="detail-price">{product.price}</div>
            <p className="muted">{product.company}</p>
            {sent ? (
              <div className="success"><Check /> Заявка принята!</div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-group"><label>Имя</label><input className="form-control" name="name" required /></div>
                <div className="form-group"><label>Телефон</label><input className="form-control" name="contact" required /></div>
                <div className="form-group"><label>Количество</label><input className="form-control" name="qty" defaultValue="1" type="number" min="1" /></div>
                <button className="btn btn-primary btn-block">Оформить заказ</button>
              </form>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
