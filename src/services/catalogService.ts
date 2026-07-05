import { api } from "./http";
import type { Product } from "../types";

export function listProducts(company?: string) {
  const query = company ? `?company=${encodeURIComponent(company)}` : "";
  return api<Product[]>(`/api/products/${query}`);
}

export function getProduct(id: string) {
  return api<Product>(`/api/products/${encodeURIComponent(id)}/`);
}

export function createProduct(body: unknown) {
  return api<Product>("/api/products/", { method: "POST", body });
}
