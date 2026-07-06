import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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
  const [imageIndex, setImageIndex] = useState(0);
  const { data: product } = useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id), enabled: !!id });
  const order = useMutation({ mutationFn: createOrder, onSuccess: () => setSent(true) });
  const activeLang = i18n.resolvedLanguage || i18n.language;
  const productImages = product?.images?.length ? product.images : product?.image ? [product.image] : [];
  const image = productImages[imageIndex] || productImages[0];

  useEffect(() => {
    setImageIndex(0);
  }, [id]);

  useEffect(() => {
    if (imageIndex >= productImages.length) setImageIndex(0);
  }, [imageIndex, productImages.length]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    order.mutate({ productId: id, name: data.get("name"), contact: data.get("contact"), qty: data.get("qty") });
  }

  if (!product) return <><SiteHeader /><main className="section container">{t("loading")}</main></>;
  const hasGallery = productImages.length > 1;

  return (
    <>
      <SiteHeader />
      <main className="detail">
        <Link className="crumb" to="/#showrooms">{t("showrooms")}</Link>
        <div className="detail-grid">
          <section>
            <div className="detail-gallery">
              <div className="detail-media detail-visual">
                {image ? <img className="detail-img" src={image} alt="" /> : <span>{product.ico || product.icon}</span>}
                {hasGallery ? (
                  <>
                    <button
                      className="gallery-arrow prev"
                      type="button"
                      onClick={() => setImageIndex((value) => (value - 1 + productImages.length) % productImages.length)}
                      aria-label="Previous image"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      className="gallery-arrow next"
                      type="button"
                      onClick={() => setImageIndex((value) => (value + 1) % productImages.length)}
                      aria-label="Next image"
                    >
                      <ChevronRight />
                    </button>
                  </>
                ) : null}
              </div>
              {hasGallery ? (
                <div className="gallery-thumbs">
                  {productImages.map((item, index) => (
                    <button
                      className={index === imageIndex ? "active" : ""}
                      type="button"
                      key={`${item}-${index}`}
                      onClick={() => setImageIndex(index)}
                      aria-label={`Image ${index + 1}`}
                    >
                      <img src={item} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
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
