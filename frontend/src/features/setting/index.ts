export { default as LanguagePage } from '@/features/setting/components/Language';
export { default as AppearancePage } from '@/features/setting/components/Appearance';
export { default as NotificationsPage } from '@/features/setting/components/Notifications';
export { default as DataManagementPage } from '@/features/setting/components/DataManagement';
export { languageService, appearanceService, notificationSettingService, dataManagementService } from '@/features/setting/service';
export { default as useLanguageManagement } from '@/features/setting/hooks/useLanguageManagement';
export { default as useAppearanceManagement } from '@/features/setting/hooks/useAppearanceManagement';
export { default as useNotificationManagement } from '@/features/setting/hooks/useNotificationManagement';
export type { Language, Appearance, Notifications } from '@/features/setting/types';
