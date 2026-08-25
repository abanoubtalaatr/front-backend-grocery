import { apiClient } from '@/lib/api/httpClient'
import type { ListParams, PageMeta, Paginated } from './types'

/**
 * Thin transport for the admin API. Every endpoint answers
 * `{ success, message, data, meta? }`, so unwrapping lives here once instead of
 * in every screen.
 */

type Envelope<T> = {
  success: boolean
  message?: string
  data: T
  meta?: PageMeta
}

const EMPTY_META: PageMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 0,
  total: 0,
  from: null,
  to: null,
}

/** Drop empty values so `?search=` never reaches the API as a blank filter. */
function cleanParams(params: ListParams = {}): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue
    }
    out[key] = value
  }
  return out
}

export async function getList<T>(url: string, params?: ListParams): Promise<Paginated<T>> {
  const res = await apiClient.get<Envelope<T[]>>(url, { params: cleanParams(params) })
  return {
    rows: res.data.data ?? [],
    meta: res.data.meta ?? { ...EMPTY_META, total: res.data.data?.length ?? 0 },
  }
}

export async function getOne<T>(url: string, params?: ListParams): Promise<T> {
  const res = await apiClient.get<Envelope<T>>(url, { params: cleanParams(params) })
  return res.data.data
}

export async function post<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiClient.post<Envelope<T>>(url, body)
  return res.data.data
}

export async function put<T>(url: string, body?: unknown): Promise<T> {
  const res = await apiClient.put<Envelope<T>>(url, body)
  return res.data.data
}

export async function del(url: string): Promise<void> {
  await apiClient.delete(url)
}

/**
 * Multipart variant — used by the product and category forms, which may carry a
 * `File`. Laravel does not parse `PUT` multipart bodies, so updates are sent as
 * `POST` with a `_method` override.
 */
export async function sendForm<T>(
  url: string,
  values: Record<string, unknown>,
  method: 'post' | 'put' = 'post',
): Promise<T> {
  const form = new FormData()

  for (const [key, value] of Object.entries(values)) {
    if (value === undefined || value === null) {
      continue
    }
    if (value instanceof File) {
      form.append(key, value)
    } else if (typeof value === 'boolean') {
      form.append(key, value ? '1' : '0')
    } else {
      form.append(key, String(value))
    }
  }

  if (method === 'put') {
    form.append('_method', 'PUT')
  }

  const res = await apiClient.post<Envelope<T>>(url, form)
  return res.data.data
}

/** Endpoint map — keeps URL strings out of the screens. */
export const adminEndpoints = {
  stats: '/api/admin/stats',
  products: '/api/admin/products',
  product: (id: number) => `/api/admin/products/${id}`,
  productToggle: (id: number) => `/api/admin/products/${id}/toggle`,
  categories: '/api/admin/categories',
  category: (id: number) => `/api/admin/categories/${id}`,
  subcategories: '/api/admin/subcategories',
  subcategory: (id: number) => `/api/admin/subcategories/${id}`,
  orders: '/api/admin/orders',
  order: (id: number) => `/api/admin/orders/${id}`,
  orderStatus: (id: number) => `/api/admin/orders/${id}/status`,
  users: '/api/admin/users',
  user: (id: number) => `/api/admin/users/${id}`,
  offers: '/api/admin/offers',
  offer: (id: number) => `/api/admin/offers/${id}`,
  reviews: '/api/admin/reviews',
  reviewApproval: (id: number) => `/api/admin/reviews/${id}/approval`,
  review: (id: number) => `/api/admin/reviews/${id}`,
  messages: '/api/admin/messages',
  message: (id: number) => `/api/admin/messages/${id}`,
  reports: '/api/admin/reports',
  report: (id: number) => `/api/admin/reports/${id}`,
  faqs: '/api/admin/faqs',
  faq: (id: number) => `/api/admin/faqs/${id}`,
  pages: '/api/admin/pages',
  page: (id: number) => `/api/admin/pages/${id}`,
  settings: '/api/admin/settings',
  me: '/api/auth/me',
} as const
