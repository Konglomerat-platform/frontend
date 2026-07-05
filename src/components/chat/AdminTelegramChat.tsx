import { ChevronLeft, Search, Sparkles, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { initials } from "../../lib/format";
import { listCompanies } from "../../services/companyService";
import { BizAiPanel } from "./BizAiPanel";
import { ChatStream } from "./ChatStream";
import { MessageComposer } from "./MessageComposer";

type ChatEntry = { id: string; name: string; sub: string; ai?: boolean; group?: boolean };

export function AdminTelegramChat() {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("group");
  const [search, setSearch] = useState("");
  const [showThread, setShowThread] = useState(false);
  const qc = useQueryClient();
  const { data: companies = [] } = useQuery({ queryKey: ["companies"], queryFn: listCompanies });

  const entries = useMemo(() => {
    const all: ChatEntry[] = [
      { id: "ai", name: t("aiHelper"), sub: t("online247"), ai: true },
      { id: "group", name: t("groupChat"), sub: t("allParticipants"), group: true },
      ...companies.map((company) => ({ id: company.name, name: company.name, sub: t("personalChat") })),
    ];
    const q = search.trim().toLowerCase();
    return q ? all.filter((item) => item.name.toLowerCase().includes(q)) : all;
  }, [companies, search, t]);

  const active = entries.find((item) => item.id === current) || entries[1] || entries[0];

  return (
    <div className={`panel tg ${showThread ? "show-thread" : ""}`}>
      <div className="tg-list">
        <div className="tg-search"><Search /><input value={search} placeholder={t("search")} onChange={(event) => setSearch(event.target.value)} /></div>
        <div>
          {entries.map((item) => (
            <button key={item.id} className={`tg-item ${item.group || item.ai ? "is-group" : ""} ${item.id === current ? "active" : ""}`} type="button" onClick={() => { setCurrent(item.id); setShowThread(true); }}>
              <div className="avatar">{item.ai ? <Sparkles /> : item.group ? <Users /> : initials(item.name)}</div>
              <div className="grow"><b>{item.name}</b><small>{item.sub}</small></div>
            </button>
          ))}
        </div>
      </div>
      <div className="tg-main">
        <div className={`tg-head ${active?.group || active?.ai ? "is-group" : ""}`}>
          <button className="tg-back" type="button" onClick={() => setShowThread(false)} aria-label="Back"><ChevronLeft /></button>
          <div className="avatar">{active?.ai ? <Sparkles /> : active?.group ? <Users /> : initials(active?.name)}</div>
          <div><b>{active?.name}</b><small>{active?.sub}</small></div>
        </div>
        {current === "ai" ? <div className="ai-wrap"><BizAiPanel /></div> : <><ChatStream chat={current} isGroup={current === "group"} /><MessageComposer chat={current} onSent={() => qc.invalidateQueries({ queryKey: ["messages", current] })} /></>}
      </div>
    </div>
  );
}
