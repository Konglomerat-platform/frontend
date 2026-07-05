import { PageTitle } from "../../components/ui/PageTitle";
import { CompanyTabbedChat } from "../../components/chat/CompanyTabbedChat";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function CompanyChatsPage() {
  return (
    <WorkspaceLayout role="company" active="chats">
      <PageTitle title="Чаты" />
      <CompanyTabbedChat />
    </WorkspaceLayout>
  );
}
