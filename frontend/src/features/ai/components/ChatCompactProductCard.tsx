import { toast } from 'sonner'
import type { HotMeal } from '@/lib/api/mealsApi'
import { useCart } from '@/features/cart/index'
import { cn } from '@/lib/cn'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

type ChatCompactProductCardProps = {
  meal: HotMeal
  cartLineId?: string
}

export function ChatCompactProductCard({ meal, cartLineId }: ChatCompactProductCardProps) {
  const { addItem } = useCart()
  const price =
    meal.price != null && Number.isFinite(meal.price) ? gbp.format(meal.price) : '—'
  const rating = Math.min(5, Math.max(0, meal.rating))
  const filled = Math.round(rating)

  function handleAdd() {
    if (meal.price == null || !Number.isFinite(meal.price)) {
      toast.error('No price available')
      return
    }
    addItem(meal, cartLineId)
    toast.success('Added to cart')
  }

  return (
    <article className="border-grocery-100 hover:border-grocery-200 flex gap-2.5 rounded-xl border bg-white p-2 transition">
      <div className="bg-grocery-50 h-16 w-16 shrink-0 overflow-hidden rounded-lg">
        {meal.imageUrl ? (
          <img
            src={meal.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="text-grocery-400 flex h-full items-center justify-center text-[10px]">
            —
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-grocery-500 text-[10px] font-medium uppercase tracking-wide">
          {meal.categoryLabel}
        </p>
        <h3 className="text-grocery-900 line-clamp-2 text-xs font-semibold leading-tight">
          {meal.name}
        </h3>
        <div className="mt-0.5 flex items-center gap-1">
          <span className="text-[10px] leading-none text-amber-400" aria-hidden>
            {'★'.repeat(filled)}
            <span className="text-grocery-200">{'★'.repeat(5 - filled)}</span>
          </span>
          <span className="text-grocery-600 text-[10px] tabular-nums">{rating.toFixed(1)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="text-grocery-900 text-sm font-bold tabular-nums">{price}</span>
          <button
            type="button"
            onClick={handleAdd}
            className={cn(
              'bg-grocery-900 hover:bg-grocery-800 shrink-0 rounded-lg px-2 py-1',
              'text-[10px] font-semibold text-white',
            )}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  )
}
