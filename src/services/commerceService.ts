import { api } from "./http";
import type { Order } from "../types";

export function listOrders() {
  return api<Order[]>("/api/orders/");
}

export function createOrder(body: unknown) {
  return api<Order>("/api/orders/", { method: "POST", body });
}

export function getFavorites(email: string) {
  return api<{ ids: string[] }>(`/api/favorites/?email=${encodeURIComponent(email)}`);
}

export function replaceFavorites(email: string, ids: string[]) {
  return api<{ ids: string[] }>("/api/favorites/", { method: "PUT", body: { email, ids } });
}
