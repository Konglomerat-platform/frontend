import { Check, CheckCheck, ChevronLeft, ChevronRight, Download, File, Pencil, Play, Reply, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUi } from "../../context/UiContext";
import { formatFileSize, formatSeen, initials } from "../../lib/format";
import { deleteMessage, editMessage } from "../../services/chatService";
import type { ChatAttachment, ChatMessage } from "../../types";

type MessageBubbleProps = {
  message: ChatMessage;
  meName?: string;
  isGroup?: boolean;
  isAdmin?: boolean;
  onReply: (message: ChatMessage) => void;
  onJumpToMessage: (id: string) => void;
  onChanged: () => void;
};

export function MessageBubble({
  message,
  meName,
  isGroup = false,
  isAdmin = false,
  onReply,
  onJumpToMessage,
  onChanged,
}: MessageBubbleProps) {
  const { t } = useTranslation();
  const [seenOpen, setSeenOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ items: MediaPreview[]; index: number } | null>(null);
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
      {message.parent ? <ReplyPreview parent={message.parent} onJump={onJumpToMessage} /> : null}
      <MessageContent message={message} onOpenMedia={(items, index) => setLightbox({ items, index })} />
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
      {lightbox ? <MediaLightbox state={lightbox} setState={setLightbox} /> : null}
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

type MediaPreview = {
  kind: "image" | "video";
  url: string;
  name?: string | null;
};

function ReplyPreview({
  parent,
  onJump,
}: {
  parent: NonNullable<ChatMessage["parent"]>;
  onJump: (id: string) => void;
}) {
  return (
    <button className="b-reply-preview" type="button" onClick={() => onJump(parent.id)}>
      <b>{parent.sender}</b>
      <span>{parent.name || parent.text || parent.kind}</span>
    </button>
  );
}

function MessageContent({
  message,
  onOpenMedia,
}: {
  message: ChatMessage;
  onOpenMedia: (items: MediaPreview[], index: number) => void;
}) {
  const mediaUrl = message.data || message.downloadUrl || "";
  if (message.kind === "image" && mediaUrl) {
    const media = [{ kind: "image" as const, url: mediaUrl, name: message.name }];
    return (
      <>
        <button className="media-open" type="button" onClick={() => onOpenMedia(media, 0)}>
          <img className="b-img" src={mediaUrl} alt="" />
        </button>
        <Caption text={message.text} />
      </>
    );
  }
  if (message.kind === "video" && mediaUrl) {
    const media = [{ kind: "video" as const, url: mediaUrl, name: message.name }];
    return (
      <>
        <button className="media-open video-preview" type="button" onClick={() => onOpenMedia(media, 0)}>
          <video className="b-video" muted preload="metadata" src={mediaUrl} />
          <span className="video-play"><Play /></span>
        </button>
        <Caption text={message.text} />
      </>
    );
  }
  if (message.kind === "album") {
    return <AlbumContent attachments={message.attachments || []} caption={message.text} onOpenMedia={onOpenMedia} />;
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

function AlbumContent({
  attachments,
  caption,
  onOpenMedia,
}: {
  attachments: ChatAttachment[];
  caption?: string | null;
  onOpenMedia: (items: MediaPreview[], index: number) => void;
}) {
  const media = attachments
    .filter((attachment) => (attachment.kind === "image" || attachment.kind === "video") && attachment.url)
    .map((attachment) => ({
      kind: attachment.kind as "image" | "video",
      url: attachment.url || "",
      name: attachment.name,
    }));
  const files = attachments.filter((attachment) => !media.some((item) => item.url === attachment.url));

  return (
    <>
      {media.length ? (
        <div className={`album-grid count-${Math.min(media.length, 4)}`}>
          {media.map((item, index) => (
            <button className="album-tile" type="button" key={`${item.url}-${index}`} onClick={() => onOpenMedia(media, index)}>
              {item.kind === "image" ? <img src={item.url} alt="" /> : <video muted preload="metadata" src={item.url} />}
              {item.kind === "video" ? <span className="video-play"><Play /></span> : null}
            </button>
          ))}
        </div>
      ) : null}
      {files.length ? (
        <div className="album-files">
          {files.map((attachment) => (
            <a className="b-file" href={attachment.downloadUrl || attachment.url || "#"} download={attachment.name || "file"} key={attachment.id}>
              <File />
              <span className="b-file-info">
                <b>{attachment.name || "file"}</b>
                <small>{[formatFileSize(attachment.size), attachment.contentType].filter(Boolean).join(" | ")}</small>
              </span>
              <Download className="b-download" />
            </a>
          ))}
        </div>
      ) : null}
      <Caption text={caption} />
    </>
  );
}

function MediaLightbox({
  state,
  setState,
}: {
  state: { items: MediaPreview[]; index: number };
  setState: (state: { items: MediaPreview[]; index: number } | null) => void;
}) {
  const active = state.items[state.index];
  const hasMany = state.items.length > 1;

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setState(null);
      if (event.key === "ArrowLeft" && hasMany) {
        setState({ items: state.items, index: (state.index - 1 + state.items.length) % state.items.length });
      }
      if (event.key === "ArrowRight" && hasMany) {
        setState({ items: state.items, index: (state.index + 1) % state.items.length });
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hasMany, setState, state.index, state.items]);

  if (!active) return null;

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true">
      <button className="lightbox-close" type="button" onClick={() => setState(null)} aria-label="Close">
        <X />
      </button>
      {hasMany ? (
        <button
          className="lightbox-nav prev"
          type="button"
          onClick={() => setState({ items: state.items, index: (state.index - 1 + state.items.length) % state.items.length })}
          aria-label="Previous"
        >
          <ChevronLeft />
        </button>
      ) : null}
      <figure className="lightbox-stage">
        {active.kind === "image" ? <img src={active.url} alt="" /> : <video src={active.url} controls autoPlay />}
        {active.name ? <figcaption>{active.name}</figcaption> : null}
      </figure>
      {hasMany ? (
        <button
          className="lightbox-nav next"
          type="button"
          onClick={() => setState({ items: state.items, index: (state.index + 1) % state.items.length })}
          aria-label="Next"
        >
          <ChevronRight />
        </button>
      ) : null}
    </div>
  );
}

function Caption({ text }: { text?: string | null }) {
  return text ? <span className="b-caption">{text}</span> : null;
}
