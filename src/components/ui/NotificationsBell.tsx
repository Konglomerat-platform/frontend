import { Bell, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { localize } from "../../lib/format";
import { listNotifications, markNotificationsRead } from "../../services/notificationService";

export function NotificationsBell() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const { data, refetch } = useQuery({ queryKey: ["notifications"], queryFn: listNotifications });
  const unread = data?.unread || 0;
  const activeLang = i18n.resolvedLanguage || i18n.language;

  async function markRead() {
    await markNotificationsRead();
    await refetch();
  }

  return (
    <div className="notif" id="notifWrap">
      <button className="icon-btn notif-btn" type="button" onClick={() => setOpen((value) => !value)} title="Notifications">
        <Bell />
        <span className="notif-badge" hidden={!unread}>
          {unread > 99 ? "99+" : unread}
        </span>
      </button>
      <div className="notif-panel" hidden={!open}>
        <div className="notif-head">Уведомления</div>
        <div className="notif-list">
          {data?.list.length ? (
            data.list.map((item) => {
              const content = (
                <>
                  <div className="ni-ico">
                    <Bell />
                  </div>
                  <div className="grow">
                    <b>{localize(item.title, activeLang)}</b>
                    <small>{item.text}</small>
                    <time>{item.at.slice(0, 16).replace("T", " ")}</time>
                  </div>
                  {item.link ? (
                    <span className="ni-go">
                      <ChevronLeft />
                    </span>
                  ) : null}
                </>
              );
              return item.link ? (
                <Link key={item.id} className={`notif-item ${item.read ? "" : "unread"} clickable`} to={item.link}>
                  {content}
                </Link>
              ) : (
                <div key={item.id} className={`notif-item ${item.read ? "" : "unread"}`}>
                  {content}
                </div>
              );
            })
          ) : (
            <div className="notif-empty">Нет уведомлений</div>
          )}
        </div>
        <button className="btn btn-soft btn-block" type="button" onClick={markRead}>
          Mark read
        </button>
      </div>
    </div>
  );
}
