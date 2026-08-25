import { useEffect, useState, type FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Select, Switch, TextArea, TextInput } from '@/components/admin/FormFields'
import { PageHeader } from '@/components/admin/PageHeader'
import { Button } from '@/components/ui/Button'
import { adminEndpoints, getOne, put } from '@/features/admin/adminApi'
import { useAdminMutation } from '@/features/admin/hooks'
import type { AdminSettings } from '@/features/admin/types'

/** Every field the settings endpoint accepts, grouped the way the form reads. */
const FIELDS = {
  store: ['site_name', 'site_description', 'copyright_text', 'store_hours'],
  contact: ['email', 'support_email', 'phone', 'support_phone', 'address', 'store_address'],
  social: ['facebook', 'instagram', 'linkedin', 'twitter', 'whatsapp', 'tiktok', 'snapchat', 'youtube'],
  commerce: ['currency_code', 'currency_symbol', 'tax_rate', 'payment_methods', 'shipping_note'],
} as const

const LONG_FIELDS = new Set(['site_description', 'address', 'store_address', 'shipping_note', 'payment_methods'])

function label(field: string) {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function SettingsPage() {
  const [form, setForm] = useState<Record<string, string>>({})
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [storeStatus, setStoreStatus] = useState('open')
  const [locale, setLocale] = useState('en')

  const { data, isPending, isError } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => getOne<AdminSettings>(adminEndpoints.settings),
  })

  useEffect(() => {
    if (!data) {
      return
    }
    const next: Record<string, string> = {}
    for (const group of Object.values(FIELDS)) {
      for (const field of group) {
        const value = data[field]
        next[field] = value == null ? '' : String(value)
      }
    }
    setForm(next)
    setMaintenanceMode(Boolean(data.maintenance_mode))
    setStoreStatus(typeof data.store_status === 'string' ? data.store_status : 'open')
    setLocale(typeof data.locale === 'string' ? data.locale : 'en')
  }, [data])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) => put<AdminSettings>(adminEndpoints.settings, values),
    'Could not save the settings',
  )

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    mutation.mutate({
      ...form,
      // `tax_rate` is numeric server-side; an empty box means "no tax", not "".
      tax_rate: form.tax_rate === '' ? 0 : Number(form.tax_rate),
      maintenance_mode: maintenanceMode,
      store_status: storeStatus,
      locale,
    })
  }

  function set(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  if (isPending) {
    return <p className="text-grocery-500 text-sm">Loading settings…</p>
  }

  if (isError) {
    return <p className="text-danger-700 text-sm">Could not load the store settings.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Store identity, contact details and checkout defaults."
        actions={
          <Button type="submit" className="w-auto" loading={mutation.isPending}>
            Save changes
          </Button>
        }
      />

      <Section title="Storefront">
        <Select
          label="Store status"
          value={storeStatus}
          onChange={(event) => setStoreStatus(event.target.value)}
          options={[
            { value: 'open', label: 'Open' },
            { value: 'closed', label: 'Closed' },
            { value: 'maintenance', label: 'Maintenance' },
          ]}
        />
        <Select
          label="Default language"
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ar', label: 'العربية' },
          ]}
        />
        <div className="sm:col-span-2">
          <Switch
            label="Maintenance mode"
            description="Customers see a maintenance notice instead of the store"
            checked={maintenanceMode}
            onChange={setMaintenanceMode}
          />
        </div>
        {FIELDS.store.map((field) => (
          <Field key={field} field={field} value={form[field] ?? ''} onChange={set} />
        ))}
      </Section>

      <Section title="Contact">
        {FIELDS.contact.map((field) => (
          <Field key={field} field={field} value={form[field] ?? ''} onChange={set} />
        ))}
      </Section>

      <Section title="Commerce">
        {FIELDS.commerce.map((field) => (
          <Field key={field} field={field} value={form[field] ?? ''} onChange={set} />
        ))}
      </Section>

      <Section title="Social">
        {FIELDS.social.map((field) => (
          <Field key={field} field={field} value={form[field] ?? ''} onChange={set} />
        ))}
      </Section>
    </form>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-line bg-surface rounded-2xl border p-5">
      <h2 className="text-grocery-900 mb-4 text-sm font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  )
}

function Field({
  field,
  value,
  onChange,
}: {
  field: string
  value: string
  onChange: (field: string, value: string) => void
}) {
  if (LONG_FIELDS.has(field)) {
    return (
      <TextArea
        label={label(field)}
        wrapperClassName="sm:col-span-2"
        rows={2}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
      />
    )
  }

  return (
    <TextInput
      label={label(field)}
      type={field === 'tax_rate' ? 'number' : 'text'}
      value={value}
      onChange={(event) => onChange(field, event.target.value)}
    />
  )
}
