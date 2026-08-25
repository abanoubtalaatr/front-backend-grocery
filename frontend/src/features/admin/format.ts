import { useQuery } from '@tanstack/react-query'
import { adminEndpoints, getOne } from './adminApi'
import type { AdminSettings } from './types'

export function formatCurrency(value: number | null | undefined, symbol = '$') {
  const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatNumber(value: number | null | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '0'
  }
  return value.toLocaleString()
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
}

/** Store settings hold the display currency; everything money-shaped reads it from here. */
export function useCurrencySymbol(): string {
  const { data } = useQuery({
    queryKey: ['admin', 'settings', 'currency'],
    queryFn: () => getOne<AdminSettings>(adminEndpoints.settings),
    staleTime: 10 * 60_000,
    retry: false,
  })

  const symbol = data?.currency_symbol
  return typeof symbol === 'string' && symbol.trim() ? symbol : '$'
}
