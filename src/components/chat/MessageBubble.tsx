import { File, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUi } from "../../context/UiContext";
import { formatSeen, initials } from "../../lib/format";
import { deleteMessage, editMessage } from "../../services/chatService";
import type { ChatMessage } from "../../types";

type MessageBubbleProps = {
  message: ChatMessage;
  meName?: string;
  isGroup?: boolean;
  isAdmin?: boolean;
  onChanged: () => void;
};

export function MessageBubble({ message, meName, isGroup = false, isAdmin = false, onChanged }: MessageBubbleProps) {
  const { t } = useTranslation();
  const [seenOpen, setSeenOpen] = useState(false);
  const { confirm, prompt, toast } = useUi();
  const me = message.sender === meName;
  const canEdit = me && message.kind === "text";
  const canDelete = me || isAdmin;

  async function onEdit() {
    const next = await prompt({ title: t("editMessage"), value: message.text, ok: t("update") });
    if (next == null) return;
    try {
      await editMessage(message.id, next);
      onChanged();
    } catch {
      toast(t("error"), t("updateFailed"), "error");
    }
  }

  async function onDelete() {
    if (!(await confirm({ title: t("deleteMessage"), danger: true }))) return;
    try {
      await deleteMessage(message.id);
      onChanged();
    } catch {
      toast(t("error"), t("deleteFailed"), "error");
    }
  }

  return (
    <div className={`bubble ${me ? "me" : "them"}`} data-id={message.id}>
      <div className="b-from">{message.sender}</div>
      <MessageContent message={message} />
      {message.edited ? <span className="b-edited">({t("edited")})</span> : null}
      <div className={`b-receipt ${message.seenBy?.length ? "seen" : ""}`}>
        <span className="b-time">{formatSeen(message.ts)}</span>
        {me ? (
          isGroup && message.seenBy?.length ? (
            <>
              <button className="seen-toggle" type="button" onClick={() => setSeenOpen((value) => !value)}>
                ✓✓ {message.seenBy.length}
              </button>
              <div className="seen-pop" hidden={!seenOpen}>
                <div className="seen-head">{t("whoSeen")}</div>
                {message.seenBy.map((item) => (
                  <div className="seen-row" key={`${item.name}-${item.at}`}>
                    <span className="seen-ava">{initials(item.name)}</span>
                    <span className="seen-name">{item.name}</span>
                    <time>{formatSeen(item.at)}</time>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <span className={message.seenBy?.length ? "rc-seen" : "rc-sent"}>
              {message.seenBy?.length ? `✓✓ ${t("seen")}` : `✓ ${t("sent")}`}
            </span>
          )
        ) : null}
      </div>
      {canEdit || canDelete ? (
        <div className="bubble-actions">
          {canEdit ? (
            <button type="button" onClick={onEdit} title={t("edit")}>
              <Pencil />
            </button>
          ) : null}
          {canDelete ? (
            <button type="button" onClick={onDelete} title={t("delete")} data-msg-act="del">
              <Trash2 />
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function MessageContent({ message }: { message: ChatMessage }) {
  if (message.kind === "image" && message.data) return <img className="b-img" src={message.data} alt="" />;
  if (message.kind === "voice" && message.data) {
    return (
      <span className="b-voice">
        <audio className="b-audio" controls src={message.data} />
        {message.dur ? <span className="b-dur">{Math.round(message.dur)}s</span> : null}
      </span>
    );
  }
  if (message.kind === "file" && message.data) {
    return (
      <a className="b-file" href={message.data} download={message.name || "file"}>
        <File />
        <span>{message.name || "file"}</span>
      </a>
    );
  }
  return <span className="b-text">{message.text}</span>;
}
