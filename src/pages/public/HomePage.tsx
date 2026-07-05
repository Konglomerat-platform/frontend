import { Bot, Building2, Check, ChevronRight, Newspaper } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { ProductCard } from "../../components/cards/ProductCard";
import { NewsCard } from "../../components/cards/NewsCard";
import { SiteFooter } from "../../components/layout/SiteFooter";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { listProducts } from "../../services/catalogService";
import { listNews } from "../../services/contentService";
import { getStats } from "../../services/operationsService";

export function HomePage() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const { data: news = [] } = useQuery({ queryKey: ["news"], queryFn: listNews });
  const platformHref = user?.role === "admin" ? "/admin" : user?.role === "company" ? "/company" : "/login";
  const platformLabel = user ? t("goToCabinet") : t("heroPrimary");

  useEffect(() => {
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  }, [location.hash]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero container">
          <div>
            <span className="eyebrow">{t("heroEyebrow")}</span>
            <h1>{t("heroTitle")}</h1>
            <p className="lead">{t("heroLead")}</p>
            <div className="hero-actions">
              <a className="btn btn-primary" href={platformHref}>
                {platformLabel} <ChevronRight />
              </a>
              <a className="btn btn-ghost" href="#showrooms">
                {t("heroSecondary")}
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="num">{stats?.companies || 30}</span>
                <span className="lbl">{t("companies")}</span>
              </div>
              <div>
                <span className="num">{stats?.showrooms || products.length}</span>
                <span className="lbl">{t("showrooms")}</span>
              </div>
              <div>
                <span className="num">{stats?.aiRequests || 4820}</span>
                <span className="lbl">{t("aiRequests")}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section container" id="about">
          <span className="eyebrow">{t("about")}</span>
          <h2>{t("conceptTitle")}</h2>
          <p className="section-sub">{t("conceptLead")}</p>
          <div className="grid cols-3 mt-3">
            <InfoCard icon={<Building2 />} title={t("unifiedManagement")} text={t("unifiedManagementText")} />
            <InfoCard icon={<Bot />} title={t("aiCore")} text={t("aiCoreText")} />
            <InfoCard icon={<Check />} title={t("scale")} text={t("scaleText")} />
          </div>
        </section>

        <section className="section container" id="showrooms">
          <span className="eyebrow">{t("showrooms")}</span>
          <h2>{t("productCatalog")}</h2>
          <p className="section-sub">{t("productCatalogLead")}</p>
          <div className="grid cols-4 market-grid mt-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="section container" id="news">
          <span className="eyebrow">{t("news")}</span>
          <h2>{t("companyFeed")}</h2>
          <div className="grid cols-2 mt-3">
            {news.slice(0, 4).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}

function InfoCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="card">
      <div className="card-ico">{icon}</div>
      <h3>{title}</h3>
      <p className="muted">{text}</p>
    </div>
  );
}
