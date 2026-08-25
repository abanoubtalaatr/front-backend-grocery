import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Select, Switch, TextArea, TextInput } from '@/components/admin/FormFields'
import { FormModal } from '@/components/admin/FormModal'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge, humanize } from '@/components/admin/StatusBadge'
import { FilterSelect, Toolbar } from '@/components/admin/Toolbar'
import { Button } from '@/components/ui/Button'
import { adminEndpoints, del, post, put } from '@/features/admin/adminApi'
import { formatCurrency, formatDate, useCurrencySymbol } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import { OFFER_TYPES, type AdminOffer, type OfferType } from '@/features/admin/types'

/** BOGO and free shipping carry no amount, so the value field is hidden for them. */
const TYPES_WITH_VALUE: OfferType[] = ['percentage', 'fixed']

export function OffersPage() {
  const currency = useCurrencySymbol()
  const list = useAdminList<AdminOffer>('offers', adminEndpoints.offers, {
    sort: 'end_date',
    direction: 'desc',
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminOffer | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminOffer | null>(null)

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.offer(id)),
    'Could not delete the offer',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminOffer>> = [
    {
      key: 'offer',
      header: 'Offer',
      sortKey: 'title',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate font-medium">{row.title}</p>
          <p className="text-grocery-300 font-mono text-xs">{row.code}</p>
        </div>
      ),
    },
    { key: 'type', header: 'Type', render: (row) => humanize(row.type) },
    {
      key: 'value',
      header: 'Value',
      className: 'tabular-nums',
      render: (row) => {
        if (row.type === 'percentage') {
          return `${row.discount_value ?? 0}%`
        }
        if (row.type === 'fixed') {
          return formatCurrency(row.discount_value ?? 0, currency)
        }
        return '—'
      },
    },
    {
      key: 'window',
      header: 'Runs',
      sortKey: 'end_date',
      render: (row) => (
        <span className="whitespace-nowrap">
          {formatDate(row.start_date)} → {formatDate(row.end_date)}
        </span>
      ),
    },
    {
      key: 'usage',
      header: 'Used',
      sortKey: 'used_count',
      className: 'tabular-nums',
      render: (row) => `${row.used_count}${row.usage_limit ? ` / ${row.usage_limit}` : ''}`,
    },
    { key: 'active', header: 'Status', render: (row) => <BoolBadge value={row.is_active} trueLabel="Active" falseLabel="Off" /> },
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
      <PageHeader
        title="Offers"
        description="Promo codes customers can apply at checkout."
        actions={
          <Button
            className="w-auto"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus className="h-4 w-4" aria-hidden />
            New offer
          </Button>
        }
      />

      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search by title or code…">
        <FilterSelect
          label="Type"
          value={String(list.filters.type ?? '')}
          onChange={(value) => list.setFilter('type', value || undefined)}
          options={[
            { value: '', label: 'All types' },
            ...OFFER_TYPES.map((type) => ({ value: type, label: humanize(type) })),
          ]}
        />
        <FilterSelect
          label="Status"
          value={String(list.filters.is_active ?? '')}
          onChange={(value) => list.setFilter('is_active', value || undefined)}
          options={[
            { value: '', label: 'All offers' },
            { value: '1', label: 'Active' },
            { value: '0', label: 'Disabled' },
          ]}
        />
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No offers match this filter."
        sort={{ key: list.filters.sort as string, direction: list.filters.direction as 'asc' | 'desc' }}
        onSortChange={list.setSort}
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <OfferForm open={formOpen} offer={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete offer"
        description={`“${pendingDelete?.title ?? ''}” will stop working at checkout immediately.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

type OfferFormState = {
  title: string
  code: string
  description: string
  type: OfferType
  discount_value: string
  minimum_purchase: string
  start_date: string
  end_date: string
  usage_limit: string
  is_active: boolean
  is_featured: boolean
}

const emptyOffer: OfferFormState = {
  title: '',
  code: '',
  description: '',
  type: 'percentage',
  discount_value: '',
  minimum_purchase: '',
  start_date: '',
  end_date: '',
  usage_limit: '',
  is_active: true,
  is_featured: false,
}

function OfferForm({
  open,
  offer,
  onOpenChange,
}: {
  open: boolean
  offer: AdminOffer | null
  onOpenChange: (open: boolean) => void
}) {
  const [form, setForm] = useState<OfferFormState>(emptyOffer)

  useEffect(() => {
    if (!open) {
      return
    }
    setForm(
      offer
        ? {
            title: offer.title,
            code: offer.code,
            description: offer.description ?? '',
            type: offer.type,
            discount_value: offer.discount_value != null ? String(offer.discount_value) : '',
            minimum_purchase: offer.minimum_purchase != null ? String(offer.minimum_purchase) : '',
            start_date: offer.start_date.slice(0, 10),
            end_date: offer.end_date.slice(0, 10),
            usage_limit: offer.usage_limit != null ? String(offer.usage_limit) : '',
            is_active: offer.is_active,
            is_featured: offer.is_featured,
          }
        : emptyOffer,
    )
  }, [open, offer])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      offer ? put(adminEndpoints.offer(offer.id), values) : post(adminEndpoints.offers, values),
    offer ? 'Could not update the offer' : 'Could not create the offer',
    { onSuccess: () => onOpenChange(false) },
  )

  function set<K extends keyof OfferFormState>(key: K, value: OfferFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const showValue = TYPES_WITH_VALUE.includes(form.type)

  return (
    <FormModal
      open={open}
      title={offer ? `Edit ${offer.title}` : 'New offer'}
      submitLabel={offer ? 'Save changes' : 'Create offer'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        mutation.mutate({
          title: form.title,
          code: form.code,
          description: form.description || null,
          type: form.type,
          discount_value: showValue && form.discount_value ? Number(form.discount_value) : null,
          minimum_purchase: form.minimum_purchase ? Number(form.minimum_purchase) : null,
          start_date: form.start_date,
          end_date: form.end_date,
          usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
          is_active: form.is_active,
          is_featured: form.is_featured,
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Title" value={form.title} required onChange={(event) => set('title', event.target.value)} />
        <TextInput
          label="Code"
          value={form.code}
          required
          hint="Stored uppercase; customers type this at checkout."
          onChange={(event) => set('code', event.target.value.toUpperCase())}
        />
        <TextArea
          label="Description"
          wrapperClassName="sm:col-span-2"
          value={form.description}
          onChange={(event) => set('description', event.target.value)}
        />
        <Select
          label="Type"
          value={form.type}
          options={OFFER_TYPES.map((type) => ({ value: type, label: humanize(type) }))}
          onChange={(event) => set('type', event.target.value as OfferType)}
        />
        {showValue ? (
          <TextInput
            label={form.type === 'percentage' ? 'Discount (%)' : 'Discount amount'}
            type="number"
            min="0"
            step="0.01"
            value={form.discount_value}
            onChange={(event) => set('discount_value', event.target.value)}
          />
        ) : (
          <div aria-hidden />
        )}
        <TextInput
          label="Minimum purchase"
          type="number"
          min="0"
          step="0.01"
          value={form.minimum_purchase}
          onChange={(event) => set('minimum_purchase', event.target.value)}
        />
        <TextInput
          label="Usage limit"
          type="number"
          min="1"
          hint="Leave empty for unlimited."
          value={form.usage_limit}
          onChange={(event) => set('usage_limit', event.target.value)}
        />
        <TextInput
          label="Starts"
          type="date"
          required
          value={form.start_date}
          onChange={(event) => set('start_date', event.target.value)}
        />
        <TextInput
          label="Ends"
          type="date"
          required
          value={form.end_date}
          onChange={(event) => set('end_date', event.target.value)}
        />
        <Switch label="Active" description="Accepted at checkout" checked={form.is_active} onChange={(value) => set('is_active', value)} />
        <Switch
          label="Featured"
          description="Shown in the offers strip"
          checked={form.is_featured}
          onChange={(value) => set('is_featured', value)}
        />
      </div>
    </FormModal>
  )
}
