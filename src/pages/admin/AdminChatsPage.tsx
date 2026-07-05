import { useTranslation } from "react-i18next";

import { AdminTelegramChat } from "../../components/chat/AdminTelegramChat";
import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function AdminChatsPage() {
  const { t } = useTranslation();
  return (
    <WorkspaceLayout role="admin" active="chats" chatPage>
      <PageTitle title={t("chats")} />
      <AdminTelegramChat />
    </WorkspaceLayout>
  );
}
