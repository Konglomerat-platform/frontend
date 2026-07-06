import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { getAccessToken, refreshAccessToken } from "../services/http";
import type { ChatMessage } from "../types";

type ChatSocketEvent =
  | { type: "message.created"; message: ChatMessage }
  | { type: "message.updated"; message: ChatMessage }
  | { type: "message.deleted"; id: string }
  | { type: "message.seen"; messages: ChatMessage[] };

function socketUrl(chat: string, token: string) {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const params = new URLSearchParams({ chat, token });
  return `${protocol}//${window.location.host}/ws/chat/?${params.toString()}`;
}

function upsertMessage(list: ChatMessage[] = [], message: ChatMessage) {
  const index = list.findIndex((item) => item.id === message.id);
  if (index === -1) return [...list, message].sort((a, b) => a.ts - b.ts);
  const next = list.slice();
  next[index] = message;
  return next;
}

export function useChatSocket(chat: string, enabled: boolean, onResync: () => void) {
  const queryClient = useQueryClient();
  const [connected, setConnected] = useState(false);
  const reconnectRef = useRef(0);

  useEffect(() => {
    if (!enabled || !chat) return;
    let socket: WebSocket | null = null;
    let stopped = false;
    let timer: number | undefined;

    async function connect() {
      let token = getAccessToken();
      if (!token) {
        const refreshed = await refreshAccessToken();
        token = refreshed ? getAccessToken() : null;
      }
      if (!token || stopped) return;

      socket = new WebSocket(socketUrl(chat, token));
      socket.onopen = () => {
        reconnectRef.current = 0;
        setConnected(true);
        onResync();
      };
      socket.onmessage = (event) => {
        let payload: ChatSocketEvent;
        try {
          payload = JSON.parse(event.data) as ChatSocketEvent;
        } catch {
          return;
        }
        queryClient.setQueryData<ChatMessage[]>(["messages", chat], (current = []) => {
          if (payload.type === "message.created" || payload.type === "message.updated") {
            return upsertMessage(current, payload.message);
          }
          if (payload.type === "message.deleted") {
            return current.filter((message) => message.id !== payload.id);
          }
          if (payload.type === "message.seen") {
            const updates = new Map(payload.messages.map((message) => [message.id, message]));
            return current.map((message) => updates.get(message.id) || message);
          }
          return current;
        });
      };
      socket.onclose = async (event) => {
        setConnected(false);
        if (stopped) return;
        if (event.code === 4401 || event.code === 1006) await refreshAccessToken();
        const wait = Math.min(1000 * 2 ** reconnectRef.current, 8000);
        reconnectRef.current += 1;
        timer = window.setTimeout(connect, wait);
      };
    }

    timer = window.setTimeout(connect, 0);
    return () => {
      stopped = true;
      setConnected(false);
      if (timer) window.clearTimeout(timer);
      socket?.close();
    };
  }, [chat, enabled, onResync, queryClient]);

  return connected;
}
