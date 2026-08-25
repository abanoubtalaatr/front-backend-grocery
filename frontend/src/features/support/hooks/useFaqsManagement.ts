import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { faqsService } from '../services';

export function useFaqsManagement(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const { data, isPending: isLoading, isError, error } = useQuery({
    queryKey: ['faqs', page],
    queryFn: () => faqsService.getFaqs(page),
    placeholderData: (previous) => previous,
  });

  return {
    faqs: data?.data ?? [],
    meta: data?.meta,
    page,
    setPage,
    isLoading,
    isError,
    error,
  };
}
