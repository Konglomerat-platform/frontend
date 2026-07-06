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
          onChanged={() => query.refetch()}
        />
      ))}
    </div>
  );
}
