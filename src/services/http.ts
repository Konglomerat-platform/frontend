import type { User } from "../types";

let accessToken: string | null = null;
let refreshing: Promise<boolean> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

type ApiInit = Omit<RequestInit, "body"> & { body?: unknown };

export async function api<T>(path: string, init: ApiInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(path, {
    ...init,
    credentials: "include",
    headers,
    body: init.body instanceof FormData ? init.body : init.body ? JSON.stringify(init.body) : undefined,
  });

  if (res.status === 401 && path !== "/api/auth/refresh/") {
    const ok = await refreshAccessToken();
    if (ok) return api<T>(path, init);
  }

  if (!res.ok) {
    let payload: unknown = null;
    try {
      payload = await res.json();
    } catch {
      payload = { error: res.statusText };
    }
    throw payload;
  }

  return res.json() as Promise<T>;
}

export async function refreshAccessToken(): Promise<boolean> {
  if (!refreshing) {
    refreshing = api<{ access: string; user: User }>("/api/auth/refresh/", { method: "POST" })
      .then((data) => {
        setAccessToken(data.access);
        return true;
      })
      .catch(() => {
        setAccessToken(null);
        return false;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}
