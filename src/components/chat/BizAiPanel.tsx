import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { sendAiMessage } from "../../services/aiService";

export function BizAiPanel() {
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Array<{ who: "me" | "them"; text: string }>>([
    { who: "them", text: t("aiGreeting") },
  ]);

  async function send() {
    const value = text.trim();
    if (!value) return;
    setText("");
    setMessages((items) => [...items, { who: "me", text: value }]);
    const response = await sendAiMessage({ message: value, lang: i18n.language });
    setMessages((items) => [...items, { who: "them", text: response.reply || t("aiOffTopic") }]);
  }

  return (
    <div className="asst-shell">
      <div className="asst-head">
        <div className="avatar"><Bot /></div>
        <div>
          <b>{t("aiHelper")}</b>
          <small>{t("online247")}</small>
        </div>
      </div>
      <div className="chat-stream">
        {messages.map((message, index) => (
          <div className={`bubble ${message.who === "me" ? "me" : "them"}`} key={`${message.text}-${index}`}>{message.text}</div>
        ))}
      </div>
      <div className="chat-input">
        <input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && send()} placeholder={t("yourQuestion")} />
        <button className="btn btn-primary btn-sm" type="button" onClick={send}><Send /> {t("send")}</button>
      </div>
    </div>
  );
}
