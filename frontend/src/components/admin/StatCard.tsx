import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type StatCardProps = {
  label: string
  value: ReactNode
  /** Percent change vs. the previous window; `null` when there is no baseline. */
  change?: number | null
  hint?: string
  icon?: ReactNode
}

export function StatCard({ label, value, change, hint, icon }: StatCardProps) {
  const hasChange = typeof change === 'number' && Number.isFinite(change)

  return (
    <div className="border-line bg-surface rounded-2xl border p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-grocery-500 text-sm font-medium">{label}</p>
        {icon ? (
          <span className="bg-surface-sunken text-grocery-800 grid h-9 w-9 place-items-center rounded-xl">
            {icon}
          </span>
        ) : null}
      </div>

      <p className="text-grocery-900 mt-3 text-2xl font-semibold tabular-nums">{value}</p>

      <p className="mt-2 flex items-center gap-2 text-xs">
        {hasChange ? (
          <span
            className={cn(
              'font-medium tabular-nums',
              change >= 0 ? 'text-success-700' : 'text-danger-700',
            )}
          >
            {change >= 0 ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        ) : (
          <span className="text-grocery-300">—</span>
        )}
        {hint ? <span className="text-grocery-500">{hint}</span> : null}
      </p>
    </div>
  )
}
