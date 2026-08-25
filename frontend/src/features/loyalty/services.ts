import { apiClient } from '@/lib/api/httpClient';
import type { Loyalty } from '@/features/loyalty/types';

function unwrapLoyalty(payload: unknown): Loyalty {
  if (payload == null || typeof payload !== 'object') {
    throw new Error('Invalid loyalty response');
  }
  const root = payload as Record<string, unknown>;
  const data = root.data ?? root;
  if (data == null || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Invalid loyalty response');
  }
  return data as Loyalty;
}

export const loyaltyService = {
  getLoyalty: async (): Promise<Loyalty> => {
    const response = await apiClient.get<unknown>('/api/loyalty');
    return unwrapLoyalty(response.data);
  },
};

export type { Loyalty } from '@/features/loyalty/types';
