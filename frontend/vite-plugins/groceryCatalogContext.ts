export type CatalogProduct = {
  id: number
  title: string
  slug: string
  category: string
  brand: string | null
  price: number
  discount_price: number | null
  final_price: number
  rating: number
  rating_count: number
  in_stock: boolean
  is_hot: boolean
  has_offer: boolean
  offer_title: string | null
  image_url: string | null
}

const MAX_CATALOG_ITEMS = 80

function asRecord(x: unknown): Record<string, unknown> | null {
  if (x != null && typeof x === 'object' && !Array.isArray(x)) {
    return x as Record<string, unknown>
  }
  return null
}

function asArray(data: unknown): unknown[] {
  if (Array.isArray(data)) {
    return data
  }
  const o = asRecord(data)
  if (!o) {
    return []
  }
  for (const key of ['data', 'meals', 'items']) {
    if (Array.isArray(o[key])) {
      return o[key] as unknown[]
    }
  }
  return []
}

function pickString(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) {
      return v.trim()
    }
  }
  return ''
}

function pickNumber(o: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'number' && Number.isFinite(v)) {
      return v
    }
    if (typeof v === 'string' && v.trim()) {
      const n = Number(v)
      if (Number.isFinite(n)) {
        return n
      }
    }
  }
  return null
}

function categoryName(o: Record<string, unknown>): string {
  const cat = o.category
  const rec = asRecord(cat)
  if (rec) {
    return pickString(rec, ['name', 'title']) || 'Groceries'
  }
  if (typeof cat === 'string' && cat.trim()) {
    return cat.trim()
  }
  return 'Groceries'
}

function normalizeProduct(row: unknown): CatalogProduct | null {
  const o = asRecord(row)
  if (!o) {
    return null
  }
  const id = pickNumber(o, ['id']) ?? null
  const title = pickString(o, ['title', 'name'])
  if (id == null || !title) {
    return null
  }

  const price = pickNumber(o, ['price']) ?? 0
  const discount =
    pickNumber(o, ['discount_price', 'discountPrice']) ??
    pickNumber(o, ['final_price', 'finalPrice'])
  const finalPrice = discount ?? price

  const imageRaw = pickString(o, ['image', 'image_url', 'imageUrl', 'photo', 'thumbnail', 'picture'])

  return {
    id: Math.floor(id),
    title,
    slug: pickString(o, ['slug']) || `product-${id}`,
    category: categoryName(o),
    brand: pickString(o, ['brand']) || null,
    price,
    discount_price: discount,
    final_price: finalPrice,
    rating: Math.min(5, Math.max(0, pickNumber(o, ['rating']) ?? 0)),
    rating_count: Math.max(0, Math.floor(pickNumber(o, ['rating_count', 'ratingCount']) ?? 0)),
    in_stock: o.in_stock === true || o.in_stock === 1 || (pickNumber(o, ['stock_quantity']) ?? 1) > 0,
    is_hot: o.is_hot === true || o.is_hot === 1,
    has_offer: o.has_offer === true || o.has_offer === 1 || Boolean(pickString(o, ['offer_title'])),
    offer_title: pickString(o, ['offer_title', 'offerTitle']) || null,
    image_url: imageRaw || null,
  }
}

async function fetchCatalogPath(apiBase: string, path: string): Promise<CatalogProduct[]> {
  const base = apiBase.replace(/\/$/, '')
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return []
    }
    const json: unknown = await res.json()
    const rows = asArray(json)
    const out: CatalogProduct[] = []
    for (const row of rows) {
      const p = normalizeProduct(row)
      if (p) {
        out.push(p)
      }
    }
    return out
  } catch {
    return []
  }
}

function mergeProducts(target: Map<number, CatalogProduct>, items: CatalogProduct[]) {
  for (const item of items) {
    target.set(item.id, item)
  }
}

/** Build a compact catalog slice for the AI system prompt (search-aware). */
export async function buildGroceryCatalogContext(
  apiBase: string,
  userQuery: string,
): Promise<CatalogProduct[]> {
  const merged = new Map<number, CatalogProduct>()

  mergeProducts(merged, await fetchCatalogPath(apiBase, '/api/meals/hot'))
  mergeProducts(merged, await fetchCatalogPath(apiBase, '/api/best-sells'))
  mergeProducts(merged, (await fetchCatalogPath(apiBase, '/api/new-products')).slice(0, 20))

  const q = userQuery.trim()
  if (q.length >= 2) {
    const encoded = encodeURIComponent(q.slice(0, 120))
    mergeProducts(
      merged,
      (await fetchCatalogPath(apiBase, `/api/meals?search=${encoded}&in_stock=1`)).slice(0, 50),
    )
  }

  return Array.from(merged.values()).slice(0, MAX_CATALOG_ITEMS)
}

export function buildGroceryCatalogSystemPrompt(products: CatalogProduct[]): string {
  const catalogJson = JSON.stringify(products, null, 0)

  return `You are the Grocery+ shopping assistant for an online grocery store.

Your job is to help customers using ONLY the product catalog JSON below.

## Rules
- Answer questions about products: prices, ratings, categories, brands, stock, deals, recommendations.
- When recommending items, mention exact product titles and include price (GBP) and rating.
- If something is not in the catalog, say it is unavailable and suggest 2–3 similar alternatives.
- Do NOT invent products, prices, or stock status.
- If asked about unrelated topics, say you only help with grocery shopping.
- Reply in the same language the user writes (Arabic or English).
- Keep answers concise and practical.

## Cart Actions (CRITICAL)
When the user asks to add, buy, remove, or clear items, you MUST append a cart_action XML tag at the very end of your reply (after all your text). Do NOT wrap it in backticks or code blocks — output it as plain text exactly as shown.

To ADD a product: append exactly this (no code fences, no backticks):
<cart_action>{"type":"add","id":"ID_FROM_CATALOG","name":"EXACT TITLE","price":FINAL_PRICE,"imageUrl":"IMAGE_URL","category":"CATEGORY","rating":RATING}</cart_action>

To REMOVE a product: append exactly this:
<cart_action>{"type":"remove","id":"ID_FROM_CATALOG","name":"PRODUCT NAME"}</cart_action>

To CLEAR the entire cart: append exactly this:
<cart_action>{"type":"clear"}</cart_action>

Critical rules:
- Use EXACT values from the catalog (id as string, final_price for price, image_url for imageUrl).
- Output the tag as raw text — NEVER inside backtick fences or markdown code blocks.
- Always write a natural confirmation message before the tag.
- If product not in catalog, say unavailable — do NOT invent an action.

Product catalog (${products.length} items):
${catalogJson}`
}

export function buildCatalogMockReply(userText: string, products: CatalogProduct[]): string {
  const q = userText.toLowerCase()
  if (!userText.trim()) {
    return 'Ask me about products — for example: "What hot deals do you have?" or "Do you have chicken?"'
  }

  if (products.length === 0) {
    return 'I could not load the product catalog. Make sure the grocery API is running, then try again.'
  }

  const matches = products.filter((p) => {
    const hay = `${p.title} ${p.category} ${p.brand ?? ''}`.toLowerCase()
    return q.split(/\s+/).some((word) => word.length > 2 && hay.includes(word))
  })

  const picks = (matches.length > 0 ? matches : products.filter((p) => p.is_hot || p.has_offer)).slice(0, 3)

  if (picks.length === 0) {
    return `I have ${products.length} products in the store. Try asking about a category (vegetables, dairy, meat) or "hot deals".`
  }

  const lines = picks.map(
    (p) =>
      `• ${p.title} (${p.category}) — £${p.final_price.toFixed(2)}, ★${p.rating.toFixed(1)}${p.in_stock ? '' : ' (out of stock)'}`,
  )

  return `Here are some options from our catalog:\n\n${lines.join('\n')}\n\n(Add ANTHROPIC_API_KEY in .env for smarter answers.)`
}
