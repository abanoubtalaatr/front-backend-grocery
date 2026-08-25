import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { MOCK_ORDERS, type MockOrder } from '@/pages/profile/mockOrders'
import { cn } from '@/lib/cn'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

const STATUS_OPTIONS = ['All Status', 'Completed', 'Processing', 'Cancelled'] as const
const TIME_OPTIONS = ['Last 30 days', 'Last 3 months', 'This year', 'All time'] as const

const VISIBLE_PREVIEWS = 3

function OrderCard({ order }: { order: MockOrder }) {
  const shown = order.lines.slice(0, VISIBLE_PREVIEWS)
  return (
    <article className="border-grocery-100 overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-grocery-100 flex flex-wrap items-center justify-between gap-3 border-b bg-grocery-50/50 px-4 py-3">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
          <span className="text-grocery-900 font-semibold">Order #{order.id}</span>
          <span className="text-grocery-500">{order.dateLabel}</span>
          <span className="text-grocery-600">
            {order.itemCount} {order.itemCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            order.status === 'Completed' && 'bg-emerald-100 text-emerald-800',
            order.status === 'Processing' && 'bg-sky-100 text-sky-800',
            order.status === 'Cancelled' && 'bg-grocery-200 text-grocery-800',
          )}
        >
          {order.status}
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto px-3 py-4 sm:px-4">
        {shown.map((line) => (
          <div
            key={`${order.id}-${line.name}`}
            className="border-grocery-100 w-[100px] shrink-0 rounded-xl border bg-white p-2 text-center shadow-sm"
          >
            <div className="bg-grocery-50 aspect-square w-full overflow-hidden rounded-lg">
              <img
                src={line.imageUrl}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-grocery-900 mt-1.5 line-clamp-2 min-h-8 text-[11px] font-medium leading-tight">
              {line.name}
            </p>
            <p className="text-grocery-500 mt-0.5 text-[10px]">Qty : {line.qty}</p>
          </div>
        ))}
        {order.moreCount > 0 && (
          <div className="border-grocery-200 bg-grocery-50 text-grocery-600 flex w-[100px] shrink-0 flex-col items-center justify-center rounded-xl border border-dashed p-2 text-sm font-semibold">
            +{order.moreCount} more
          </div>
        )}
      </div>
      <div className="border-grocery-100 flex flex-wrap items-center justify-between gap-4 border-t px-4 py-4">
        <p className="text-grocery-900 text-xl font-bold tabular-nums">
          {gbp.format(order.totalGbp)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="border-grocery-200 text-grocery-700 hover:bg-grocery-50 inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-medium"
            onClick={() => toast.message('Receipt download will use your orders API.')}
          >
            <span aria-hidden>⎘</span> Download receipt
          </button>
          <button
            type="button"
            className="border-grocery-200 text-grocery-700 hover:bg-grocery-50 inline-flex items-center gap-1.5 rounded-lg border bg-white px-3 py-2 text-xs font-medium"
            onClick={() => toast.message('Rating will be available after purchase API is connected.')}
          >
            <span aria-hidden>☆</span> Rate
          </button>
          <button
            type="button"
            className="bg-grocery-900 text-white hover:bg-grocery-800 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
            onClick={() => toast.message('Add these items to cart from your order history.')}
          >
            Reorder
          </button>
        </div>
      </div>
    </article>
  )
}

export function OrderHistoryPage() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('All Status')
  const [timeframe, setTimeframe] = useState<(typeof TIME_OPTIONS)[number]>('Last 30 days')

  const filtered = useMemo(() => {
    return MOCK_ORDERS.filter((o) => {
      if (query.trim()) {
        const q = query.trim().toLowerCase()
        if (!o.id.toLowerCase().includes(q) && !o.dateLabel.toLowerCase().includes(q)) {
          return false
        }
      }
      if (status !== 'All Status' && o.status !== status) {
        return false
      }
      if (timeframe === 'All time') {
        return true
      }
      return true
    })
  }, [query, status, timeframe])

  return (
    <div>
      <h1 className="text-grocery-900 text-2xl font-bold tracking-tight">Order History</h1>
      <p className="text-grocery-600 mt-1 text-sm">
        View and manage all your past orders.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="border-grocery-200 relative min-w-0 flex-1 sm:max-w-xs sm:flex-initial">
          <span className="text-grocery-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" aria-hidden>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders"
            className="border-grocery-200 focus:border-grocery-500 focus:ring-grocery-200 w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])}
          className="border-grocery-200 text-grocery-800 rounded-xl border bg-white py-2.5 pl-3 pr-8 text-sm outline-none"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as (typeof TIME_OPTIONS)[number])}
          className="border-grocery-200 text-grocery-800 rounded-xl border bg-white py-2.5 pl-3 pr-8 text-sm outline-none"
        >
          {TIME_OPTIONS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <ul className="mt-8 space-y-6">
        {filtered.map((order) => (
          <li key={order.id}>
            <OrderCard order={order} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-grocery-500 mt-8 text-sm">No orders match your filters.</p>
      )}
    </div>
  )
}
