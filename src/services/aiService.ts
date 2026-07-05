import { api } from "./http";
import type { AiChatResponse } from "../types";

export function sendAiMessage(body: { visitor?: string; message: string; lang: string }) {
  return api<AiChatResponse>("/api/ai/chat/", { method: "POST", body });
}

export function generateAiLetter(body: unknown) {
  return api<{ subject: string; letter: string }>("/api/ai/letter/", { method: "POST", body });
}
