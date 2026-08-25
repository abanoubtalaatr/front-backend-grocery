import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, Wallet } from 'lucide-react'
import { BarList, type BarListItem } from '@/components/admin/BarList'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { RevenueChart } from '@/components/admin/RevenueChart'
import { StatCard } from '@/components/admin/StatCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { FilterSelect } from '@/components/admin/Toolbar'
import { paths } from '@/constants/paths'
import { useAdminStats } from '@/features/admin/hooks'
import { formatCurrency, formatDateTime, formatNumber, useCurrencySymbol } from '@/features/admin/format'
import type { AdminStats, OrderStatus } from '@/features/admin/types'

type RecentOrder = AdminStats['recent_orders'][number]

/** Status → the reserved status colour, so the same state reads the same everywhere. */
const statusTones: Record<OrderStatus, BarListItem['tone']> = {
  placed: 'info',
  processing: 'info',
  shipping: 'warning',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
}

export function OverviewPage() {
  const [days, setDays] = useState(14)
  const { data, isPending, isError } = useAdminStats(days)
  const currency = useCurrencySymbol()

  const totals = data?.totals

  const recentOrderColumns: Array<Column<RecentOrder>> = [
    {
      key: 'order',
      header: 'Order',
      render: (row) => <span className="text-grocery-900 font-medium">{row.order_number}</span>,
    },
    { key: 'customer', header: 'Customer', render: (row) => row.customer ?? '—' },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'total',
      header: 'Total',
      className: 'text-right tabular-nums',
      render: (row) => formatCurrency(row.total, currency),
    },
    { key: 'date', header: 'Placed', render: (row) => formatDateTime(row.created_at) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Revenue, orders and everything that needs attention."
        actions={
          <FilterSelect
            label="Date range"
            value={String(days)}
            onChange={(value) => setDays(Number(value))}
            options={[
              { value: '7', label: 'Last 7 days' },
              { value: '14', label: 'Last 14 days' },
              { value: '30', label: 'Last 30 days' },
              { value: '90', label: 'Last 90 days' },
            ]}
          />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          value={formatCurrency(totals?.revenue, currency)}
          change={totals?.revenue_change}
          hint="vs. previous period"
          icon={<Wallet className="h-4 w-4" aria-hidden />}
        />
        <StatCard
          label="Orders"
          value={formatNumber(totals?.orders)}
          change={totals?.orders_change}
          hint={`${formatCurrency(totals?.average_order_value, currency)} avg.`}
          icon={<ShoppingBag className="h-4 w-4" aria-hidden />}
        />
        <StatCard
          label="New customers"
          value={formatNumber(totals?.customers)}
          change={totals?.customers_change}
          hint={`${formatNumber(totals?.all_time_customers)} total`}
          icon={<Users className="h-4 w-4" aria-hidden />}
        />
        <StatCard
          label="Products"
          value={formatNumber(totals?.products)}
          hint={`${formatNumber(totals?.pending_reviews)} reviews awaiting approval`}
          icon={<Package className="h-4 w-4" aria-hidden />}
        />
      </div>

      <section className="border-line bg-surface rounded-2xl border p-5">
        <h2 className="text-grocery-900 text-sm font-semibold">
          Daily revenue — last {days} days
        </h2>
        {isPending ? (
          <div className="bg-surface-sunken mt-4 h-[240px] animate-pulse rounded-xl" />
        ) : isError ? (
          <p className="text-danger-700 mt-4 text-sm">Could not load statistics.</p>
        ) : (
          <div className="mt-4">
            <RevenueChart data={data?.revenue_series ?? []} currency={currency} />
          </div>
        )}
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="border-line bg-surface rounded-2xl border p-5">
          <h2 className="text-grocery-900 mb-4 text-sm font-semibold">Orders by status</h2>
          <BarList
            items={(data?.orders_by_status ?? []).map((row) => ({
              key: row.status,
              label: row.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              value: row.count,
              tone: statusTones[row.status],
            }))}
          />
        </section>

        <section className="border-line bg-surface rounded-2xl border p-5">
          <h2 className="text-grocery-900 mb-4 text-sm font-semibold">Best sellers</h2>
          <BarList
            items={(data?.top_products ?? []).map((row) => ({
              key: String(row.id),
              label: row.title,
              value: row.quantity,
              caption: `${formatNumber(row.quantity)} · ${formatCurrency(row.revenue, currency)}`,
            }))}
            emptyMessage="No sales in this period."
          />
        </section>

        <section className="border-line bg-surface rounded-2xl border p-5">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-grocery-900 text-sm font-semibold">Low stock</h2>
            <Link
              to={`${paths.dashboardProducts}?low_stock=1`}
              className="text-grocery-800 text-xs font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <BarList
            items={(data?.low_stock ?? []).map((row) => ({
              key: String(row.id),
              label: row.title,
              value: Math.max(row.stock_quantity, 0),
              caption: `${row.stock_quantity} left`,
              tone: row.stock_quantity === 0 ? 'danger' : 'warning',
            }))}
            emptyMessage="Everything is well stocked."
          />
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-grocery-900 text-sm font-semibold">Recent orders</h2>
          <Link
            to={paths.dashboardOrders}
            className="text-grocery-800 text-xs font-medium hover:underline"
          >
            View all orders
          </Link>
        </div>
        <DataTable
          rows={data?.recent_orders ?? []}
          columns={recentOrderColumns}
          getRowKey={(row) => row.id}
          isLoading={isPending}
          isError={isError}
          emptyMessage="No orders yet."
        />
      </section>
    </div>
  )
}
