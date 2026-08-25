import { cn } from '@/lib/cn'

export type BarListItem = {
  key: string
  label: string
  value: number
  /** Right-hand caption, e.g. a currency total next to a unit count. */
  caption?: string
  /** Reserved status colours; omit for the default single-hue magnitude bar. */
  tone?: 'success' | 'warning' | 'danger' | 'info'
}

const toneFills: Record<NonNullable<BarListItem['tone']>, string> = {
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
  info: 'bg-info-500',
}

type BarListProps = {
  items: BarListItem[]
  emptyMessage?: string
}

/**
 * Horizontal magnitude bars. Every row is labelled in text, so colour is never
 * the only thing carrying meaning.
 */
export function BarList({ items, emptyMessage = 'No data yet.' }: BarListProps) {
  if (items.length === 0) {
    return <p className="text-grocery-500 py-8 text-center text-sm">{emptyMessage}</p>
  }

  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
            <span className="text-grocery-900 truncate font-medium">{item.label}</span>
            <span className="text-grocery-500 shrink-0 tabular-nums">
              {item.caption ?? item.value.toLocaleString()}
            </span>
          </div>
          <div className="bg-surface-sunken h-2 w-full overflow-hidden rounded-full">
            <div
              className={cn('h-full rounded-full', item.tone ? toneFills[item.tone] : 'bg-grocery-900')}
              style={{ width: `${Math.max(2, (item.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
