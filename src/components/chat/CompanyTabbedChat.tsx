import { MessageCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { ChatStream } from "./ChatStream";
import { MessageComposer } from "./MessageComposer";
import { BizAiPanel } from "./BizAiPanel";

export function CompanyTabbedChat() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"group" | "me" | "ai">("group");
  const qc = useQueryClient();
  const chat = tab === "group" ? "group" : user?.company?.name || user?.name || "";

  return (
    <>
      <div className="chat-tabs">
        <button className={`chat-tab ${tab === "group" ? "active" : ""}`} type="button" onClick={() => setTab("group")}>
          <span className="ct-ico">
            <MessageCircle />
          </span>
          <span>Общий чат</span>
        </button>
        <button className={`chat-tab ${tab === "me" ? "active" : ""}`} type="button" onClick={() => setTab("me")}>
          <span className="ct-ico">
            <Users />
          </span>
          <span>Админ чат</span>
        </button>
        <button className={`chat-tab ${tab === "ai" ? "active" : ""}`} type="button" onClick={() => setTab("ai")}>
          <span className="ct-ico">
            <Sparkles />
          </span>
          <span>AI-ассистент</span>
        </button>
      </div>
      {tab === "ai" ? (
        <div className="panel chat-box company-ai">
          <BizAiPanel />
        </div>
      ) : (
        <div className="panel chat-box company-chat-box">
          <div className="panel-head">
            <div>
              <h3>{tab === "group" ? "Общий чат" : "Админ чат"}</h3>
              <span className="who">{tab === "group" ? "31 участник" : "Admin · 1:1"}</span>
            </div>
            {tab === "group" ? <span className="tag">31</span> : null}
          </div>
          <ChatStream chat={chat} isGroup={tab === "group"} />
          <MessageComposer chat={chat} onSent={() => qc.invalidateQueries({ queryKey: ["messages", chat] })} />
        </div>
      )}
    </>
  );
}
