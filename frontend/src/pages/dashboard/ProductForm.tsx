import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FormModal } from '@/components/admin/FormModal'
import { ImageInput, Select, Switch, TextArea, TextInput } from '@/components/admin/FormFields'
import { adminEndpoints, getList, sendForm } from '@/features/admin/adminApi'
import { useAdminMutation } from '@/features/admin/hooks'
import type { AdminCategory, AdminProductDetail, AdminSubcategory } from '@/features/admin/types'

type ProductFormProps = {
  open: boolean
  /** `null` opens the form in create mode. */
  product: AdminProductDetail | null
  onOpenChange: (open: boolean) => void
}

type FormState = {
  title: string
  description: string
  category_id: string
  subcategory_id: string
  price: string
  discount_price: string
  offer_title: string
  size: string
  brand: string
  stock_quantity: string
  includes: string
  how_to_use: string
  features: string
  expiry_date: string
  is_available: boolean
  is_featured: boolean
  is_hot: boolean
}

const emptyForm: FormState = {
  title: '',
  description: '',
  category_id: '',
  subcategory_id: '',
  price: '',
  discount_price: '',
  offer_title: '',
  size: '',
  brand: '',
  stock_quantity: '0',
  includes: '',
  how_to_use: '',
  features: '',
  expiry_date: '',
  is_available: true,
  is_featured: false,
  is_hot: false,
}

function toForm(product: AdminProductDetail): FormState {
  return {
    title: product.title,
    description: product.description ?? '',
    category_id: String(product.category_id),
    subcategory_id: product.subcategory_id ? String(product.subcategory_id) : '',
    price: String(product.price),
    discount_price: product.discount_price != null ? String(product.discount_price) : '',
    offer_title: product.offer_title ?? '',
    size: product.size ?? '',
    brand: product.brand ?? '',
    stock_quantity: String(product.stock_quantity ?? 0),
    includes: product.includes ?? '',
    how_to_use: product.how_to_use ?? '',
    features: product.features ?? '',
    expiry_date: product.expiry_date ? product.expiry_date.slice(0, 10) : '',
    is_available: product.is_available,
    is_featured: product.is_featured,
    is_hot: product.is_hot,
  }
}

export function ProductForm({ open, product, onOpenChange }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [image, setImage] = useState<File | null>(null)

  // Re-seed whenever the modal opens so a previous edit never leaks into the next one.
  useEffect(() => {
    if (open) {
      setForm(product ? toForm(product) : emptyForm)
      setImage(null)
    }
  }, [open, product])

  const categoriesQuery = useQuery({
    queryKey: ['admin', 'categories', 'all'],
    queryFn: () => getList<AdminCategory>(adminEndpoints.categories, { all: true }),
    staleTime: 5 * 60_000,
  })

  const subcategoriesQuery = useQuery({
    queryKey: ['admin', 'subcategories', 'all'],
    queryFn: () => getList<AdminSubcategory>(adminEndpoints.subcategories, { all: true }),
    staleTime: 5 * 60_000,
  })

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'Select a category' },
      ...(categoriesQuery.data?.rows ?? []).map((category) => ({
        value: String(category.id),
        label: category.name,
      })),
    ],
    [categoriesQuery.data],
  )

  // Subcategories belong to a category, so the second select follows the first.
  const subcategoryOptions = useMemo(() => {
    const rows = (subcategoriesQuery.data?.rows ?? []).filter(
      (row) => !form.category_id || String(row.category_id) === form.category_id,
    )
    return [
      { value: '', label: 'None' },
      ...rows.map((row) => ({ value: String(row.id), label: row.name })),
    ]
  }, [subcategoriesQuery.data, form.category_id])

  const mutation = useAdminMutation(
    (values: Record<string, unknown>) =>
      product
        ? sendForm<AdminProductDetail>(adminEndpoints.product(product.id), values, 'put')
        : sendForm<AdminProductDetail>(adminEndpoints.products, values, 'post'),
    product ? 'Could not update the product' : 'Could not create the product',
    { onSuccess: () => onOpenChange(false) },
  )

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSubmit() {
    mutation.mutate({
      title: form.title,
      description: form.description,
      category_id: form.category_id,
      subcategory_id: form.subcategory_id || undefined,
      price: form.price,
      discount_price: form.discount_price || undefined,
      offer_title: form.offer_title || undefined,
      size: form.size || undefined,
      brand: form.brand || undefined,
      stock_quantity: form.stock_quantity || '0',
      includes: form.includes || undefined,
      how_to_use: form.how_to_use || undefined,
      features: form.features || undefined,
      expiry_date: form.expiry_date || undefined,
      is_available: form.is_available,
      is_featured: form.is_featured,
      is_hot: form.is_hot,
      image: image ?? undefined,
    })
  }

  return (
    <FormModal
      open={open}
      title={product ? `Edit ${product.title}` : 'New product'}
      submitLabel={product ? 'Save changes' : 'Create product'}
      loading={mutation.isPending}
      onOpenChange={onOpenChange}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Title"
          value={form.title}
          required
          wrapperClassName="sm:col-span-2"
          onChange={(event) => set('title', event.target.value)}
        />

        <TextArea
          label="Description"
          value={form.description}
          required
          wrapperClassName="sm:col-span-2"
          onChange={(event) => set('description', event.target.value)}
        />

        <Select
          label="Category"
          value={form.category_id}
          required
          options={categoryOptions}
          onChange={(event) => {
            set('category_id', event.target.value)
            set('subcategory_id', '')
          }}
        />

        <Select
          label="Subcategory"
          value={form.subcategory_id}
          options={subcategoryOptions}
          onChange={(event) => set('subcategory_id', event.target.value)}
        />

        <TextInput
          label="Price"
          type="number"
          min="0"
          step="0.01"
          required
          value={form.price}
          onChange={(event) => set('price', event.target.value)}
        />

        <TextInput
          label="Discount price"
          type="number"
          min="0"
          step="0.01"
          hint="Must be lower than the price."
          value={form.discount_price}
          onChange={(event) => set('discount_price', event.target.value)}
        />

        <TextInput
          label="Stock quantity"
          type="number"
          min="0"
          value={form.stock_quantity}
          onChange={(event) => set('stock_quantity', event.target.value)}
        />

        <TextInput
          label="Brand"
          value={form.brand}
          onChange={(event) => set('brand', event.target.value)}
        />

        <TextInput
          label="Size"
          hint="e.g. 500g, 1kg, 2L"
          value={form.size}
          onChange={(event) => set('size', event.target.value)}
        />

        <TextInput
          label="Expiry date"
          type="date"
          value={form.expiry_date}
          onChange={(event) => set('expiry_date', event.target.value)}
        />

        <TextInput
          label="Offer title"
          wrapperClassName="sm:col-span-2"
          value={form.offer_title}
          onChange={(event) => set('offer_title', event.target.value)}
        />

        <TextArea
          label="Includes"
          rows={2}
          value={form.includes}
          onChange={(event) => set('includes', event.target.value)}
        />

        <TextArea
          label="How to use"
          rows={2}
          value={form.how_to_use}
          onChange={(event) => set('how_to_use', event.target.value)}
        />

        <TextArea
          label="Features"
          rows={2}
          wrapperClassName="sm:col-span-2"
          value={form.features}
          onChange={(event) => set('features', event.target.value)}
        />

        <div className="sm:col-span-2">
          <ImageInput
            label="Product image"
            currentUrl={product?.image_url ?? null}
            hint={product ? 'Leave empty to keep the current image.' : 'Required for new products.'}
            onChange={setImage}
          />
        </div>

        <Switch
          label="Available"
          description="Shown and orderable in the store"
          checked={form.is_available}
          onChange={(value) => set('is_available', value)}
        />
        <Switch
          label="Featured"
          description="Highlighted on the home page"
          checked={form.is_featured}
          onChange={(value) => set('is_featured', value)}
        />
        <Switch
          label="Hot meal"
          description="Appears in the ready-to-eat feed"
          checked={form.is_hot}
          onChange={(value) => set('is_hot', value)}
        />
      </div>
    </FormModal>
  )
}
