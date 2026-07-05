import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { ProductCard } from "../../components/cards/ProductCard";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { listProducts } from "../../services/catalogService";
import { getFavorites } from "../../services/commerceService";

export function FavoritesPage() {
  const { t } = useTranslation();
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
        <span className="eyebrow">{t("favorites")}</span>
        <h1>{t("selectedProducts")}</h1>
        <form className="card fav-signin" onSubmit={submit}>
          <p className="muted">{t("favoritesPrompt")}</p>
          <input className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" />
          <button className="btn btn-primary">{t("open")}</button>
        </form>
        <div className="grid cols-4 market-grid mt-3">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </main>
    </>
  );
}
