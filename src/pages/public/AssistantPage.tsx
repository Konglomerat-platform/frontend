import { SiteHeader } from "../../components/layout/SiteHeader";
import { BizAiPanel } from "../../components/chat/BizAiPanel";

export function AssistantPage() {
  return (
    <>
      <SiteHeader />
      <main className="section container">
        <div className="asst-page">
          <BizAiPanel />
        </div>
      </main>
    </>
  );
}
