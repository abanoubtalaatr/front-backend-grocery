import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatusBadge, humanize } from '@/components/admin/StatusBadge'
import { FilterSelect } from '@/components/admin/Toolbar'
import { paths } from '@/constants/paths'
import { adminEndpoints, put } from '@/features/admin/adminApi'
import { formatCurrency, formatDateTime, useCurrencySymbol } from '@/features/admin/format'
import { useAdminDetail, useAdminMutation } from '@/features/admin/hooks'
import { ORDER_STATUSES, type AdminOrderDetail, type OrderStatus } from '@/features/admin/types'

export function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const id = orderId ? Number(orderId) : null
  const currency = useCurrencySymbol()

  const { data, isPending, isError } = useAdminDetail<AdminOrderDetail>(
    'orders',
    id ? adminEndpoints.order(id) : null,
    id,
  )

  const updateStatus = useAdminMutation(
    (status: OrderStatus) => put(adminEndpoints.orderStatus(id as number), { status }),
    'Could not update the order status',
  )

  if (isPending) {
    return <p className="text-grocery-500 text-sm">Loading order…</p>
  }

  if (isError || !data) {
    return <p className="text-danger-700 text-sm">Could not load this order.</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to={paths.dashboardOrders}
          className="text-grocery-500 hover:text-grocery-900 mb-3 inline-flex items-center gap-1 text-sm transition"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          All orders
        </Link>

        <PageHeader
          title={data.order_number}
          description={`Placed ${formatDateTime(data.created_at)}`}
          actions={
            <FilterSelect
              label="Order status"
              value={data.status}
              onChange={(value) => updateStatus.mutate(value as OrderStatus)}
              options={ORDER_STATUSES.map((status) => ({ value: status, label: humanize(status) }))}
            />
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="border-line bg-surface rounded-2xl border p-5 lg:col-span-2">
          <h2 className="text-grocery-900 mb-4 text-sm font-semibold">Items</h2>
          <ul className="divide-line divide-y">
            {data.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt=""
                    loading="lazy"
                    className="border-line h-12 w-12 shrink-0 rounded-lg border object-cover"
                  />
                ) : (
                  <span className="bg-surface-sunken h-12 w-12 shrink-0 rounded-lg" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-grocery-900 truncate text-sm font-medium">{item.title ?? '—'}</p>
                  <p className="text-grocery-500 text-xs tabular-nums">
                    {item.quantity} × {formatCurrency(item.unit_price, currency)}
                  </p>
                </div>
                <p className="text-grocery-900 shrink-0 text-sm font-medium tabular-nums">
                  {formatCurrency(item.subtotal, currency)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
            <Row label="Subtotal" value={formatCurrency(data.subtotal, currency)} />
            <Row label="Tax" value={formatCurrency(data.tax, currency)} />
            <Row label="Discount" value={`− ${formatCurrency(data.discount, currency)}`} />
            <Row label="Total" value={formatCurrency(data.total, currency)} strong />
          </dl>
        </section>

        <div className="flex flex-col gap-4">
          <section className="border-line bg-surface rounded-2xl border p-5">
            <h2 className="text-grocery-900 mb-3 text-sm font-semibold">Customer</h2>
            <p className="text-grocery-900 text-sm">{data.customer?.name ?? '—'}</p>
            <p className="text-grocery-500 text-sm">{data.customer?.email ?? '—'}</p>
            <p className="text-grocery-500 text-sm">{data.customer?.phone ?? '—'}</p>
          </section>

          <section className="border-line bg-surface rounded-2xl border p-5">
            <h2 className="text-grocery-900 mb-3 text-sm font-semibold">Fulfilment</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Type" value={humanize(data.delivery_type)} />
              <Row label="Payment" value={humanize(data.payment_method)} />
              <Row label="Speed" value={data.delivery_speed ? humanize(data.delivery_speed) : '—'} />
              <Row label="Scheduled" value={data.schedule_delivery ?? '—'} />
            </dl>
            {data.notes ? (
              <p className="bg-surface-muted text-grocery-600 mt-3 rounded-lg p-3 text-sm">
                {data.notes}
              </p>
            ) : null}
          </section>

          <section className="border-line bg-surface rounded-2xl border p-5">
            <h2 className="text-grocery-900 mb-3 text-sm font-semibold">Timeline</h2>
            <ul className="space-y-2 text-sm">
              {Object.entries(data.timeline).map(([key, value]) => (
                <li key={key} className="flex items-center justify-between gap-3">
                  <span className="text-grocery-500">{humanize(key.replace(/_at$/, ''))}</span>
                  <span className="text-grocery-900 tabular-nums">{formatDateTime(value)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <StatusBadge status={data.status} />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-grocery-500">{label}</dt>
      <dd className={strong ? 'text-grocery-900 font-semibold tabular-nums' : 'text-grocery-900 tabular-nums'}>
        {value}
      </dd>
    </div>
  )
}
