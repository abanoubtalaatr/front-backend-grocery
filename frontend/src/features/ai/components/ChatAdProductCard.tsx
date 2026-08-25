import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import type { HotMeal } from '@/lib/api/mealsApi'
import { useCart } from '@/features/cart/index'
import { cn } from '@/lib/cn'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

type ChatAdProductCardProps = {
  meal: HotMeal
  cartLineId?: string
  className?: string
  highlight?: boolean
  compact?: boolean
}

export function ChatAdProductCard({
  meal,
  cartLineId,
  className,
  highlight = false,
  compact = false,
}: ChatAdProductCardProps) {
  const { addItem } = useCart()
  const price =
    meal.price != null && Number.isFinite(meal.price) ? gbp.format(meal.price) : '—'
  const rating = Math.min(5, Math.max(0, meal.rating))
  const filled = Math.round(rating)
  const hasDeal =
    meal.compareAtPrice != null &&
    meal.price != null &&
    meal.compareAtPrice > meal.price

  function handleAdd() {
    if (meal.price == null || !Number.isFinite(meal.price)) {
      toast.error('No price available')
      return
    }
    addItem(meal, cartLineId)
    toast.success('Added to cart')
  }

  if (compact) {
    return (
      <article
        className={cn(
          'flex w-[108px] shrink-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-white/95 shadow-md',
          className,
        )}
      >
        <div className="relative aspect-square w-full overflow-hidden bg-grocery-100">
          {meal.imageUrl ? (
            <img src={meal.imageUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : null}
          {hasDeal && (
            <span className="absolute left-1 top-1 rounded bg-rose-500 px-1 text-[8px] font-bold text-white">
              Deal
            </span>
          )}
        </div>
        <div className="p-1.5">
          <h3 className="text-grocery-900 line-clamp-1 text-[10px] font-bold">{meal.name}</h3>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-grocery-900 text-[11px] font-extrabold">{price}</span>
            <button
              type="button"
              onClick={handleAdd}
              className="rounded-md bg-grocery-900 p-1 text-white"
              aria-label={`Add ${meal.name}`}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'group flex w-[140px] shrink-0 flex-col overflow-hidden rounded-2xl border bg-white/95 shadow-lg backdrop-blur-sm transition duration-300',
        highlight
          ? 'border-emerald-400/50 ring-2 ring-emerald-400/30'
          : 'border-white/10 hover:-translate-y-1',
        className,
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-grocery-100">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        ) : null}
        {hasDeal && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
            Deal
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <h3 className="text-grocery-900 line-clamp-2 text-xs font-bold">{meal.name}</h3>
        <div className="mt-1 flex items-center gap-1">
          <span className="text-[10px] text-amber-400" aria-hidden>
            {'★'.repeat(filled)}
          </span>
          <span className="text-grocery-600 text-[10px]">{rating.toFixed(1)}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-grocery-900 text-sm font-extrabold">{price}</span>
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-0.5 rounded-lg bg-grocery-900 px-2 py-1 text-[10px] font-bold text-white"
          >
            <Plus className="h-3 w-3" aria-hidden />
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
