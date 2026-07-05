import { useTranslation } from "react-i18next";

import { CompanyTabbedChat } from "../../components/chat/CompanyTabbedChat";
import { PageTitle } from "../../components/ui/PageTitle";
import { WorkspaceLayout } from "../../layouts/WorkspaceLayout";

export function CompanyChatsPage() {
  const { t } = useTranslation();

  return (
    <WorkspaceLayout role="company" active="chats">
      <PageTitle title={t("chats")} />
      <CompanyTabbedChat />
    </WorkspaceLayout>
  );
}
