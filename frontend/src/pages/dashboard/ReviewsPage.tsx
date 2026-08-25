import { useState } from 'react'
import { Check, Star, Trash2, X } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge } from '@/components/admin/StatusBadge'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { adminEndpoints, del, put } from '@/features/admin/adminApi'
import { formatDate } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminReview } from '@/features/admin/types'

function mealTitle(meal: AdminReview['meal']): string {
  if (!meal) {
    return '—'
  }
  return 'title' in meal ? meal.title : meal.name
}

export function ReviewsPage() {
  const list = useAdminList<AdminReview>('reviews', adminEndpoints.reviews, {
    sort: 'created_at',
    direction: 'desc',
  })
  const [pendingDelete, setPendingDelete] = useState<AdminReview | null>(null)

  const setApproval = useAdminMutation(
    ({ id, approved }: { id: number; approved: boolean }) =>
      put(adminEndpoints.reviewApproval(id), { is_approved: approved }),
    'Could not update the review',
  )

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.review(id)),
    'Could not delete the review',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminReview>> = [
    {
      key: 'rating',
      header: 'Rating',
      sortKey: 'rating',
      render: (row) => (
        <span className="text-warning-700 flex items-center gap-1 tabular-nums" aria-label={`${row.rating} out of 5`}>
          <Star className="h-4 w-4 fill-current" aria-hidden />
          {row.rating}
        </span>
      ),
    },
    {
      key: 'comment',
      header: 'Review',
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="text-grocery-900 truncate">{row.comment || '— no comment —'}</p>
          <p className="text-grocery-300 truncate text-xs">on {mealTitle(row.meal)}</p>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate">{row.user?.name ?? '—'}</p>
          <p className="text-grocery-300 truncate text-xs">{row.user?.email ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'approved',
      header: 'Status',
      render: (row) => <BoolBadge value={row.is_approved} trueLabel="Published" falseLabel="Pending" />,
    },
    { key: 'created', header: 'Left', sortKey: 'created_at', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          {row.is_approved ? (
            <IconButton
              label="Unpublish"
              onClick={() => setApproval.mutate({ id: row.id, approved: false })}
            >
              <X className="h-4 w-4" aria-hidden />
            </IconButton>
          ) : (
            <IconButton
              label="Publish"
              onClick={() => setApproval.mutate({ id: row.id, approved: true })}
            >
              <Check className="h-4 w-4" aria-hidden />
            </IconButton>
          )}
          <IconButton label="Delete" tone="danger" onClick={() => setPendingDelete(row)}>
            <Trash2 className="h-4 w-4" aria-hidden />
          </IconButton>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Reviews"
        description="Reviews stay hidden on the storefront until they are published here."
      />

      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search review text…">
        <FilterSelect
          label="Approval"
          value={String(list.filters.is_approved ?? '')}
          onChange={(value) => list.setFilter('is_approved', value || undefined)}
          options={[
            { value: '', label: 'All reviews' },
            { value: '0', label: 'Pending' },
            { value: '1', label: 'Published' },
          ]}
        />
        <FilterSelect
          label="Rating"
          value={String(list.filters.rating ?? '')}
          onChange={(value) => list.setFilter('rating', value || undefined)}
          options={[
            { value: '', label: 'Any rating' },
            ...[5, 4, 3, 2, 1].map((rating) => ({ value: String(rating), label: `${rating} star` })),
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No reviews match this filter."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete review"
        description="This review will be removed permanently."
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}
