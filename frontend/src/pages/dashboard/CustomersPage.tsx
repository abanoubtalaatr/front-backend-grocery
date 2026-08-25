import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge } from '@/components/admin/StatusBadge'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { adminEndpoints, del, put } from '@/features/admin/adminApi'
import { formatCurrency, formatDate, useCurrencySymbol } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminUser } from '@/features/admin/types'

export function CustomersPage() {
  const currency = useCurrencySymbol()
  const list = useAdminList<AdminUser>('users', adminEndpoints.users, {
    sort: 'created_at',
    direction: 'desc',
  })
  const [pendingDelete, setPendingDelete] = useState<AdminUser | null>(null)

  const patch = useAdminMutation(
    ({ id, ...values }: { id: number } & Record<string, unknown>) =>
      put(adminEndpoints.user(id), values),
    'Could not update the customer',
  )

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.user(id)),
    'Could not delete the customer',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminUser>> = [
    {
      key: 'user',
      header: 'Customer',
      sortKey: 'username',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate font-medium">{row.username || '—'}</p>
          <p className="text-grocery-300 truncate text-xs">{row.email}</p>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (row) => row.phone || '—' },
    { key: 'orders', header: 'Orders', className: 'tabular-nums', render: (row) => row.orders_count ?? 0 },
    {
      key: 'spend',
      header: 'Lifetime spend',
      className: 'text-right tabular-nums',
      render: (row) => formatCurrency(row.orders_total ?? 0, currency),
    },
    {
      key: 'points',
      header: 'Points',
      sortKey: 'loyalty_points',
      className: 'tabular-nums',
      render: (row) => row.loyalty_points,
    },
    {
      key: 'active',
      header: 'Account',
      render: (row) => (
        <button
          type="button"
          title="Toggle account status"
          onClick={() => patch.mutate({ id: row.id, is_active: !row.is_active })}
        >
          <BoolBadge value={row.is_active} trueLabel="Active" falseLabel="Suspended" />
        </button>
      ),
    },
    {
      key: 'admin',
      header: 'Admin',
      render: (row) => (
        <button
          type="button"
          title="Toggle admin access"
          onClick={() => patch.mutate({ id: row.id, is_admin: !row.is_admin })}
        >
          <BoolBadge value={row.is_admin} trueLabel="Admin" falseLabel="—" />
        </button>
      ),
    },
    { key: 'joined', header: 'Joined', sortKey: 'created_at', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <IconButton label="Delete" tone="danger" onClick={() => setPendingDelete(row)}>
          <Trash2 className="h-4 w-4" aria-hidden />
        </IconButton>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Customers" description="Accounts registered on the store." />

      <Toolbar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Search by name, email or phone…"
      >
        <FilterSelect
          label="Account status"
          value={String(list.filters.is_active ?? '')}
          onChange={(value) => list.setFilter('is_active', value || undefined)}
          options={[
            { value: '', label: 'All accounts' },
            { value: '1', label: 'Active' },
            { value: '0', label: 'Suspended' },
          ]}
        />
        <FilterSelect
          label="Role"
          value={String(list.filters.is_admin ?? '')}
          onChange={(value) => list.setFilter('is_admin', value || undefined)}
          options={[
            { value: '', label: 'All roles' },
            { value: '1', label: 'Admins' },
            { value: '0', label: 'Customers' },
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No customers match this filter."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete customer"
        description={`${pendingDelete?.email ?? 'This account'} will be removed. Their past orders are kept.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}
