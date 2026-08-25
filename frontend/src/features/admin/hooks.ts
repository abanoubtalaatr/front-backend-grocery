import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { toApiError } from '@/lib/api/toApiError'
import { toastApiError } from '@/lib/api/toastApiError'
import { adminEndpoints, del, getList, getOne, post, put, sendForm } from './adminApi'
import type { AdminStats, ListParams, Paginated } from './types'

/** Namespaced so `invalidateQueries({ queryKey: ['admin'] })` clears the whole dashboard. */
export const adminKeys = {
  all: ['admin'] as const,
  list: (resource: string, params: ListParams) => ['admin', resource, 'list', params] as const,
  detail: (resource: string, id: number | null) => ['admin', resource, 'detail', id] as const,
  stats: (days: number) => ['admin', 'stats', days] as const,
}

export function useAdminStats(days = 14) {
  return useQuery({
    queryKey: adminKeys.stats(days),
    queryFn: () => getOne<AdminStats>(adminEndpoints.stats, { days }),
    staleTime: 60_000,
  })
}

/**
 * Table state (page / search / sort) plus the matching query, so every list
 * screen is a single hook call.
 */
export function useAdminList<T>(resource: string, url: string, initial: ListParams = {}) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ListParams>(initial)

  const params = useMemo<ListParams>(
    () => ({ ...filters, page, search: search.trim() || undefined }),
    [filters, page, search],
  )

  const query = useQuery({
    queryKey: adminKeys.list(resource, params),
    queryFn: () => getList<T>(url, params),
    placeholderData: (previous: Paginated<T> | undefined) => previous,
  })

  return {
    query,
    params,
    page,
    search,
    filters,
    setPage,
    /** Any new search term restarts paging — page 3 of the old result set is meaningless. */
    setSearch: (value: string) => {
      setSearch(value)
      setPage(1)
    },
    setFilter: (key: string, value: string | number | boolean | undefined) => {
      setFilters((current) => ({ ...current, [key]: value }))
      setPage(1)
    },
    setSort: (sort: string, direction: 'asc' | 'desc') => {
      setFilters((current) => ({ ...current, sort, direction }))
      setPage(1)
    },
  }
}

export function useAdminDetail<T>(resource: string, url: string | null, id: number | null) {
  return useQuery({
    queryKey: adminKeys.detail(resource, id),
    queryFn: () => getOne<T>(url as string),
    enabled: url !== null && id !== null,
  })
}

type MutationExtras<TData, TVars> = Omit<
  UseMutationOptions<TData, unknown, TVars>,
  'mutationFn' | 'onError'
>

/**
 * Every admin mutation refreshes the dashboard cache and surfaces API errors as
 * a toast, so screens only supply the request itself.
 */
export function useAdminMutation<TData, TVars>(
  mutationFn: (vars: TVars) => Promise<TData>,
  errorFallback: string,
  options: MutationExtras<TData, TVars> = {},
) {
  const queryClient = useQueryClient()

  return useMutation<TData, unknown, TVars>({
    mutationFn,
    ...options,
    onSuccess: (...args) => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.all })
      options.onSuccess?.(...args)
    },
    onError: (error) => toastApiError(toApiError(error, errorFallback), errorFallback),
  })
}

export { adminEndpoints, del, getList, getOne, post, put, sendForm }
