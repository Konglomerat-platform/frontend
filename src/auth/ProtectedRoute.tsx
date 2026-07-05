import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet } from "react-router";

import { useAuth } from "./AuthContext";

export function ProtectedRoute({ role, children }: { role?: "admin" | "company"; children?: ReactNode }) {
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  if (loading) return <div className="auth-wrap">{t("loading")}</div>;
  if (!user || (role && user.role !== role)) return <Navigate to="/login" replace />;
  return children || <Outlet />;
}
