import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { ImageInput, Select, Switch, TextArea, TextInput } from '@/components/admin/FormFields'
import { FormModal } from '@/components/admin/FormModal'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge } from '@/components/admin/StatusBadge'
import { Tabs } from '@/components/admin/Tabs'
import { Toolbar } from '@/components/admin/Toolbar'
import { Button } from '@/components/ui/Button'
import { adminEndpoints, del, getList, sendForm } from '@/features/admin/adminApi'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminCategory, AdminSubcategory } from '@/features/admin/types'

type Tab = 'categories' | 'subcategories'

export function CategoriesPage() {
  const [tab, setTab] = useState<Tab>('categories')

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Categories"
        description="How the catalog is organised on the storefront."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'categories', label: 'Categories' },
          { value: 'subcategories', label: 'Subcategories' },
        ]}
      />
      {tab === 'categories' ? <CategoriesTab /> : <SubcategoriesTab />}
    </div>
  )
}

// ------------------------------------------------------------------ Categories

function CategoriesTab() {
  const list = useAdminList<AdminCategory>('categories', adminEndpoints.categories, {
    sort: 'sort_order',
    direction: 'asc',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminCategory | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminCategory | null>(null)

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.category(id)),
    'Could not delete the category',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminCategory>> = [
    {
      key: 'name',
      header: 'Category',
      sortKey: 'name',
      render: (row) => (
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={row.image_url}
            alt=""
            loading="lazy"
            className="border-line h-10 w-10 shrink-0 rounded-lg border object-cover"
          />
          <div className="min-w-0">
            <p className="text-grocery-900 truncate font-medium">{row.name}</p>
            <p className="text-grocery-300 truncate text-xs">{row.slug}</p>
          </div>
        </div>
      ),
    },
    { key: 'products', header: 'Products', className: 'tabular-nums', render: (row) => row.meals_count ?? 0 },
    {
      key: 'subcategories',
      header: 'Subcategories',
      className: 'tabular-nums',
      render: (row) => row.subcategories_count ?? 0,
    },
    { key: 'order', header: 'Order', sortKey: 'sort_order', className: 'tabular-nums', render: (row) => row.sort_order },
    { key: 'active', header: 'Status', render: (row) => <BoolBadge value={row.is_active} trueLabel="Active" falseLabel="Hidden" /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton
            label="Edit"
            onClick={() => {
              setEditing(row)
              setFormOpen(true)
            }}
          >
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search categories…">
        <Button
          className="w-auto"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New category
        </Button>
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No categories yet."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <CategoryForm open={formOpen} category={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete category"
        description={`“${pendingDelete?.name ?? ''}” will be removed. Categories that still hold products cannot be deleted.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

function CategoryForm({
  open,
  category,
  onOpenChange,
}: {
  open: boolean
  category: AdminCategory | null
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    setName(category?.name ?? '')
    setDescription(category?.description ?? '')
    setSortOrder(String(category?.sort_order ?? 0))
    setIsActive(category?.is_active ?? true)
    setImage(null)
  }, [open, category])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      category
        ? sendForm(adminEndpoints.category(category.id), values, 'put')
        : sendForm(adminEndpoints.categories, values, 'post'),
    category ? 'Could not update the category' : 'Could not create the category',
    { onSuccess: () => onOpenChange(false) },
  )

  return (
    <FormModal
      open={open}
      title={category ? `Edit ${category.name}` : 'New category'}
      submitLabel={category ? 'Save changes' : 'Create category'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        mutation.mutate({
          name,
          description: description || undefined,
          sort_order: sortOrder || '0',
          is_active: isActive,
          image: image ?? undefined,
        })
      }
    >
      <div className="grid gap-4">
        <TextInput label="Name" value={name} required onChange={(event) => setName(event.target.value)} />
        <TextArea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <TextInput
          label="Sort order"
          type="number"
          min="0"
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
        />
        <ImageInput
          label="Image"
          currentUrl={category?.image_url ?? null}
          hint="Leave empty to keep the current image."
          onChange={setImage}
        />
        <Switch label="Active" description="Visible on the storefront" checked={isActive} onChange={setIsActive} />
      </div>
    </FormModal>
  )
}

// --------------------------------------------------------------- Subcategories

function SubcategoriesTab() {
  const list = useAdminList<AdminSubcategory>('subcategories', adminEndpoints.subcategories, {
    sort: 'order',
    direction: 'asc',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminSubcategory | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminSubcategory | null>(null)

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.subcategory(id)),
    'Could not delete the subcategory',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminSubcategory>> = [
    {
      key: 'name',
      header: 'Subcategory',
      sortKey: 'name',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate font-medium">{row.name}</p>
          <p className="text-grocery-300 truncate text-xs">{row.slug}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => row.category?.name ?? '—' },
    { key: 'products', header: 'Products', className: 'tabular-nums', render: (row) => row.meals_count ?? 0 },
    { key: 'order', header: 'Order', sortKey: 'order', className: 'tabular-nums', render: (row) => row.order },
    { key: 'active', header: 'Status', render: (row) => <BoolBadge value={row.is_active} trueLabel="Active" falseLabel="Hidden" /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end gap-1">
          <IconButton
            label="Edit"
            onClick={() => {
              setEditing(row)
              setFormOpen(true)
            }}
          >
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search subcategories…">
        <Button
          className="w-auto"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New subcategory
        </Button>
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No subcategories yet."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <SubcategoryForm open={formOpen} subcategory={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete subcategory"
        description={`“${pendingDelete?.name ?? ''}” will be removed. Subcategories that still hold products cannot be deleted.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

function SubcategoryForm({
  open,
  subcategory,
  onOpenChange,
}: {
  open: boolean
  subcategory: AdminSubcategory | null
  onOpenChange: (open: boolean) => void
}) {
  const [categoryId, setCategoryId] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [image, setImage] = useState<File | null>(null)

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories', 'all'],
    queryFn: () => getList<AdminCategory>(adminEndpoints.categories, { all: true }),
    staleTime: 5 * 60_000,
  })

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Select a category' },
      ...(categoriesQuery.data?.rows ?? []).map((row) => ({ value: String(row.id), label: row.name })),
    ],
    [categoriesQuery.data],
  )

  useEffect(() => {
    if (!open) {
      return
    }
    setCategoryId(subcategory ? String(subcategory.category_id) : '')
    setName(subcategory?.name ?? '')
    setDescription(subcategory?.description ?? '')
    setOrder(String(subcategory?.order ?? 0))
    setIsActive(subcategory?.is_active ?? true)
    setImage(null)
  }, [open, subcategory])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      subcategory
        ? sendForm(adminEndpoints.subcategory(subcategory.id), values, 'put')
        : sendForm(adminEndpoints.subcategories, values, 'post'),
    subcategory ? 'Could not update the subcategory' : 'Could not create the subcategory',
    { onSuccess: () => onOpenChange(false) },
  )

  return (
    <FormModal
      open={open}
      title={subcategory ? `Edit ${subcategory.name}` : 'New subcategory'}
      submitLabel={subcategory ? 'Save changes' : 'Create subcategory'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        mutation.mutate({
          category_id: categoryId,
          name,
          description: description || undefined,
          order: order || '0',
          is_active: isActive,
          image_url: image ?? undefined,
        })
      }
    >
      <div className="grid gap-4">
        <Select
          label="Category"
          value={categoryId}
          required
          options={categoryOptions}
          onChange={(event) => setCategoryId(event.target.value)}
        />
        <TextInput label="Name" value={name} required onChange={(event) => setName(event.target.value)} />
        <TextArea label="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
        <TextInput
          label="Order"
          type="number"
          min="0"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        />
        <ImageInput
          label="Image"
          currentUrl={subcategory?.image_url ?? null}
          hint="Leave empty to keep the current image."
          onChange={setImage}
        />
        <Switch label="Active" description="Visible on the storefront" checked={isActive} onChange={setIsActive} />
      </div>
    </FormModal>
  )
}
