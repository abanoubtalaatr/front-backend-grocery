import { Link } from 'react-router-dom'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { adminEndpoints } from '@/features/admin/adminApi'
import { formatCurrency, formatDateTime, useCurrencySymbol } from '@/features/admin/format'
import { useAdminList } from '@/features/admin/hooks'
import { ORDER_STATUSES, type AdminOrder } from '@/features/admin/types'

export function OrdersPage() {
  const currency = useCurrencySymbol()
  const list = useAdminList<AdminOrder>('orders', adminEndpoints.orders, {
    sort: 'created_at',
    direction: 'desc',
  })

  const columns: Array<Column<AdminOrder>> = [
    {
      key: 'order',
      header: 'Order',
      sortKey: 'order_number',
      render: (row) => (
        <Link
          to={`/dashboard/orders/${row.id}`}
          className="text-grocery-900 font-medium hover:underline"
        >
          {row.order_number}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate">{row.customer?.name ?? '—'}</p>
          <p className="text-grocery-300 truncate text-xs">{row.customer?.email ?? ''}</p>
        </div>
      ),
    },
    { key: 'items', header: 'Items', className: 'tabular-nums', render: (row) => row.items_count },
    {
      key: 'payment',
      header: 'Payment',
      render: (row) => (
        <span className="whitespace-nowrap capitalize">{row.payment_method.replace(/_/g, ' ')}</span>
      ),
    },
    { key: 'status', header: 'Status', sortKey: 'status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'total',
      header: 'Total',
      sortKey: 'total',
      className: 'text-right tabular-nums',
      render: (row) => formatCurrency(row.total, currency),
    },
    { key: 'placed', header: 'Placed', sortKey: 'created_at', render: (row) => formatDateTime(row.created_at) },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Orders" description="Every order placed through the store." />

      <Toolbar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Search by order number, customer or phone…"
      >
        <FilterSelect
          label="Status"
          value={String(list.filters.status ?? '')}
          onChange={(value) => list.setFilter('status', value || undefined)}
          options={[
            { value: '', label: 'All statuses' },
            ...ORDER_STATUSES.map((status) => ({
              value: status,
              label: status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            })),
          ]}
        />
        <FilterSelect
          label="Payment method"
          value={String(list.filters.payment_method ?? '')}
          onChange={(value) => list.setFilter('payment_method', value || undefined)}
          options={[
            { value: '', label: 'All payments' },
            { value: 'card', label: 'Card' },
            { value: 'cash_on_delivery', label: 'Cash on delivery' },
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No orders match this filter."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />
    </div>
  )
}
