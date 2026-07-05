import { AdminTelegramChat } from "../../components/chat/AdminTelegramChat";
import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function AdminChatsPage() {
  return (
    <WorkspaceLayout role="admin" active="chats" chatPage>
      <PageTitle title="Чаты" />
      <AdminTelegramChat />
    </WorkspaceLayout>
  );
}
