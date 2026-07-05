import { Heart, Package } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { localize } from "../../lib/format";
import type { Product } from "../../types";

export function ProductCard({ product, lang }: { product: Product; lang?: string }) {
  const { t, i18n } = useTranslation();
  const activeLang = lang || i18n.resolvedLanguage || i18n.language;
  const image = product.image || product.images?.[0];

  return (
    <Link className="card product-card" to={`/products/${product.id}`}>
      <div className="product-thumb">
        {image ? <img className="prod-img" src={image} alt="" /> : product.ico || product.icon ? <span className="prod-emoji">{product.ico || product.icon}</span> : <Package />}
        <button type="button" className="fav-btn" aria-label={t("favorite")} onClick={(event) => event.preventDefault()}>
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
