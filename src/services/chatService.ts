import { api } from "./http";
import type { ChatMessage } from "../types";

export type SendMessagePayload = {
  chat: string;
  kind?: "text" | "image" | "file" | "voice";
  text?: string;
  data?: string;
  name?: string;
  dur?: number;
};

export function listMessages(chat: string) {
  return api<ChatMessage[]>(`/api/chat/messages/?chat=${encodeURIComponent(chat)}`);
}

export function sendMessage(payload: SendMessagePayload) {
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
