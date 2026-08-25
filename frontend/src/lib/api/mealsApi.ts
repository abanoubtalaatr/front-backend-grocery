import axios from 'axios'
import { env } from '@/config/env'
import { getErrorMessageFromBody } from '@/lib/auth/parseApiResponse'
import { ApiError } from '@/lib/api/apiError'
import { apiClient } from '@/lib/api/httpClient'

export type HotMeal = {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  categoryLabel: string
  vendorLabel: string
  rating: number
  ratingCount: number
  price: number | null
  compareAtPrice: number | null
}

type JsonRecord = Record<string, unknown>

function asRecord(x: unknown): JsonRecord | null {
  if (x != null && typeof x === 'object' && !Array.isArray(x)) {
    return x as JsonRecord
  }
  return null
}

function pickString(o: JsonRecord, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) {
      return v.trim()
    }
  }
  return undefined
}

function pickNumber(o: JsonRecord, keys: string[]): number | undefined {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v)) {
      return v
    }
    if (typeof v === 'string' && v.trim()) {
      const n = Number(v.replace(/,/g, ''))
      if (Number.isFinite(n)) {
        return n
      }
    }
  }
  return undefined
}

function categoryLabelFrom(row: JsonRecord): string {
  const c = row.category
  const cat = asRecord(c)
  if (cat) {
    const name = pickString(cat, ['name', 'title', 'label'])
    if (name) {
      return name
    }
  }
  if (typeof c === 'string' && c.trim()) {
    return c.trim()
  }
  const flat = pickString(row, ['category_name', 'categoryName'])
  return flat ?? 'Groceries'
}

function vendorLabelFrom(row: JsonRecord): string {
  const v = row.vendor ?? row.shop ?? row.store
  const rec = asRecord(v)
  if (rec) {
    const name = pickString(rec, ['name', 'title', 'business_name'])
    if (name) {
      return name
    }
  }
  const by = pickString(row, ['vendor_name', 'seller_name', 'by'])
  if (by) {
    return by.startsWith('By ') ? by : `By ${by}`
  }
  return 'By Grocery+'
}

function resolveImageUrl(raw: string | undefined): string | null {
  if (!raw || !raw.trim()) {
    return null
  }
  const u = raw.trim()
  if (u.startsWith('http://') || u.startsWith('https://')) {
    return u
  }
  const path = u.startsWith('/') ? u : `/${u}`
  return `${env.apiBaseUrl}${path}`
}

function normalizeHotMeal(row: unknown, index: number): HotMeal | null {
  const o = asRecord(row)
  if (!o) {
    return null
  }
  const idRaw = o.id ?? o.meal_id ?? o.uuid ?? index
  const id = String(idRaw)

  const name =
    pickString(o, ['name', 'title', 'meal_name', 'product_name']) ?? `Item ${id}`

  const imageRaw =
    pickString(o, [
      'image',
      'image_url',
      'imageUrl',
      'photo',
      'thumbnail',
      'cover',
      'picture',
    ]) ?? null

  const rating =
    pickNumber(o, ['rating', 'avg_rating', 'average_rating', 'stars']) ?? 0

  const ratingCount =
    pickNumber(o, ['rating_count', 'ratingCount', 'reviews', 'reviews_count']) ?? 0

  const price =
    pickNumber(o, ['price', 'sale_price', 'current_price', 'amount']) ?? null

  const compareAtPrice =
    pickNumber(o, [
      'compare_at_price',
      'original_price',
      'old_price',
      'was_price',
      'list_price',
    ]) ?? null

  const description =
    pickString(o, ['description', 'desc', 'details', 'summary', 'body', 'about']) ?? null

  return {
    id,
    name,
    description,
    imageUrl: imageRaw ? resolveImageUrl(imageRaw) : null,
    categoryLabel: categoryLabelFrom(o),
    vendorLabel: vendorLabelFrom(o),
    rating: Math.min(5, Math.max(0, rating)),
    ratingCount: Math.max(0, Math.floor(ratingCount)),
    price,
    compareAtPrice,
  }
}

async function getCatalogJson(
  endpoint: string,
  notFoundFallback: string,
  generalFallback: string,
): Promise<unknown> {
  try {
    const res = await apiClient.get<unknown>(endpoint)
    return res.data
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status
      const raw = err.response.data ?? {}
      const message = getErrorMessageFromBody(
        raw,
        status === 404 ? notFoundFallback : generalFallback,
      )
      throw new ApiError(message, status, raw)
    }
    throw err
  }
}

export async function fetchHotMeals(): Promise<HotMeal[]> {
  const raw = await getCatalogJson(
    '/api/meals/hot',
    'Hot deals are not available right now.',
    'Could not load hot deals. Try again shortly.',
  )

  const body = asRecord(raw)
  let list: unknown = body?.data
  if (!Array.isArray(list) && Array.isArray(raw)) {
    list = raw
  }
  if (!Array.isArray(list)) {
    return []
  }

  const out: HotMeal[] = []
  list.forEach((item, i) => {
    const m = normalizeHotMeal(item, i)
    if (m) {
      out.push(m)
    }
  })
  return out
}

export type CatalogProduct = HotMeal

async function fetchProductsFromEndpoint(
  endpoint: string,
  notFoundFallback: string,
  generalFallback: string,
): Promise<CatalogProduct[]> {
  const raw = await getCatalogJson(endpoint, notFoundFallback, generalFallback)

  const body = asRecord(raw)
  let list: unknown = body?.data
  if (!Array.isArray(list) && Array.isArray(raw)) {
    list = raw
  }
  if (!Array.isArray(list)) {
    return []
  }

  const out: CatalogProduct[] = []
  list.forEach((item, i) => {
    const normalized = normalizeHotMeal(item, i)
    if (normalized) {
      out.push(normalized)
    }
  })
  return out
}

export function fetchNewProducts(): Promise<CatalogProduct[]> {
  return fetchProductsFromEndpoint(
    '/api/new-products',
    'New products are not available right now.',
    'Could not load new products. Try again shortly.',
  )
}

export function fetchBestSells(): Promise<CatalogProduct[]> {
  return fetchProductsFromEndpoint(
    '/api/best-sells',
    'Best sells are not available right now.',
    'Could not load best sells. Try again shortly.',
  )
}
