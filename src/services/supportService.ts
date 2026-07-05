import { api } from "./http";
import type { Complaint } from "../types";

export function listComplaints() {
  return api<Complaint[]>("/api/complaints/");
}

export function createComplaint(body: unknown) {
  return api<Complaint>("/api/complaints/", { method: "POST", body });
}

export function getComplaint(id: string) {
  return api<Complaint>(`/api/complaints/${encodeURIComponent(id)}/`);
}

export function updateComplaint(id: string, body: unknown) {
  return api<Complaint>(`/api/complaints/${encodeURIComponent(id)}/`, { method: "PUT", body });
}
