import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { markChatSeen, listMessages } from "../../services/chatService";
import { useAuth } from "../../auth/AuthContext";
import { scrollChatToEnd } from "../../scripts/chatDom";
import { MessageBubble } from "./MessageBubble";

export function ChatStream({ chat, isGroup = false, className = "" }: { chat: string; isGroup?: boolean; className?: string }) {
  const { user } = useAuth();
  const streamRef = useRef<HTMLDivElement | null>(null);
  const query = useQuery({
    queryKey: ["messages", chat],
    queryFn: () => listMessages(chat),
    enabled: !!chat && !!user,
    refetchInterval: 3000,
  });

  useEffect(() => {
    if (chat && user) markChatSeen(chat).then(() => query.refetch()).catch(() => {});
  }, [chat, user?.id]);

  useEffect(() => {
    scrollChatToEnd(streamRef.current);
  }, [query.data?.length, chat]);

  return (
    <div className={`chat-stream ${className}`} ref={streamRef}>
      {(query.data || []).map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          meName={user?.name}
          isGroup={isGroup}
          isAdmin={user?.role === "admin"}
          onChanged={() => query.refetch()}
        />
      ))}
    </div>
  );
}
