import { api, refreshAccessToken, setAccessToken } from "./http";
import type { User } from "../types";

export type LoginResponse = { user: User; access: string; token: string };

export async function login(username: string, password: string): Promise<LoginResponse> {
  const data = await api<LoginResponse>("/api/auth/login/", {
    method: "POST",
    body: { username, password },
  });
  setAccessToken(data.access || data.token);
  return data;
}

export async function refreshAccess(): Promise<boolean> {
  return refreshAccessToken();
}

export async function currentUser(): Promise<User> {
  const data = await api<{ user: User }>("/api/auth/me/");
  return data.user;
}

export async function logout() {
  try {
    await api("/api/auth/logout/", { method: "POST" });
  } finally {
    setAccessToken(null);
  }
}
