import { Bot, Building2, Check, ChevronRight, Mail, Newspaper, Phone, ShoppingBag } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteHeader } from "../../components/layout/SiteHeader";
import { ProductCard } from "../../components/cards/ProductCard";
import { NewsCard } from "../../components/cards/NewsCard";
import { getStats } from "../../services/operationsService";
import { listProducts } from "../../services/catalogService";
import { listNews } from "../../services/contentService";

export function HomePage() {
  const location = useLocation();
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const { data: products = [] } = useQuery({ queryKey: ["products"], queryFn: () => listProducts() });
  const { data: news = [] } = useQuery({ queryKey: ["news"], queryFn: listNews });

  useEffect(() => {
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView();
  }, [location.hash]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero container">
          <div>
            <span className="eyebrow">30 компаний · 1 платформа</span>
            <h1>
              Национальный <span className="grad">Konglomerat</span> под управлением <span className="hl-ai">AI</span>
            </h1>
            <p className="lead">
              Единая экосистема для управления компаниями, шоурумами, R&D, конференциями, обращениями и аналитикой.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/login">
                Войти в платформу <ChevronRight />
              </a>
              <a className="btn btn-ghost" href="#showrooms">
                Смотреть шоурумы
              </a>
            </div>
            <div className="hero-stats">
              <div>
                <span className="num">{stats?.companies || 30}</span>
                <span className="lbl">Компании</span>
              </div>
              <div>
                <span className="num">{stats?.showrooms || products.length}</span>
                <span className="lbl">Шоурумы</span>
              </div>
              <div>
                <span className="num">{stats?.aiRequests || 4820}</span>
                <span className="lbl">AI запросы</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section container" id="about">
          <span className="eyebrow">О нас</span>
          <h2>Konglomerat концепция</h2>
          <p className="section-sub">Платформа объединяет компании, операционные процессы и бизнес-коммуникации в единую систему.</p>
          <div className="grid cols-3 mt-3">
            <InfoCard icon={<Building2 />} title="Единое управление" text="Контроль компаний и процессов из одного кабинета." />
            <InfoCard icon={<Bot />} title="AI ядро" text="Бизнес-помощник для анализа и коммуникации." />
            <InfoCard icon={<Check />} title="Масштаб" text="Шоурумы, экспорт, R&D и обращения в одной платформе." />
          </div>
        </section>

        <section className="section container" id="showrooms">
          <span className="eyebrow">Шоурумы</span>
          <h2>Каталог товаров</h2>
          <p className="section-sub">Интерактивный каталог продукции компаний Konglomerat.</p>
          <div className="grid cols-4 market-grid mt-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="section container" id="news">
          <span className="eyebrow">Новости</span>
          <h2>Лента компаний</h2>
          <div className="grid cols-2 mt-3">
            {news.slice(0, 4).map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </section>

        <section className="section container" id="contact">
          <span className="eyebrow">Контакты</span>
          <h2>Единый call-центр</h2>
          <div className="contact-grid mt-3">
            <InfoCard icon={<Phone />} title="Телефон" text="+998 71 000 00 00" />
            <InfoCard icon={<Mail />} title="Email" text="info@konglomerat.uz" />
            <InfoCard icon={<ShoppingBag />} title="Офис" text="Ташкент, Furqat ko'chasi, 1A" />
          </div>
        </section>
      </main>
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
