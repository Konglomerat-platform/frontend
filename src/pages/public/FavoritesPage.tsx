import { FormEvent, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { ProductCard } from "../../components/cards/ProductCard";
import { getFavorites } from "../../services/commerceService";
import { listProducts } from "../../services/catalogService";

export function FavoritesPage() {
  const [email, setEmail] = useState(localStorage.getItem("kg_visitor_email") || "");
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const { data, refetch } = useQuery({ queryKey: ["favorites", email], queryFn: () => getFavorites(email), enabled: !!email });
  const items = products.filter((product) => data?.ids.includes(product.id));

  function submit(event: FormEvent) {
    event.preventDefault();
    localStorage.setItem("kg_visitor_email", email);
    refetch();
  }

  return (
    <>
      <SiteHeader />
      <main className="section container">
        <span className="eyebrow">Избранное</span>
        <h1>Избранные товары</h1>
        <form className="card fav-signin" onSubmit={submit}>
          <p className="muted">Введите email, чтобы открыть сохранённые товары.</p>
          <input className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" />
          <button className="btn btn-primary">Открыть</button>
        </form>
        <div className="grid cols-4 market-grid mt-3">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </main>
    </>
  );
}
