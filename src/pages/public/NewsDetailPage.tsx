import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { localize } from "../../lib/format";
import { getNewsArticle, listNews } from "../../services/contentService";
import { NewsCard } from "../../components/cards/NewsCard";

export function NewsDetailPage() {
  const { id = "" } = useParams();
  const { data: article } = useQuery({ queryKey: ["news", id], queryFn: () => getNewsArticle(id), enabled: !!id });
  const { data: news = [] } = useQuery({ queryKey: ["news"], queryFn: listNews });

  if (!article) return <><SiteHeader /><main className="section container">Loading...</main></>;
  const body = article.body?.ru || [localize(article.text)];

  return (
    <>
      <SiteHeader />
      <main className="section container">
        <Link className="crumb" to="/#news">Новости</Link>
        <article className="card">
          {article.image ? <div className="article-banner"><img className="article-banner-img" src={article.image} alt="" /></div> : null}
          <time>{article.date}</time>
          <h1>{localize(article.title)}</h1>
          {body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <h2 className="mt-3">Другие новости</h2>
        <div className="grid cols-2 mt-2">
          {news.filter((item) => item.id !== article.id).slice(0, 2).map((item) => <NewsCard key={item.id} article={item} />)}
        </div>
      </main>
    </>
  );
}
