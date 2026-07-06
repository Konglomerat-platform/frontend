import { File as FileIcon, Image, Mic, Paperclip, Send, Square, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUi } from "../../context/UiContext";
import { formatFileSize } from "../../lib/format";
import { sendMessage, type SendMessagePayload } from "../../services/chatService";
import type { ChatMessage } from "../../types";

type PendingAttachment = {
  file: File;
  kind: ChatMessage["kind"];
  previewUrl?: string;
};

const MAX_ATTACHMENTS = 10;
const MAX_FILE_SIZE = 8 * 1024 * 1024;

type MessageComposerProps = {
  chat: string;
  replyTo?: ChatMessage | null;
  onCancelReply: () => void;
  onSent: () => void;
};

export function MessageComposer({ chat, replyTo, onCancelReply, onSent }: MessageComposerProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [pending, setPending] = useState<PendingAttachment[]>([]);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const pendingRef = useRef<PendingAttachment[]>([]);
  const chunksRef = useRef<Blob[]>([]);
  const startedRef = useRef(0);
  const { toast } = useUi();

  const canSend = !sending && (!!text.trim() || pending.length > 0);

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => {
    return () => {
      pendingRef.current.forEach(revokeAttachment);
    };
  }, []);

  async function post(payload: Omit<SendMessagePayload, "chat">) {
    await sendMessage({ chat, parent: replyTo?.id, ...payload });
    onSent();
    onCancelReply();
  }

  async function sendCurrent() {
    const value = text.trim();
    if (!value && !pending.length) return;
    const attachments = pending;
    setSending(true);
    try {
      if (attachments.length > 1) {
        await post({
          kind: "album",
          text: value,
          files: attachments.map((item) => item.file),
        });
      } else if (attachments[0]) {
        const attachment = attachments[0];
        await post({
          kind: attachment.kind,
          text: value,
          file: attachment.file,
          name: attachment.file.name,
        });
      } else {
        await post({ kind: "text", text: value });
      }
      setText("");
      clearPending();
    } catch {
      toast(t("error"), t(attachments.length ? "fileSendFailed" : "sendFailed"), "error");
    } finally {
      setSending(false);
    }
  }

  function attachmentIcon(kind: ChatMessage["kind"]) {
    if (kind === "image") return <Image />;
    if (kind === "video") return <Video />;
    return <FileIcon />;
  }

  function revokeAttachment(attachment: PendingAttachment) {
    if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
  }

  function clearPending() {
    pendingRef.current.forEach(revokeAttachment);
    setPending([]);
  }

  function removeAttachment(index: number) {
    setPending((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) revokeAttachment(removed);
      return next;
    });
  }

  function createAttachment(file: File): PendingAttachment {
    const kind: ChatMessage["kind"] = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "file";
    return {
      file,
      kind,
      previewUrl: kind === "image" || kind === "video" ? URL.createObjectURL(file) : undefined,
    };
  }

  function stageFiles(files: File[]) {
    const valid = files.filter((file) => {
      if (file.size <= MAX_FILE_SIZE) return true;
      toast(t("fileTooLarge"), `${file.name} · ${t("max8Mb")}`, "error");
      return false;
    });
    if (!valid.length) return;
    setPending((current) => {
      const slots = MAX_ATTACHMENTS - current.length;
      if (slots <= 0) {
        toast(t("fileTooLarge"), t("max10Files"), "error");
        return current;
      }
      if (valid.length > slots) toast(t("fileTooLarge"), t("max10Files"), "error");
      return [...current, ...valid.slice(0, slots).map(createAttachment)];
    });
  }

  async function toggleRecord() {
    if (recording && recorderRef.current) {
      recorderRef.current.stop();
      return;
    }
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      toast(t("micUnavailable"), "", "error");
      return;
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    startedRef.current = Date.now();
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = async () => {
      setRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" });
      const dur = (Date.now() - startedRef.current) / 1000;
      if (dur < 0.4) return;
      try {
        await post({
          kind: "voice",
          file: new File([blob], `voice-${Date.now()}.webm`, { type: blob.type }),
          dur,
        });
      } catch {
        toast(t("error"), t("voiceSendFailed"), "error");
      }
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  return (
    <div className="chat-composer">
      {replyTo ? (
        <div className="composer-reply">
          <ReplyDraft message={replyTo} />
          <button className="draft-x" type="button" onClick={onCancelReply} title={t("cancel")}>
            <X />
          </button>
        </div>
      ) : null}
      {pending.length ? (
        <div className="composer-attachments">
          {pending.map((attachment, index) => (
            <div className="composer-attachment" key={`${attachment.file.name}-${attachment.file.size}-${index}`}>
              {attachment.previewUrl && attachment.kind === "image" ? <img src={attachment.previewUrl} alt="" /> : null}
              {attachment.previewUrl && attachment.kind === "video" ? <video src={attachment.previewUrl} muted /> : null}
              {!attachment.previewUrl ? <span className="draft-ico">{attachmentIcon(attachment.kind)}</span> : null}
              <span className="draft-meta">
                <b>{attachment.file.name}</b>
                <small>{[formatFileSize(attachment.file.size), attachment.file.type].filter(Boolean).join(" | ")}</small>
              </span>
              <button className="draft-x" type="button" onClick={() => removeAttachment(index)} title={t("cancel")}>
                <X />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="chat-input">
        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            if (files.length) stageFiles(files);
            event.currentTarget.value = "";
          }}
        />
        <button className="ci-btn" type="button" onClick={() => fileRef.current?.click()} title={t("filePhoto")}>
          <Paperclip />
        </button>
        <button
          className={`ci-btn ${recording ? "rec" : ""}`}
          type="button"
          onClick={() => toggleRecord().catch(() => toast(t("error"), t("micUnavailable"), "error"))}
          title={t("voiceMessage")}
        >
          {recording ? <Square /> : <Mic />}
        </button>
        <input
          value={text}
          placeholder={t("message")}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) sendCurrent();
          }}
        />
        <button className="btn btn-primary btn-sm" type="button" onClick={sendCurrent} disabled={!canSend}>
          <Send /> {t("send")}
        </button>
      </div>
    </div>
  );
}

function ReplyDraft({ message }: { message: ChatMessage }) {
  return (
    <span className="draft-meta">
      <b>{message.sender}</b>
      <small>{message.name || message.text || message.kind}</small>
    </span>
  );
}
