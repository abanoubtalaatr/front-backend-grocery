import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge } from '@/components/admin/StatusBadge'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { Button } from '@/components/ui/Button'
import { adminEndpoints, del, getOne, post } from '@/features/admin/adminApi'
import { formatCurrency, formatDate, useCurrencySymbol } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminProduct, AdminProductDetail } from '@/features/admin/types'
import { ProductForm } from './ProductForm'

export function ProductsPage() {
  const [searchParams] = useSearchParams()
  const currency = useCurrencySymbol()

  const list = useAdminList<AdminProduct>('products', adminEndpoints.products, {
    sort: 'created_at',
    direction: 'desc',
    // The overview's "low stock" card deep-links here with the filter pre-applied.
    low_stock: searchParams.get('low_stock') === '1' ? true : undefined,
  })

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminProductDetail | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const loadForEdit = useAdminMutation(
    (id: number) => getOne<AdminProductDetail>(adminEndpoints.product(id)),
    'Could not open the product',
    {
      onSuccess: (product) => {
        setEditing(product)
        setFormOpen(true)
      },
    },
  )

  const toggleFlag = useAdminMutation(
    ({ id, field }: { id: number; field: 'is_available' | 'is_featured' }) =>
      post(adminEndpoints.productToggle(id), { field }),
    'Could not update the product',
  )

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.product(id)),
    'Could not delete the product',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminProduct>> = [
    {
      key: 'product',
      header: 'Product',
      sortKey: 'title',
      render: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt=""
              loading="lazy"
              className="border-line h-10 w-10 shrink-0 rounded-lg border object-cover"
            />
          ) : (
            <span className="bg-surface-sunken h-10 w-10 shrink-0 rounded-lg" />
          )}
          <div className="min-w-0">
            <p className="text-grocery-900 truncate font-medium">{row.title}</p>
            <p className="text-grocery-300 truncate text-xs">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (row) => (
        <span className="whitespace-nowrap">
          {row.category?.name ?? '—'}
          {row.subcategory ? (
            <span className="text-grocery-300"> / {row.subcategory.name}</span>
          ) : null}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      sortKey: 'price',
      className: 'tabular-nums',
      render: (row) =>
        row.discount_price != null ? (
          <span className="whitespace-nowrap">
            <span className="text-grocery-900 font-medium">
              {formatCurrency(row.discount_price, currency)}
            </span>{' '}
            <span className="text-grocery-300 line-through">
              {formatCurrency(row.price, currency)}
            </span>
          </span>
        ) : (
          formatCurrency(row.price, currency)
        ),
    },
    {
      key: 'stock',
      header: 'Stock',
      sortKey: 'stock_quantity',
      className: 'tabular-nums',
      render: (row) => (
        <span className={row.stock_quantity <= 5 ? 'text-danger-700 font-medium' : undefined}>
          {row.stock_quantity}
        </span>
      ),
    },
    {
      key: 'available',
      header: 'Available',
      render: (row) => (
        <button
          type="button"
          onClick={() => toggleFlag.mutate({ id: row.id, field: 'is_available' })}
          title="Toggle availability"
        >
          <BoolBadge value={row.is_available} trueLabel="Live" falseLabel="Hidden" />
        </button>
      ),
    },
    {
      key: 'featured',
      header: 'Featured',
      render: (row) => (
        <button
          type="button"
          onClick={() => toggleFlag.mutate({ id: row.id, field: 'is_featured' })}
          title="Toggle featured"
        >
          <BoolBadge value={row.is_featured} trueLabel="Featured" falseLabel="—" />
        </button>
      ),
    },
    { key: 'created', header: 'Added', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton label="Edit" onClick={() => loadForEdit.mutate(row.id)}>
            <Pencil className="h-4 w-4" aria-hidden />
          </IconButton>
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
        title="Products"
        description="Everything customers can add to a cart."
        actions={
          <Button className="w-auto" onClick={openCreate}>
            <Plus className="h-4 w-4" aria-hidden />
            New product
          </Button>
        }
      />

      <Toolbar
        search={list.search}
        onSearchChange={list.setSearch}
        placeholder="Search by title, brand or slug…"
      >
        <FilterSelect
          label="Availability"
          value={String(list.filters.is_available ?? '')}
          onChange={(value) => list.setFilter('is_available', value === '' ? undefined : value)}
          options={[
            { value: '', label: 'All products' },
            { value: '1', label: 'Live only' },
            { value: '0', label: 'Hidden only' },
          ]}
        />
        <FilterSelect
          label="Stock"
          value={list.filters.low_stock ? '1' : ''}
          onChange={(value) => list.setFilter('low_stock', value === '1' ? true : undefined)}
          options={[
            { value: '', label: 'Any stock' },
            { value: '1', label: 'Low stock (≤ 5)' },
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No products match this filter."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <ProductForm open={formOpen} product={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete product"
        description={`“${pendingDelete?.title ?? ''}” will be removed from the store. Existing orders keep their history.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}
