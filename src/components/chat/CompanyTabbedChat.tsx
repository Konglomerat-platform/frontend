import { MessageCircle, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "../../auth/AuthContext";
import { BizAiPanel } from "./BizAiPanel";
import { ChatStream } from "./ChatStream";
import { MessageComposer } from "./MessageComposer";

export function CompanyTabbedChat() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [tab, setTab] = useState<"group" | "me" | "ai">("group");
  const qc = useQueryClient();
  const chat = tab === "group" ? "group" : user?.company?.name || user?.name || "";

  return (
    <>
      <div className="chat-tabs">
        <button className={`chat-tab ${tab === "group" ? "active" : ""}`} type="button" onClick={() => setTab("group")}><span className="ct-ico"><MessageCircle /></span><span>{t("groupChat")}</span></button>
        <button className={`chat-tab ${tab === "me" ? "active" : ""}`} type="button" onClick={() => setTab("me")}><span className="ct-ico"><Users /></span><span>{t("adminChat")}</span></button>
        <button className={`chat-tab ${tab === "ai" ? "active" : ""}`} type="button" onClick={() => setTab("ai")}><span className="ct-ico"><Sparkles /></span><span>{t("assistant")}</span></button>
      </div>
      {tab === "ai" ? (
        <div className="panel chat-box company-ai"><BizAiPanel /></div>
      ) : (
        <div className="panel chat-box company-chat-box">
          <div className="panel-head">
            <div>
              <h3>{tab === "group" ? t("groupChat") : t("adminChat")}</h3>
              <span className="who">{tab === "group" ? t("participants31") : t("adminOneToOne")}</span>
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
