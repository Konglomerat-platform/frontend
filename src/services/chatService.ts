import { api } from "./http";
import type { ChatMessage } from "../types";

export type SendMessagePayload = {
  chat: string;
  kind?: ChatMessage["kind"];
  text?: string;
  data?: string;
  name?: string;
  dur?: number;
  parent?: string;
  file?: File | Blob;
};

export function listMessages(chat: string) {
  return api<ChatMessage[]>(`/api/chat/messages/?chat=${encodeURIComponent(chat)}`);
}

export function sendMessage(payload: SendMessagePayload) {
  if (payload.file) {
    const body = new FormData();
    body.set("chat", payload.chat);
    if (payload.kind) body.set("kind", payload.kind);
    if (payload.text) body.set("text", payload.text);
    if (payload.name) body.set("name", payload.name);
    if (payload.dur != null) body.set("dur", String(payload.dur));
    if (payload.parent) body.set("parent", payload.parent);
    body.set("file", payload.file, payload.name || "attachment");
    return api<ChatMessage>("/api/chat/messages/", { method: "POST", body });
  }
  return api<ChatMessage>("/api/chat/messages/", { method: "POST", body: payload });
}

export function markChatSeen(chat: string) {
  return api<{ ok: boolean }>("/api/chat/messages/seen/", { method: "POST", body: { chat } });
}

export function editMessage(id: string, text: string) {
  return api<ChatMessage>(`/api/chat/messages/${encodeURIComponent(id)}/`, { method: "PUT", body: { text } });
}

export function deleteMessage(id: string) {
  return api<{ ok: boolean }>(`/api/chat/messages/${encodeURIComponent(id)}/`, { method: "DELETE" });
}
