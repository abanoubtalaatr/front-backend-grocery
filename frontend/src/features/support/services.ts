import { apiClient } from '@/lib/api/httpClient';
import type { AxiosError } from 'axios';
import type { CreateSupportValues } from './schema';
import type { PaginatedFaqs, SupportReport } from './types';

export type ApiErrorShape = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

export function extractApiErrorMessage(err: unknown): string {
  const axiosErr = err as AxiosError<unknown>;
  const data = axiosErr.response?.data as ApiErrorShape | undefined;

  const validationMessage = data?.errors
    ? Object.values(data.errors).flat().filter(Boolean).join('\n')
    : undefined;

  return (
    validationMessage ??
    data?.message ??
    data?.error ??
    axiosErr.message ??
    'Something went wrong'
  );
}

function isPaginatedFaqs(value: unknown): value is PaginatedFaqs {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return Array.isArray(o.data) && o.meta != null && typeof o.meta === 'object';
}

function unwrapFaqsPage(payload: unknown): PaginatedFaqs {
  if (payload == null || typeof payload !== 'object') {
    throw new Error('Invalid FAQs response');
  }

  const root = payload as Record<string, unknown>;

  if (isPaginatedFaqs(root)) {
    return root;
  }

  const nested = root.data;
  if (isPaginatedFaqs(nested)) {
    return nested;
  }

  throw new Error('Invalid FAQs response');
}

function unwrapSupportReport(payload: unknown): SupportReport {
  if (payload == null || typeof payload !== 'object') {
    throw new Error('Invalid support report response');
  }
  const root = payload as Record<string, unknown>;
  const data = root.data ?? root;
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid support report response');
  }
  return data as SupportReport;
}

export const faqsService = {
  getFaqs: async (page = 1, perPage = 15): Promise<PaginatedFaqs> => {
    const response = await apiClient.get<unknown>('/api/faqs', {
      params: { page, per_page: perPage },
    });
    return unwrapFaqsPage(response.data);
  },
};

export const supportService = {
  submitReport: async (values: CreateSupportValues): Promise<SupportReport> => {
    const payload = {
      issue_type: values.issue_type,
      order_number: values.order_number?.trim() || undefined,
      message: values.message,
    };
    const response = await apiClient.post<unknown>('/api/support/report', payload);
    return unwrapSupportReport(response.data);
  },
};
