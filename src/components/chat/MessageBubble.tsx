import { Check, CheckCheck, Download, File, Pencil, Reply, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useUi } from "../../context/UiContext";
import { formatFileSize, formatSeen, initials } from "../../lib/format";
import { deleteMessage, editMessage } from "../../services/chatService";
import type { ChatMessage } from "../../types";

type MessageBubbleProps = {
  message: ChatMessage;
  meName?: string;
  isGroup?: boolean;
  isAdmin?: boolean;
  onReply: (message: ChatMessage) => void;
  onChanged: () => void;
};

export function MessageBubble({
  message,
  meName,
  isGroup = false,
  isAdmin = false,
  onReply,
  onChanged,
}: MessageBubbleProps) {
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
      {message.parent ? <ReplyPreview parent={message.parent} /> : null}
      <MessageContent message={message} />
      {message.edited ? <span className="b-edited">({t("edited")})</span> : null}
      <div className={`b-receipt ${message.seenBy?.length ? "seen" : ""}`}>
        <time className="b-time">{formatSeen(message.ts)}</time>
        {me ? (
          <ReceiptStatus
            message={message}
            isGroup={isGroup}
            seenOpen={seenOpen}
            setSeenOpen={setSeenOpen}
          />
        ) : null}
      </div>
      <div className="bubble-actions">
        <button type="button" onClick={() => onReply(message)} title={t("replyAction")}>
          <Reply />
        </button>
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
    </div>
  );
}

function ReceiptStatus({
  message,
  isGroup,
  seenOpen,
  setSeenOpen,
}: {
  message: ChatMessage;
  isGroup: boolean;
  seenOpen: boolean;
  setSeenOpen: (value: boolean | ((value: boolean) => boolean)) => void;
}) {
  const { t } = useTranslation();
  const seenCount = message.seenBy?.length || 0;
  if (isGroup && seenCount) {
    return (
      <span className="receipt-wrap">
        <button className="seen-toggle" type="button" onClick={() => setSeenOpen((value) => !value)}>
          <CheckCheck />
          <span>{seenCount}</span>
        </button>
        <div className="seen-pop" hidden={!seenOpen}>
          <div className="seen-head">{t("whoSeen")}</div>
          {message.seenBy?.map((item) => (
            <div className="seen-row" key={`${item.name}-${item.at}`}>
              <span className="seen-ava">{initials(item.name)}</span>
              <span className="seen-name">{item.name}</span>
              <time>{formatSeen(item.at)}</time>
            </div>
          ))}
        </div>
      </span>
    );
  }
  return (
    <span className={`receipt-status ${seenCount ? "rc-seen" : "rc-sent"}`}>
      {seenCount ? <CheckCheck /> : <Check />}
      <span>{seenCount ? t("seen") : t("sent")}</span>
    </span>
  );
}

function ReplyPreview({ parent }: { parent: NonNullable<ChatMessage["parent"]> }) {
  return (
    <div className="b-reply-preview">
      <b>{parent.sender}</b>
      <span>{parent.name || parent.text || parent.kind}</span>
    </div>
  );
}

function MessageContent({ message }: { message: ChatMessage }) {
  const mediaUrl = message.data || message.downloadUrl || "";
  if (message.kind === "image" && mediaUrl) {
    return (
      <>
        <img className="b-img" src={mediaUrl} alt="" />
        <Caption text={message.text} />
      </>
    );
  }
  if (message.kind === "video" && mediaUrl) {
    return (
      <>
        <video className="b-video" controls src={mediaUrl} />
        <Caption text={message.text} />
      </>
    );
  }
  if (message.kind === "voice" && mediaUrl) {
    return (
      <div className="b-voice">
        <audio className="b-audio" controls src={mediaUrl} />
        {message.dur ? <span className="b-dur">{Math.round(message.dur)}s</span> : null}
      </div>
    );
  }
  if (message.kind === "file" && mediaUrl) {
    return (
      <>
        <a className="b-file" href={message.downloadUrl || mediaUrl} download={message.name || "file"}>
          <File />
          <span className="b-file-info">
            <b>{message.name || "file"}</b>
            <small>{[formatFileSize(message.size), message.contentType].filter(Boolean).join(" | ")}</small>
          </span>
          <Download className="b-download" />
        </a>
        <Caption text={message.text} />
      </>
    );
  }
  return <span className="b-text">{message.text}</span>;
}

function Caption({ text }: { text?: string | null }) {
  return text ? <span className="b-caption">{text}</span> : null;
}
