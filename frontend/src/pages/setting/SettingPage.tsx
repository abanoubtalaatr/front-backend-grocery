import { DataManagementPage, LanguagePage, AppearancePage, NotificationsPage } from "@/features/setting";
import { Suspense } from "react";

export default function SettingPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LanguagePage />
        <AppearancePage />
        <NotificationsPage />
        <DataManagementPage />
      </Suspense>
    </div>
  );
}
