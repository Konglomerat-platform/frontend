import { api } from "./http";
import type { NewsArticle } from "../types";

export function listNews() {
  return api<NewsArticle[]>("/api/news/");
}

export function getNewsArticle(id: string) {
  return api<NewsArticle>(`/api/news/${encodeURIComponent(id)}/`);
}

export function createNews(body: unknown) {
  return api<NewsArticle>("/api/news/", { method: "POST", body });
}
