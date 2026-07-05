import { Newspaper } from "lucide-react";
import { Link } from "react-router";

import { localize } from "../../lib/format";
import type { NewsArticle } from "../../types";

export function NewsCard({ article, lang = "ru" }: { article: NewsArticle; lang?: string }) {
  return (
    <Link className="card news-item" to={`/news/${article.id}`}>
      <div className="news-ico">
        {article.image ? <img className="news-thumb" src={article.image} alt="" /> : article.ico || <Newspaper />}
      </div>
      <div>
        <time>{article.date}</time>
        <h4>{localize(article.title, lang)}</h4>
        <p className="muted">{localize(article.text, lang)}</p>
      </div>
    </Link>
  );
}
