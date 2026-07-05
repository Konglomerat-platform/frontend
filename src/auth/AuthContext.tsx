import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { currentUser, login as apiLogin, logout as apiLogout, refreshAccess } from "../services/authService";
import type { User } from "../types";

type AuthState = {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    const ok = await refreshAccess();
    if (!ok) {
      setUser(null);
      return;
    }
    setUser(await currentUser());
  }

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      async login(username, password) {
        const data = await apiLogin(username, password);
        setUser(data.user);
        return data.user;
      },
      async logout() {
        await apiLogout();
        setUser(null);
      },
      reload,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
