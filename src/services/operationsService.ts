import { api } from "./http";
import type { Conference } from "../types";

export function getStats() {
  return api<Record<string, number>>("/api/stats/");
}

export function listConferences() {
  return api<Conference[]>("/api/conferences/");
}

export function createConference(body: unknown) {
  return api<Conference>("/api/conferences/", { method: "POST", body });
}

export function generateReport() {
  return api<Record<string, string>>("/api/reports/generate/", { method: "POST" });
}

export function listManagementModules() {
  return api<Record<string, boolean>>("/api/management-modules/");
}

export function updateManagementModule(key: string, enabled: boolean) {
  return api<{ id: string; enabled: boolean }>(`/api/management-modules/${encodeURIComponent(key)}/`, {
    method: "PUT",
    body: { enabled },
  });
}
