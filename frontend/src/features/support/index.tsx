export { default as Cards } from '@/features/support/components/Cards';
export { default as Frequently } from '@/features/support/components/Frequently';
export { default as Report } from '@/features/support/components/Report';
export { default as Questions } from '@/features/support/components/Questions';
export { faqsService, supportService } from '@/features/support/services';
export { useFaqsManagement } from '@/features/support/hooks/useFaqsManagement';
export { useReportSupport } from '@/features/support/hooks/useReportSupport';  
export type { Faq, PaginatedFaqs, FaqMeta, FaqLinks, SupportReport } from '@/features/support/types';
