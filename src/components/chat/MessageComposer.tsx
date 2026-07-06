import { File as FileIcon, Image, Mic, Paperclip, Send, Square, Video, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [pending, setPending] = useState<PendingAttachment | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedRef = useRef(0);
  const { toast } = useUi();

  const canSend = !!text.trim() || !!pending;
  const pendingIcon = useMemo(() => {
    if (!pending) return null;
    if (pending.kind === "image") return <Image />;
    if (pending.kind === "video") return <Video />;
    return <FileIcon />;
  }, [pending]);

  useEffect(() => {
    return () => {
      if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl);
    };
  }, [pending]);

  async function post(payload: Omit<SendMessagePayload, "chat">) {
    await sendMessage({ chat, parent: replyTo?.id, ...payload });
    onSent();
    onCancelReply();
  }

  async function sendCurrent() {
    const value = text.trim();
    if (!value && !pending) return;
    const attachment = pending;
    try {
      if (attachment) {
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
      setPending(null);
    } catch {
      toast(t("error"), t(attachment ? "fileSendFailed" : "sendFailed"), "error");
    }
  }

  function stageFile(file: File) {
    if (file.size > 8 * 1024 * 1024) {
      toast(t("fileTooLarge"), t("max8Mb"), "error");
      return;
    }
    const kind: ChatMessage["kind"] = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : "file";
    setPending((current) => {
      if (current?.previewUrl) URL.revokeObjectURL(current.previewUrl);
      return {
        file,
        kind,
        previewUrl: kind === "image" || kind === "video" ? URL.createObjectURL(file) : undefined,
      };
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
      {pending ? (
        <div className="composer-attachment">
          {pending.previewUrl && pending.kind === "image" ? <img src={pending.previewUrl} alt="" /> : null}
          {pending.previewUrl && pending.kind === "video" ? <video src={pending.previewUrl} muted /> : null}
          {!pending.previewUrl ? <span className="draft-ico">{pendingIcon}</span> : null}
          <span className="draft-meta">
            <b>{pending.file.name}</b>
            <small>{[formatFileSize(pending.file.size), pending.file.type].filter(Boolean).join(" | ")}</small>
          </span>
          <button className="draft-x" type="button" onClick={() => setPending(null)} title={t("cancel")}>
            <X />
          </button>
        </div>
      ) : null}
      <div className="chat-input">
        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) stageFile(file);
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
