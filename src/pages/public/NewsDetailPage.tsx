import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { NewsCard } from "../../components/cards/NewsCard";
import { SiteHeader } from "../../components/layout/SiteHeader";
import { localize } from "../../lib/format";
import { getNewsArticle, listNews } from "../../services/contentService";
import type { Lang } from "../../types";

export function NewsDetailPage() {
  const { id = "" } = useParams();
  const { t, i18n } = useTranslation();
  const { data: article } = useQuery({ queryKey: ["news", id], queryFn: () => getNewsArticle(id), enabled: !!id });
  const { data: news = [] } = useQuery({ queryKey: ["news"], queryFn: listNews });
  const activeLang = (i18n.resolvedLanguage || i18n.language) as Lang;

  if (!article) return <><SiteHeader /><main className="section container">{t("loading")}</main></>;
  const body = article.body?.[activeLang] || [localize(article.text, activeLang)];

  return (
    <>
      <SiteHeader />
      <main className="section container">
        <Link className="crumb" to="/#news">{t("news")}</Link>
        <article className="card">
          {article.image ? <div className="article-banner"><img className="article-banner-img" src={article.image} alt="" /></div> : null}
          <time>{article.date}</time>
          <h1>{localize(article.title, activeLang)}</h1>
          {body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <h2 className="mt-3">{t("otherNews")}</h2>
        <div className="grid cols-2 mt-2">
          {news.filter((item) => item.id !== article.id).slice(0, 2).map((item) => <NewsCard key={item.id} article={item} />)}
        </div>
      </main>
    </>
  );
}
