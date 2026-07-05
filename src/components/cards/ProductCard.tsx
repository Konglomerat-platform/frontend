import { Heart, Package } from "lucide-react";
import { Link } from "react-router";

import { localize } from "../../lib/format";
import type { Product } from "../../types";

export function ProductCard({ product, lang = "ru" }: { product: Product; lang?: string }) {
  const image = product.image || product.images?.[0];
  return (
    <Link className="card product-card" to={`/products/${product.id}`}>
      <div className="product-thumb">
        {image ? <img className="prod-img" src={image} alt="" /> : product.ico || product.icon ? <span className="prod-emoji">{product.ico || product.icon}</span> : <Package />}
        <button type="button" className="fav-btn" aria-label="Favorite" onClick={(event) => event.preventDefault()}>
          <Heart />
        </button>
      </div>
      <div className="product-body">
        <span className="price">{product.price}</span>
        <div className="product-company">{product.company}</div>
        <h4 className="product-name">{localize(product.name, lang)}</h4>
        <p className="product-desc">{localize(product.desc, lang)}</p>
        <span className="btn btn-soft btn-sm btn-block product-cta">Подробнее</span>
      </div>
    </Link>
  );
}
