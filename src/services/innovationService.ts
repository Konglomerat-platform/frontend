import { api } from "./http";
import type { Rnd } from "../types";

export function listRndSubmissions() {
  return api<Rnd[]>("/api/rnd-submissions/");
}

export function createRndSubmission(body: unknown) {
  return api<Rnd>("/api/rnd-submissions/", { method: "POST", body });
}

export function updateRndSubmission(id: string, body: unknown) {
  return api<Rnd>(`/api/rnd-submissions/${encodeURIComponent(id)}/`, { method: "PUT", body });
}
