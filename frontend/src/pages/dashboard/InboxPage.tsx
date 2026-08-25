import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { StatusBadge, humanize } from '@/components/admin/StatusBadge'
import { Tabs } from '@/components/admin/Tabs'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { adminEndpoints, del, put } from '@/features/admin/adminApi'
import { formatDateTime } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminMessage, AdminReport } from '@/features/admin/types'

type Tab = 'messages' | 'reports'

const MESSAGE_STATUSES = ['new', 'read', 'replied', 'spam'] as const
const REPORT_STATUSES = ['new', 'read', 'resolved'] as const

export function InboxPage() {
  const [tab, setTab] = useState<Tab>('messages')

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Inbox"
        description="Contact-form messages from the website and problem reports from the app."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'messages', label: 'Contact messages' },
          { value: 'reports', label: 'Problem reports' },
        ]}
      />
      {tab === 'messages' ? <MessagesTab /> : <ReportsTab />}
    </div>
  )
}

function MessagesTab() {
  const list = useAdminList<AdminMessage>('messages', adminEndpoints.messages)
  const [pendingDelete, setPendingDelete] = useState<AdminMessage | null>(null)

  const patch = useAdminMutation(
    ({ id, status }: { id: number; status: string }) => put(adminEndpoints.message(id), { status }),
    'Could not update the message',
  )

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.message(id)),
    'Could not delete the message',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminMessage>> = [
    {
      key: 'from',
      header: 'From',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate font-medium">{row.name}</p>
          <p className="text-grocery-300 truncate text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'message',
      header: 'Message',
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="text-grocery-900 truncate">{row.subject}</p>
          <p className="text-grocery-500 truncate text-xs">{row.message}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <FilterSelect
          label="Message status"
          value={row.status}
          onChange={(status) => patch.mutate({ id: row.id, status })}
          options={MESSAGE_STATUSES.map((status) => ({ value: status, label: humanize(status) }))}
          className="h-8"
        />
      ),
    },
    { key: 'received', header: 'Received', render: (row) => formatDateTime(row.created_at) },
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search name, email or subject…">
        <FilterSelect
          label="Status"
          value={String(list.filters.status ?? '')}
          onChange={(value) => list.setFilter('status', value || undefined)}
          options={[
            { value: '', label: 'All messages' },
            ...MESSAGE_STATUSES.map((status) => ({ value: status, label: humanize(status) })),
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No messages match this filter."
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete message"
        description="This message will be removed permanently."
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

function ReportsTab() {
  const list = useAdminList<AdminReport>('reports', adminEndpoints.reports)
  const [pendingDelete, setPendingDelete] = useState<AdminReport | null>(null)

  const patch = useAdminMutation(
    ({ id, status }: { id: number; status: string }) => put(adminEndpoints.report(id), { status }),
    'Could not update the report',
  )

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.report(id)),
    'Could not delete the report',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminReport>> = [
    { key: 'issue', header: 'Issue', render: (row) => humanize(row.issue_type) },
    {
      key: 'message',
      header: 'Details',
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="text-grocery-900 truncate">{row.message}</p>
          {row.order_number ? (
            <p className="text-grocery-300 truncate text-xs">Order {row.order_number}</p>
          ) : null}
        </div>
      ),
    },
    {
      key: 'user',
      header: 'Reported by',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate">{row.user?.name ?? '—'}</p>
          <p className="text-grocery-300 truncate text-xs">{row.user?.email ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={row.status} />
          <FilterSelect
            label="Report status"
            value={row.status}
            onChange={(status) => patch.mutate({ id: row.id, status })}
            options={REPORT_STATUSES.map((status) => ({ value: status, label: humanize(status) }))}
            className="h-8"
          />
        </div>
      ),
    },
    { key: 'received', header: 'Received', render: (row) => formatDateTime(row.created_at) },
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search reports…">
        <FilterSelect
          label="Status"
          value={String(list.filters.status ?? '')}
          onChange={(value) => list.setFilter('status', value || undefined)}
          options={[
            { value: '', label: 'All reports' },
            ...REPORT_STATUSES.map((status) => ({ value: status, label: humanize(status) })),
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No reports match this filter."
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete report"
        description="This report will be removed permanently."
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}
