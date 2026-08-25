import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export type Column<T> = {
  key: string
  header: string
  /** Column name the API accepts in `?sort=`; omit for display-only columns. */
  sortKey?: string
  className?: string
  render: (row: T) => ReactNode
}

type DataTableProps<T> = {
  rows: T[]
  columns: Array<Column<T>>
  getRowKey: (row: T) => string | number
  isLoading?: boolean
  isError?: boolean
  errorMessage?: string
  emptyMessage?: string
  sort?: { key?: string; direction?: 'asc' | 'desc' }
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void
  onRowClick?: (row: T) => void
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  isLoading,
  isError,
  errorMessage = 'Could not load this list.',
  emptyMessage = 'Nothing here yet.',
  sort,
  onSortChange,
  onRowClick,
}: DataTableProps<T>) {
  const columnCount = columns.length

  return (
    <div className="border-line bg-surface overflow-hidden rounded-2xl border">
      {/* Tables scroll inside their own container so the page never scrolls sideways. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="bg-surface-muted text-grocery-500 text-xs uppercase">
            <tr>
              {columns.map((column) => {
                const sortable = Boolean(column.sortKey && onSortChange)
                const active = sort?.key && sort.key === column.sortKey
                const nextDirection = active && sort?.direction === 'asc' ? 'desc' : 'asc'

                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn('px-4 py-3 font-semibold tracking-wide', column.className)}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => onSortChange?.(column.sortKey as string, nextDirection)}
                        className="hover:text-grocery-900 inline-flex items-center gap-1 transition"
                      >
                        {column.header}
                        {active ? (
                          sort?.direction === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5" aria-hidden />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5" aria-hidden />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" aria-hidden />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody className="divide-line divide-y">
            {isLoading ? (
              <SkeletonRows columns={columnCount} />
            ) : isError ? (
              <MessageRow columns={columnCount} tone="error">
                {errorMessage}
              </MessageRow>
            ) : rows.length === 0 ? (
              <MessageRow columns={columnCount}>{emptyMessage}</MessageRow>
            ) : (
              rows.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition',
                    onRowClick && 'hover:bg-surface-muted cursor-pointer',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn('text-grocery-600 px-4 py-3 align-middle', column.className)}
                    >
                      {column.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((__, cellIndex) => (
            <td key={cellIndex} className="px-4 py-3">
              <span className="bg-surface-sunken block h-4 w-full animate-pulse rounded" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

function MessageRow({
  columns,
  children,
  tone = 'muted',
}: {
  columns: number
  children: ReactNode
  tone?: 'muted' | 'error'
}) {
  return (
    <tr>
      <td
        colSpan={columns}
        className={cn(
          'px-4 py-12 text-center text-sm',
          tone === 'error' ? 'text-danger-700' : 'text-grocery-500',
        )}
      >
        {children}
      </td>
    </tr>
  )
}
