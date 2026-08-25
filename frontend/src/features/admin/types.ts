/** Shared shapes for the `/dashboard` admin API (`backend/routes/api.php`, `admin` prefix). */

export type PageMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export type Paginated<T> = {
  rows: T[]
  meta: PageMeta
}

/** Query string shared by every admin list endpoint. */
export type ListParams = {
  page?: number
  per_page?: number
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
} & Record<string, string | number | boolean | undefined>

export type NamedRef = {
  id: number
  name: string
}

export type AdminProduct = {
  id: number
  title: string
  slug: string
  image_url: string | null
  price: number
  discount_price: number | null
  stock_quantity: number
  sold_count: number
  rating: number
  rating_count: number
  is_available: boolean
  is_featured: boolean
  is_hot: boolean
  category: NamedRef | null
  subcategory: NamedRef | null
  created_at: string
}

export type AdminProductDetail = AdminProduct & {
  description: string
  offer_title: string | null
  size: string | null
  brand: string | null
  includes: string | null
  how_to_use: string | null
  features: string | null
  expiry_date: string | null
  available_date: string | null
  category_id: number
  subcategory_id: number | null
}

export type AdminCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string
  is_active: boolean
  sort_order: number
  meals_count: number | null
  subcategories_count: number | null
  created_at: string
}

export type AdminSubcategory = {
  id: number
  category_id: number
  category: NamedRef | null
  name: string
  slug: string
  description: string | null
  image_url: string | null
  is_active: boolean
  order: number
  meals_count: number | null
  created_at: string
}

export const ORDER_STATUSES = [
  'placed',
  'processing',
  'shipping',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type AdminOrder = {
  id: number
  order_number: string
  status: OrderStatus
  payment_method: string
  delivery_type: string
  subtotal: number
  tax: number
  discount: number
  total: number
  items_count: number
  customer: { id: number; name: string | null; email: string | null; phone: string | null } | null
  created_at: string
}

export type AdminOrderDetail = AdminOrder & {
  notes: string | null
  schedule_delivery: string | null
  delivery_speed: string | null
  address: Record<string, unknown> | null
  timeline: Record<string, string | null>
  items: Array<{
    id: number
    meal_id: number
    title: string | null
    image_url: string | null
    quantity: number
    unit_price: number
    discount_amount: number
    subtotal: number
  }>
}

export type AdminUser = {
  id: number
  username: string
  email: string
  phone: string | null
  country_code: string | null
  avatar: string | null
  is_active: boolean
  is_admin: boolean
  email_verified: boolean
  phone_verified: boolean
  loyalty_points: number
  orders_count: number | null
  orders_total: number | null
  created_at: string
}

export type AdminUserDetail = AdminUser & {
  firstname: string | null
  lastname: string | null
  gender: string | null
  birthday: string | null
  store_credits: number | null
  app_language: string | null
  recent_orders: Array<{
    id: number
    order_number: string
    status: OrderStatus
    total: number
    created_at: string
  }>
}

export const OFFER_TYPES = ['percentage', 'fixed', 'buy_one_get_one', 'free_shipping'] as const

export type OfferType = (typeof OFFER_TYPES)[number]

export type AdminOffer = {
  id: number
  title: string
  code: string
  description: string | null
  type: OfferType
  discount_value: number | null
  minimum_purchase: number | null
  start_date: string
  end_date: string
  usage_limit: number | null
  used_count: number
  is_active: boolean
  is_featured: boolean
  created_at: string
}

export type AdminReview = {
  id: number
  rating: number
  comment: string | null
  is_approved: boolean
  images: string[] | null
  user: { id: number; name: string | null; email: string | null } | null
  meal: NamedRef | { id: number; title: string } | null
  created_at: string
}

export type AdminMessage = {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'spam'
  admin_notes: string | null
  created_at: string
}

export type AdminReport = {
  id: number
  issue_type: string
  order_number: string | null
  message: string
  status: 'new' | 'read' | 'resolved'
  user: { id: number; name: string | null; email: string | null } | null
  created_at: string
}

export type AdminFaq = {
  id: number
  question: string
  answer: string
  category: string | null
  order: number
  is_active: boolean
  created_at: string
}

export type AdminPage = {
  id: number
  slug: string
  title: string
  content: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  is_published: boolean
  order: number
  created_at: string
}

export type AdminSettings = Record<string, string | number | boolean | null>

export type AdminStats = {
  range: { days: number; from: string; to: string }
  totals: {
    revenue: number
    revenue_change: number | null
    orders: number
    orders_change: number | null
    customers: number
    customers_change: number | null
    average_order_value: number
    all_time_orders: number
    all_time_customers: number
    products: number
    pending_reviews: number
    open_messages: number
    open_reports: number
  }
  revenue_series: Array<{ date: string; revenue: number; orders: number }>
  orders_by_status: Array<{ status: OrderStatus; count: number }>
  top_products: Array<{ id: number; title: string; quantity: number; revenue: number }>
  low_stock: Array<{ id: number; title: string; stock_quantity: number; is_available: boolean }>
  recent_orders: Array<{
    id: number
    order_number: string
    status: OrderStatus
    total: number
    customer: string | null
    created_at: string
  }>
}
