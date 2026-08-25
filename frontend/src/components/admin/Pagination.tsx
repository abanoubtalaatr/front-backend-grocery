import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { PageMeta } from '@/features/admin/types'

type PaginationProps = {
  meta?: PageMeta
  onPageChange: (page: number) => void
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
  if (!meta || meta.total === 0) {
    return null
  }

  const { current_page: current, last_page: last, from, to, total } = meta

  return (
    <div className="text-grocery-500 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p>
        Showing <span className="text-grocery-900 font-medium">{from ?? 0}</span>–
        <span className="text-grocery-900 font-medium">{to ?? 0}</span> of{' '}
        <span className="text-grocery-900 font-medium">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <PageButton
          label="Previous page"
          disabled={current <= 1}
          onClick={() => onPageChange(current - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </PageButton>
        <span className="tabular-nums">
          {current} / {last}
        </span>
        <PageButton
          label="Next page"
          disabled={current >= last}
          onClick={() => onPageChange(current + 1)}
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </PageButton>
      </div>
    </div>
  )
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="border-line text-grocery-600 hover:bg-surface-muted grid h-9 w-9 place-items-center rounded-lg border transition disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
