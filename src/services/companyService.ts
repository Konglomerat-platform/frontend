import { api } from "./http";
import type { Company } from "../types";

export function listCompanies() {
  return api<Company[]>("/api/companies/");
}
