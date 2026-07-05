import { Mic, Paperclip, Send, Square } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useUi } from "../../context/UiContext";
import { fileToDataUrl } from "../../lib/format";
import { sendMessage, type SendMessagePayload } from "../../services/chatService";

type MessageComposerProps = { chat: string; onSent: () => void };

export function MessageComposer({ chat, onSent }: MessageComposerProps) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedRef = useRef(0);
  const { toast } = useUi();

  async function post(payload: Omit<SendMessagePayload, "chat">) { await sendMessage({ chat, ...payload }); onSent(); }

  async function sendText() {
    const value = text.trim();
    if (!value) return;
    setText("");
    try { await post({ kind: "text", text: value }); } catch { toast(t("error"), t("sendFailed"), "error"); }
  }

  async function attachFile(file: File) {
    if (file.size > 8 * 1024 * 1024) { toast(t("fileTooLarge"), t("max8Mb"), "error"); return; }
    const data = await fileToDataUrl(file);
    await post({ kind: file.type.startsWith("image/") ? "image" : "file", data, name: file.name });
  }

  async function toggleRecord() {
    if (recording && recorderRef.current) { recorderRef.current.stop(); return; }
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast(t("micUnavailable"), "", "error"); return; }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    startedRef.current = Date.now();
    recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); };
    recorder.onstop = async () => {
      setRecording(false);
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunksRef.current, { type: chunksRef.current[0]?.type || "audio/webm" });
      const dur = (Date.now() - startedRef.current) / 1000;
      if (dur < 0.4) return;
      try { await post({ kind: "voice", data: await fileToDataUrl(blob), dur }); } catch { toast(t("error"), t("voiceSendFailed"), "error"); }
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
  }

  return (
    <div className="chat-input">
      <input ref={fileRef} type="file" hidden accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.zip" onChange={(event) => { const file = event.target.files?.[0]; if (file) attachFile(file).catch(() => toast(t("error"), t("fileSendFailed"), "error")); event.currentTarget.value = ""; }} />
      <button className="ci-btn" type="button" onClick={() => fileRef.current?.click()} title={t("filePhoto")}><Paperclip /></button>
      <button className={`ci-btn ${recording ? "rec" : ""}`} type="button" onClick={() => toggleRecord().catch(() => toast(t("error"), t("micUnavailable"), "error"))} title={t("voiceMessage")}>{recording ? <Square /> : <Mic />}</button>
      <input value={text} placeholder={t("message")} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendText()} />
      <button className="btn btn-primary btn-sm" type="button" onClick={sendText}><Send /> {t("send")}</button>
    </div>
  );
}
