import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";
import { localize } from "../../lib/format";
import { listNotifications, markNotificationRead, markNotificationsRead } from "../../services/notificationService";
import type { NotificationResponse } from "../../types";

type NotificationItem = NotificationResponse["list"][number];

export function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const query = useQuery({ queryKey: ["notifications"], queryFn: listNotifications });
  const activeLang = i18n.resolvedLanguage || i18n.language;

  async function markOne(item: NotificationItem) {
    await markNotificationRead(item.id);
    await query.refetch();
  }

  async function markAll() {
    await markNotificationsRead();
    await query.refetch();
  }

  async function openNotification(item: NotificationItem) {
    await markOne(item);
    if (!item.link) return;
    if (isExternalLink(item.link)) {
      window.open(item.link, "_blank", "noopener,noreferrer");
      return;
    }
    navigate(item.link);
  }

  if (!user) return null;

  return (
    <WorkspaceLayout role={user.role} active="notifications">
      <PageTitle title={t("notifications")} sub={t("notificationsSub")} />
      <div className="notifications-page">
        <div className="notifications-toolbar">
          <span>{t("unreadCount", { count: query.data?.unread || 0 })}</span>
          <button className="btn btn-soft btn-sm" type="button" onClick={markAll} disabled={!query.data?.list.length}>
            <CheckCheck /> {t("markRead")}
          </button>
        </div>
        <div className="notifications-list">
          {query.data?.list.length ? (
            query.data.list.map((item) => (
              <article className={`notification-card ${item.read ? "" : "unread"}`} key={item.id}>
                <div className="notification-icon">
                  <Bell />
                </div>
                <div className="notification-body">
                  <div className="notification-title-row">
                    <h3>{localize(item.title, activeLang)}</h3>
                    <time>{item.at.slice(0, 16).replace("T", " ")}</time>
                  </div>
                  <p>{item.text}</p>
                  <div className="notification-actions">
                    {item.link ? (
                      <button className="btn btn-primary btn-sm" type="button" onClick={() => openNotification(item)}>
                        <ExternalLink /> {t("open")}
                      </button>
                    ) : null}
                    <button className="btn btn-soft btn-sm" type="button" onClick={() => markOne(item)} disabled={item.read}>
                      <Check /> {item.read ? t("read") : t("markOneRead")}
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="notifications-empty">
              <Bell />
              <b>{t("noNotifications")}</b>
            </div>
          )}
        </div>
      </div>
    </WorkspaceLayout>
  );
}

function isExternalLink(value: string) {
  return /^https?:\/\//i.test(value);
}
