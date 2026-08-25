import { Sparkles, Star } from 'lucide-react'
import { toast } from 'sonner'
import type { HotMeal } from '@/lib/api/mealsApi'
import { useCart } from '@/features/cart/index'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

type ChatAdFeaturedProductProps = {
  meal: HotMeal
}

export function ChatAdFeaturedProduct({ meal }: ChatAdFeaturedProductProps) {
  const { addItem } = useCart()
  const price =
    meal.price != null && Number.isFinite(meal.price) ? gbp.format(meal.price) : '—'
  const rating = Math.min(5, Math.max(0, meal.rating))

  function handleAdd() {
    if (meal.price == null || !Number.isFinite(meal.price)) {
      toast.error('No price available')
      return
    }
    addItem(meal, `chat:featured:${meal.id}`)
    toast.success('Added to cart')
  }

  return (
    <article className="relative shrink-0 overflow-hidden rounded-xl border border-emerald-400/30 bg-gradient-to-br from-white/15 to-white/5 p-2 ring-1 ring-emerald-400/20">
      <span className="absolute right-2 top-2 z-10 flex items-center gap-0.5 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase text-amber-950">
        <Sparkles className="h-2.5 w-2.5" aria-hidden />
        #1
      </span>

      <div className="flex gap-2">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/20">
          {meal.imageUrl ? (
            <img src={meal.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="bg-grocery-800 flex h-full w-full items-center justify-center text-white/40 text-xs">
              —
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 pr-10">
          <h3 className="line-clamp-1 text-xs font-bold text-white">{meal.name}</h3>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-amber-300">
              <Star className="h-3 w-3 fill-current" aria-hidden />
              <span className="text-[10px] font-bold">{rating.toFixed(1)}</span>
            </span>
            <span className="text-sm font-extrabold text-white tabular-nums">{price}</span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="mt-1 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-400 px-2 py-1 text-[10px] font-bold text-grocery-950"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  )
}
