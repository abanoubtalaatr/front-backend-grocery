import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { Switch, TextArea, TextInput } from '@/components/admin/FormFields'
import { FormModal } from '@/components/admin/FormModal'
import { IconButton } from '@/components/admin/IconButton'
import { PageHeader } from '@/components/admin/PageHeader'
import { Pagination } from '@/components/admin/Pagination'
import { BoolBadge } from '@/components/admin/StatusBadge'
import { Tabs } from '@/components/admin/Tabs'
import { Toolbar } from '@/components/admin/Toolbar'
import { Button } from '@/components/ui/Button'
import { adminEndpoints, del, post, put } from '@/features/admin/adminApi'
import { formatDate } from '@/features/admin/format'
import { useAdminList, useAdminMutation } from '@/features/admin/hooks'
import type { AdminFaq, AdminPage } from '@/features/admin/types'

type Tab = 'faqs' | 'pages'

export function ContentPage() {
  const [tab, setTab] = useState<Tab>('faqs')

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Content"
        description="Help-centre answers and the static pages linked from the footer."
      />
      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: 'faqs', label: 'FAQs' },
          { value: 'pages', label: 'Pages' },
        ]}
      />
      {tab === 'faqs' ? <FaqsTab /> : <PagesTab />}
    </div>
  )
}

function FaqsTab() {
  const list = useAdminList<AdminFaq>('faqs', adminEndpoints.faqs)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminFaq | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminFaq | null>(null)

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.faq(id)),
    'Could not delete the FAQ',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminFaq>> = [
    {
      key: 'question',
      header: 'Question',
      render: (row) => (
        <div className="min-w-0 max-w-lg">
          <p className="text-grocery-900 truncate font-medium">{row.question}</p>
          <p className="text-grocery-500 truncate text-xs">{row.answer}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => row.category || '—' },
    { key: 'order', header: 'Order', className: 'tabular-nums', render: (row) => row.order },
    { key: 'active', header: 'Status', render: (row) => <BoolBadge value={row.is_active} trueLabel="Live" falseLabel="Hidden" /> },
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search questions…">
        <Button
          className="w-auto"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New FAQ
        </Button>
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No FAQs yet."
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <FaqForm open={formOpen} faq={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete FAQ"
        description="This answer will disappear from the help centre."
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

function FaqForm({
  open,
  faq,
  onOpenChange,
}: {
  open: boolean
  faq: AdminFaq | null
  onOpenChange: (open: boolean) => void
}) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [category, setCategory] = useState('')
  const [order, setOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    if (!open) {
      return
    }
    setQuestion(faq?.question ?? '')
    setAnswer(faq?.answer ?? '')
    setCategory(faq?.category ?? '')
    setOrder(String(faq?.order ?? 0))
    setIsActive(faq?.is_active ?? true)
  }, [open, faq])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      faq ? put(adminEndpoints.faq(faq.id), values) : post(adminEndpoints.faqs, values),
    faq ? 'Could not update the FAQ' : 'Could not create the FAQ',
    { onSuccess: () => onOpenChange(false) },
  )

  return (
    <FormModal
      open={open}
      title={faq ? 'Edit FAQ' : 'New FAQ'}
      submitLabel={faq ? 'Save changes' : 'Create FAQ'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        mutation.mutate({
          question,
          answer,
          category: category || null,
          order: Number(order) || 0,
          is_active: isActive,
        })
      }
    >
      <div className="grid gap-4">
        <TextInput label="Question" value={question} required onChange={(event) => setQuestion(event.target.value)} />
        <TextArea label="Answer" value={answer} required rows={5} onChange={(event) => setAnswer(event.target.value)} />
        <TextInput label="Category" value={category} onChange={(event) => setCategory(event.target.value)} />
        <TextInput
          label="Order"
          type="number"
          min="0"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        />
        <Switch label="Live" description="Shown in the help centre" checked={isActive} onChange={setIsActive} />
      </div>
    </FormModal>
  )
}

function PagesTab() {
  const list = useAdminList<AdminPage>('pages', adminEndpoints.pages)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminPage | null>(null)
  const [pendingDelete, setPendingDelete] = useState<AdminPage | null>(null)

  const remove = useAdminMutation(
    (id: number) => del(adminEndpoints.page(id)),
    'Could not delete the page',
    { onSuccess: () => setPendingDelete(null) },
  )

  const columns: Array<Column<AdminPage>> = [
    {
      key: 'title',
      header: 'Page',
      render: (row) => (
        <div className="min-w-0">
          <p className="text-grocery-900 truncate font-medium">{row.title}</p>
          <p className="text-grocery-300 truncate text-xs">/{row.slug}</p>
        </div>
      ),
    },
    { key: 'order', header: 'Order', className: 'tabular-nums', render: (row) => row.order },
    {
      key: 'published',
      header: 'Status',
      render: (row) => <BoolBadge value={row.is_published} trueLabel="Published" falseLabel="Draft" />,
    },
    { key: 'created', header: 'Created', render: (row) => formatDate(row.created_at) },
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
      <Toolbar search={list.search} onSearchChange={list.setSearch} placeholder="Search pages…">
        <Button
          className="w-auto"
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New page
        </Button>
      </Toolbar>

      <DataTable
        rows={list.query.data?.rows ?? []}
        columns={columns}
        getRowKey={(row) => row.id}
        isLoading={list.query.isPending}
        isError={list.query.isError}
        emptyMessage="No pages yet."
      />

      <Pagination meta={list.query.data?.meta} onPageChange={list.setPage} />

      <PageForm open={formOpen} page={editing} onOpenChange={setFormOpen} />

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete page"
        description={`“${pendingDelete?.title ?? ''}” will be removed from the site.`}
        loading={remove.isPending}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete.id)}
      />
    </div>
  )
}

function PageForm({
  open,
  page,
  onOpenChange,
}: {
  open: boolean
  page: AdminPage | null
  onOpenChange: (open: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [order, setOrder] = useState('0')
  const [isPublished, setIsPublished] = useState(true)

  useEffect(() => {
    if (!open) {
      return
    }
    setTitle(page?.title ?? '')
    setSlug(page?.slug ?? '')
    setContent(page?.content ?? '')
    setMetaTitle(page?.meta_title ?? '')
    setMetaDescription(page?.meta_description ?? '')
    setOrder(String(page?.order ?? 0))
    setIsPublished(page?.is_published ?? true)
  }, [open, page])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      page ? put(adminEndpoints.page(page.id), values) : post(adminEndpoints.pages, values),
    page ? 'Could not update the page' : 'Could not create the page',
    { onSuccess: () => onOpenChange(false) },
  )

  return (
    <FormModal
      open={open}
      title={page ? `Edit ${page.title}` : 'New page'}
      submitLabel={page ? 'Save changes' : 'Create page'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={() =>
        mutation.mutate({
          title,
          slug: slug || undefined,
          content,
          meta_title: metaTitle || null,
          meta_description: metaDescription || null,
          order: Number(order) || 0,
          is_published: isPublished,
        })
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput label="Title" value={title} required onChange={(event) => setTitle(event.target.value)} />
        <TextInput
          label="Slug"
          value={slug}
          hint="Leave empty to derive it from the title."
          onChange={(event) => setSlug(event.target.value)}
        />
        <TextArea
          label="Content"
          wrapperClassName="sm:col-span-2"
          rows={10}
          value={content}
          required
          onChange={(event) => setContent(event.target.value)}
        />
        <TextInput label="Meta title" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} />
        <TextInput
          label="Order"
          type="number"
          min="0"
          value={order}
          onChange={(event) => setOrder(event.target.value)}
        />
        <TextArea
          label="Meta description"
          wrapperClassName="sm:col-span-2"
          rows={2}
          value={metaDescription}
          onChange={(event) => setMetaDescription(event.target.value)}
        />
        <Switch
          label="Published"
          description="Reachable on the storefront"
          checked={isPublished}
          onChange={setIsPublished}
        />
      </div>
    </FormModal>
  )
}
