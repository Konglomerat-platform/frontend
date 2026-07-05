import { api } from "./http";
import type { NotificationResponse } from "../types";

export function listNotifications() {
  return api<NotificationResponse>("/api/notifications/");
}

export function markNotificationsRead() {
  return api<{ ok: boolean }>("/api/notifications/read/", { method: "POST" });
}
