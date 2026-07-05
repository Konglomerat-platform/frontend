import { File, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

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
  const [seenOpen, setSeenOpen] = useState(false);
  const { confirm, prompt, toast } = useUi();
  const me = message.sender === meName;
  const canEdit = me && message.kind === "text";
  const canDelete = me || isAdmin;

  async function onEdit() {
    const next = await prompt({ title: "Редактировать сообщение", value: message.text, ok: "Обновить" });
    if (next == null) return;
    try {
      await editMessage(message.id, next);
      onChanged();
    } catch {
      toast("Ошибка", "Не удалось обновить сообщение", "error");
    }
  }

  async function onDelete() {
    if (!(await confirm({ title: "Удалить сообщение?", danger: true }))) return;
    try {
      await deleteMessage(message.id);
      onChanged();
    } catch {
      toast("Ошибка", "Не удалось удалить сообщение", "error");
    }
  }

  return (
    <div className={`bubble ${me ? "me" : "them"}`} data-id={message.id}>
      <div className="b-from">{message.sender}</div>
      <MessageContent message={message} />
      {message.edited ? <span className="b-edited">(изменено)</span> : null}
      <div className={`b-receipt ${message.seenBy?.length ? "seen" : ""}`}>
        <span className="b-time">{formatSeen(message.ts)}</span>
        {me ? (
          isGroup && message.seenBy?.length ? (
            <>
              <button className="seen-toggle" type="button" onClick={() => setSeenOpen((value) => !value)}>
                ✓✓ {message.seenBy.length}
              </button>
              <div className="seen-pop" hidden={!seenOpen}>
                <div className="seen-head">Кто видел</div>
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
              {message.seenBy?.length ? "✓✓ Просмотрено" : "✓ Отправлено"}
            </span>
          )
        ) : null}
      </div>
      {canEdit || canDelete ? (
        <div className="bubble-actions">
          {canEdit ? (
            <button type="button" onClick={onEdit} title="Редактировать">
              <Pencil />
            </button>
          ) : null}
          {canDelete ? (
            <button type="button" onClick={onDelete} title="Удалить" data-msg-act="del">
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
