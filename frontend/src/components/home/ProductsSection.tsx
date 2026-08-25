import { useEffect, useMemo, useState } from 'react'
import { ApiError } from '@/lib/api/apiError'
import { type CatalogProduct } from '@/lib/api/mealsApi'
import { cn } from '@/lib/cn'
import { ProductCard } from '@/components/home/ProductCard'

const TAB_PRESETS = [
  { id: 'all', label: 'All' },
  { id: 'vegetables', label: 'Vegetables' },
  { id: 'fruits', label: 'Fruits' },
  { id: 'coffee', label: 'Coffee & teas' },
  { id: 'meat', label: 'Meat' },
] as const

function tabMatches(tabId: string, category: string): boolean {
  const c = category.toLowerCase()
  if (tabId === 'all') {
    return true
  }
  if (tabId === 'vegetables') {
    return /veg|greens|salad|herb/.test(c)
  }
  if (tabId === 'fruits') {
    return /fruit|berry|citrus|apple|banana|melon/.test(c)
  }
  if (tabId === 'coffee') {
    return /coffee|tea|beverage|drink/.test(c)
  }
  if (tabId === 'meat') {
    return /meat|fish|poultry|seafood|chicken|beef/.test(c)
  }
  return c.includes(tabId)
}

type ProductsSectionProps = {
  id: string
  title: string
  fetcher: () => Promise<CatalogProduct[]>
  emptyMessage: string
  /** Prefix for cart line ids so lists don’t collide (e.g. `"hot-"`). */
  cartLinePrefix?: string
}

export function ProductsSection({
  id,
  title,
  fetcher,
  emptyMessage,
  cartLinePrefix,
}: ProductsSectionProps) {
  const [items, setItems] = useState<CatalogProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>('all')

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)
      try {
        const data = await fetcher()
        if (!cancelled) {
          setItems(data)
        }
      } catch (e) {
        if (cancelled) {
          return
        }
        if (e instanceof ApiError) {
          setError(e.message)
        } else {
          setError('Something went wrong.')
        }
        setItems([])
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [fetcher])

  const filtered = useMemo(
    () => items.filter((item) => tabMatches(activeTab, item.categoryLabel)),
    [items, activeTab],
  )

  return (
    <section
      id={id}
      className="bg-grocery-50/40 scroll-mt-24 px-4 py-10"
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id={`${id}-heading`} className="text-grocery-900 text-2xl font-bold md:text-3xl">
            {title}
          </h2>
          <div
            className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label={`Filter ${title} by category`}
          >
            {TAB_PRESETS.map((t) => {
              const active = activeTab === t.id
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-grocery-900 text-white shadow-sm'
                      : 'text-grocery-600 hover:bg-grocery-100 bg-white',
                  )}
                  onClick={() => setActiveTab(t.id)}
                >
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {loading && (
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="border-grocery-100 bg-white rounded-2xl border p-3 shadow-sm">
                <div className="bg-grocery-100 aspect-square w-full animate-pulse rounded-xl" />
                <div className="bg-grocery-100 mt-3 h-3 w-1/3 animate-pulse rounded" />
                <div className="bg-grocery-100 mt-2 h-4 w-4/5 animate-pulse rounded" />
                <div className="bg-grocery-100 mt-3 h-9 w-full animate-pulse rounded-lg" />
              </li>
            ))}
          </ul>
        )}

        {!loading && error && <p className="text-grocery-600 mt-8 text-center text-sm">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-grocery-600 mt-8 text-center text-sm">
            {items.length === 0 ? emptyMessage : 'No items in this category.'}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {filtered.map((item) => (
              <li key={item.id}>
                <ProductCard
                  meal={item}
                  cartLineId={
                    cartLinePrefix ? `${cartLinePrefix}${item.id}` : undefined
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
