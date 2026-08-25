import { useEffect, useState } from 'react'
import { Flame, ShoppingCart, Star } from 'lucide-react'
import { toast } from 'sonner'
import { fetchHotMeals, type HotMeal } from '@/lib/api/mealsApi'
import { useCart } from '@/features/cart/index'
import { cn } from '@/lib/cn'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

function BigProductCard({
  meal,
  rank,
}: {
  meal: HotMeal
  rank: number
}) {
  const { addItem } = useCart()
  const price =
    meal.price != null && Number.isFinite(meal.price) ? gbp.format(meal.price) : '—'
  const rating = Math.min(5, Math.max(0, meal.rating))
  const hasDeal =
    meal.compareAtPrice != null &&
    meal.price != null &&
    meal.compareAtPrice > meal.price
  const savings =
    hasDeal && meal.price != null && meal.compareAtPrice != null
      ? gbp.format(meal.compareAtPrice - meal.price)
      : null

  function handleAdd() {
    if (meal.price == null) return
    addItem(meal, `showcase:${meal.id}`)
    toast.success(`${meal.name} added to cart!`)
  }

  const rankColors = [
    'from-amber-400 to-orange-400',
    'from-slate-300 to-slate-400',
    'from-orange-600 to-amber-700',
  ]

  return (
    <article className="group relative flex overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl">
      {/* Image */}
      <div className="relative w-[38%] shrink-0 overflow-hidden bg-grocery-100">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt={meal.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-grocery-300">—</div>
        )}

        {/* Rank badge */}
        <span
          className={cn(
            'absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-black text-white shadow-lg',
            rankColors[rank] ?? 'from-grocery-700 to-grocery-900',
          )}
        >
          {rank + 1}
        </span>

        {savings && (
          <span className="absolute bottom-2 left-2 rounded-lg bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
            Save {savings}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
              {meal.categoryLabel ?? 'Grocery'}
            </p>
            <span className="text-grocery-200 text-[10px]">·</span>
            <p className="truncate text-[10px] text-grocery-400">{meal.vendorLabel}</p>
          </div>
          <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-grocery-900">
            {meal.name}
          </h3>

          {/* Description */}
          {meal.description ? (
            <p className="mt-2 line-clamp-3 text-base leading-relaxed text-grocery-500">
              {meal.description}
            </p>
          ) : (
            <p className="mt-2 line-clamp-3 text-base leading-relaxed text-grocery-500">
              Fresh quality {meal.categoryLabel?.toLowerCase() ?? 'product'} — handpicked and
              delivered to your door same day. Always in stock and at the best price.
            </p>
          )}

          <div className="mt-2 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'h-3 w-3',
                  s <= Math.round(rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-grocery-200 text-grocery-200',
                )}
              />
            ))}
            <span className="ml-1 text-[11px] font-bold text-grocery-700">
              {rating.toFixed(1)}
            </span>
            {meal.ratingCount > 0 && (
              <span className="text-[10px] text-grocery-400">
                ({meal.ratingCount.toLocaleString()})
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-xl font-extrabold leading-none text-grocery-900 tabular-nums">
              {price}
            </p>
            {meal.compareAtPrice != null && meal.price != null && hasDeal && (
              <p className="mt-0.5 text-[11px] text-grocery-400 line-through tabular-nums">
                {gbp.format(meal.compareAtPrice)}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/30 transition hover:brightness-110"
          >
            <ShoppingCart className="h-3.5 w-3.5" aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
  )
}

export function ChatProductShowcase() {
  const [meals, setMeals] = useState<HotMeal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    void fetchHotMeals()
      .then((data) => {
        if (!cancelled) setMeals(data.slice(0, 4))
      })
      .catch(() => {
        if (!cancelled) setMeals([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <aside
      className="flex h-full min-h-0 w-full flex-col gap-2 overflow-hidden"
      aria-label="Top products"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-300">
          <Flame className="h-4 w-4" aria-hidden />
        </span>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
            Live catalog
          </p>
          <h2 className="text-sm font-extrabold text-white">Top picks today</h2>
        </div>
      </div>

      {/* Product list */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none]">
        <div className="flex flex-col gap-2">
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[84px] animate-pulse rounded-2xl bg-white/10"
              />
            ))}

          {!loading &&
            meals.map((meal, i) => (
              <BigProductCard key={meal.id} meal={meal} rank={i} />
            ))}
        </div>
      </div>

      {/* Footer CTA */}
      {!loading && meals.length > 0 && (
        <div className="shrink-0 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 p-2.5 text-center ring-1 ring-emerald-400/20">
          <p className="text-[11px] font-bold text-white">
            🛒 4,000+ more products in the store
          </p>
          <p className="text-[10px] text-emerald-300">Ask AI to find anything instantly</p>
        </div>
      )}
    </aside>
  )
}
