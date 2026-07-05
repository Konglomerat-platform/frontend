import { Heart, Package } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useUi } from "../../context/UiContext";
import { localize } from "../../lib/format";
import { getFavorites, replaceFavorites } from "../../services/commerceService";
import type { Product } from "../../types";

export function ProductCard({ product, lang }: { product: Product; lang?: string }) {
  const { t, i18n } = useTranslation();
  const { prompt, toast } = useUi();
  const qc = useQueryClient();
  const activeLang = lang || i18n.resolvedLanguage || i18n.language;
  const [visitorEmail, setVisitorEmail] = useState(localStorage.getItem("kg_visitor_email") || "");
  const { data: favorites } = useQuery({ queryKey: ["favorites", visitorEmail], queryFn: () => getFavorites(visitorEmail), enabled: !!visitorEmail });
  const saveFavorites = useMutation({
    mutationFn: ({ email, ids }: { email: string; ids: string[] }) => replaceFavorites(email, ids),
    onSuccess: (data, variables) => {
      qc.setQueryData(["favorites", variables.email], data);
      qc.invalidateQueries({ queryKey: ["favorites", variables.email] });
    },
  });
  const image = product.image || product.images?.[0];
  const isFavorite = Boolean(favorites?.ids.includes(product.id));

  async function toggleFavorite(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    let email = localStorage.getItem("kg_visitor_email") || "";
    if (!email) {
      const next = await prompt({ title: t("emailLogin"), placeholder: "email@example.com", ok: t("login") });
      email = (next || "").trim();
      if (!email) return;
      localStorage.setItem("kg_visitor_email", email);
      setVisitorEmail(email);
    }

    const current = email === visitorEmail ? favorites?.ids || [] : (await getFavorites(email)).ids;
    const ids = current.includes(product.id) ? current.filter((id) => id !== product.id) : [...current, product.id];
    await saveFavorites.mutateAsync({ email, ids });
    toast(ids.includes(product.id) ? t("favoriteSaved") : t("favoriteRemoved"), undefined, "success");
  }

  return (
    <Link className="card product-card" to={`/products/${product.id}`}>
      <div className="product-thumb">
        {image ? <img className="prod-img" src={image} alt="" /> : product.ico || product.icon ? <span className="prod-emoji">{product.ico || product.icon}</span> : <Package />}
        <button type="button" className={`fav-btn ${isFavorite ? "on" : ""}`} aria-label={t("favorite")} onClick={toggleFavorite}>
          <Heart />
        </button>
      </div>
      <div className="product-body">
        <span className="price">{product.price}</span>
        <div className="product-company">{product.company}</div>
        <h4 className="product-name">{localize(product.name, activeLang)}</h4>
        <p className="product-desc">{localize(product.desc, activeLang)}</p>
        <span className="btn btn-soft btn-sm btn-block product-cta">{t("details")}</span>
      </div>
    </Link>
  );
}
