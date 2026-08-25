import { useQuery } from '@tanstack/react-query';
import { getStoredToken } from '@/lib/auth/authTokenStorage';
import { loyaltyService } from '../services';
import type { Loyalty } from '../types';

export function useLoyaltyManagement() {
  const hasToken = Boolean(getStoredToken());

  const { data: loyalty, isPending: isLoading, isError, error } = useQuery<Loyalty>({
    queryKey: ['loyalty'],
    queryFn: loyaltyService.getLoyalty,
    enabled: hasToken,
  });

  return { loyalty, isLoading, isError, error, hasToken };
}
