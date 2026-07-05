import { Newspaper } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { localize } from "../../lib/format";
import type { NewsArticle } from "../../types";

export function NewsCard({ article, lang }: { article: NewsArticle; lang?: string }) {
  const { i18n } = useTranslation();
  const activeLang = lang || i18n.resolvedLanguage || i18n.language;

  return (
    <Link className="card news-item" to={`/news/${article.id}`}>
      <div className="news-ico">
        {article.image ? <img className="news-thumb" src={article.image} alt="" /> : article.ico || <Newspaper />}
      </div>
      <div>
        <time>{article.date}</time>
        <h4>{localize(article.title, activeLang)}</h4>
        <p className="muted">{localize(article.text, activeLang)}</p>
      </div>
    </Link>
  );
}
