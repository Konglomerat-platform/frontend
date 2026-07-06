import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { markChatSeen, listMessages } from "../../services/chatService";
import { useAuth } from "../../auth/AuthContext";
import { useChatSocket } from "../../hooks/useChatSocket";
import { scrollChatToEnd } from "../../scripts/chatDom";
import type { ChatMessage } from "../../types";
import { MessageBubble } from "./MessageBubble";

export function ChatStream({
  chat,
  isGroup = false,
  className = "",
  onReply,
}: {
  chat: string;
  isGroup?: boolean;
  className?: string;
  onReply: (message: ChatMessage) => void;
}) {
  const { user } = useAuth();
  const streamRef = useRef<HTMLDivElement | null>(null);
  const query = useQuery({
    queryKey: ["messages", chat],
    queryFn: () => listMessages(chat),
    enabled: !!chat && !!user,
  });
  const messages = useMemo(() => query.data || [], [query.data]);
  const { refetch } = query;
  const refetchMessages = useCallback(() => {
    refetch();
  }, [refetch]);
  useChatSocket(chat, !!chat && !!user, refetchMessages);

  useEffect(() => {
    if (!chat || !user || !messages.length) return;
    const hasUnread = messages.some(
      (message) =>
        message.sender !== user.name &&
        !message.seenBy?.some((receipt) => receipt.name === user.name),
    );
    if (hasUnread) markChatSeen(chat).catch(() => {});
  }, [chat, messages, user]);

  useEffect(() => {
    scrollChatToEnd(streamRef.current);
  }, [messages.length, chat]);

  const jumpToMessage = useCallback(
    (id: string) => {
      const container = streamRef.current;
      if (!container) return;
      const selector = `[data-id="${escapeCss(id)}"]`;
      const target = container.querySelector<HTMLElement>(selector);
      if (!target) {
        query.refetch().then(() => {
          const refreshed = container.querySelector<HTMLElement>(selector);
          if (refreshed) highlightMessage(refreshed);
        });
        return;
      }
      highlightMessage(target);
    },
    [query],
  );

  return (
    <div className={`chat-stream ${className}`} ref={streamRef}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          meName={user?.name}
          isGroup={isGroup}
          isAdmin={user?.role === "admin"}
          onReply={onReply}
          onJumpToMessage={jumpToMessage}
          onChanged={() => query.refetch()}
        />
      ))}
    </div>
  );
}

function highlightMessage(target: HTMLElement) {
  target.scrollIntoView({ behavior: "smooth", block: "center" });
  target.classList.add("b-highlight");
  window.setTimeout(() => target.classList.remove("b-highlight"), 1500);
}

function escapeCss(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") return CSS.escape(value);
  return value.replace(/["\\]/g, "\\$&");
}
