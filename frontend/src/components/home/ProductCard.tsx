import { toast } from 'sonner'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/features/cart/index'
import type { HotMeal } from '@/lib/api/mealsApi'
import { cn } from '@/lib/cn'

function StarRow({ rating }: { rating: number }) {
  const filled = Math.min(5, Math.max(0, Math.round(rating)))
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < filled ? 'text-amber-400' : 'text-grocery-200'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </div>
  )
}

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

function formatPrice(n: number | null): string | null {
  if (n == null || !Number.isFinite(n)) {
    return null
  }
  return gbp.format(n)
}

function CartPlusIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-4 w-4', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3H2.25m0-13.5V11a2.25 2.25 0 0 0 2.25 2.25h13.5M7.5 14.25H19.5m0 0a3 3 0 0 1-3 3H9.75M19.5 14.25V9.75a2.25 2.25 0 0 0-2.25-2.25h-9M19.5 14.25v2.25a2.25 2.25 0 0 1-2.25 2.25H9.75M9.75 9.75v4.5m0-4.5h4.5m-4.5 0H7.5"
      />
    </svg>
  )
}

export type ProductCardProps = {
  meal: HotMeal
  /** Stable key when the same catalogue id appears in multiple lists (e.g. hot vs new). */
  cartLineId?: string
}

export function ProductCard({ meal, cartLineId }: ProductCardProps) {
  const { addItem } = useCart()
  const [imgBroken, setImgBroken] = useState(false)
  const priceStr = formatPrice(meal.price)
  const wasStr = formatPrice(meal.compareAtPrice)
  const ratingLabel = useMemo(() => {
    const r = Number.isFinite(meal.rating) ? meal.rating : 0
    const rounded = Math.round(r * 10) / 10
    const count = Math.max(0, Math.floor(meal.ratingCount ?? 0))
    return { rounded, count }
  }, [meal.rating, meal.ratingCount])

  function handleAddToCart() {
    if (meal.price == null || !Number.isFinite(meal.price)) {
      toast.error('This item has no price yet and can’t be added.')
      return
    }
    addItem(meal, cartLineId)
    toast.success(`Added “${meal.name}” to cart`)
  }

  return (
    <article className="border-grocery-100 bg-white flex h-full flex-col rounded-2xl border p-3 shadow-sm transition hover:shadow-md">
      <div className="bg-grocery-50 relative aspect-square w-full overflow-hidden rounded-xl">
        {meal.imageUrl && !imgBroken ? (
          <img
            src={meal.imageUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImgBroken(true)}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="from-grocery-100 to-grocery-50 text-grocery-500 flex h-full w-full flex-col items-center justify-center bg-gradient-to-br text-center text-xs">
              <span className="text-grocery-800 font-semibold">Image unavailable</span>
              <span className="mt-1 text-[11px]">Will refresh soon</span>
            </div>
          </div>
        )}
      </div>
      <p className="text-grocery-500 mt-2 text-[11px] font-medium uppercase tracking-wide">
        {meal.categoryLabel}
      </p>
      <h3 className="text-grocery-900 line-clamp-2 min-h-10 text-sm font-semibold leading-snug">
        {meal.name}
      </h3>
      <div className="mt-1 flex items-center gap-2">
        <StarRow rating={meal.rating} />
        <span className="text-grocery-700 text-xs font-medium tabular-nums">
          {ratingLabel.rounded.toFixed(1)}
        </span>
        {ratingLabel.count > 0 && (
          <span className="text-grocery-500 text-xs tabular-nums">
            ({ratingLabel.count.toLocaleString('en-GB')})
          </span>
        )}
      </div>
      <p className="text-grocery-500 mt-1 text-xs">{meal.vendorLabel}</p>
      <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-2">
        {priceStr && (
          <span className="text-grocery-900 text-base font-bold">{priceStr}</span>
        )}
        {wasStr && meal.compareAtPrice != null && meal.price != null && meal.compareAtPrice > meal.price && (
          <span className="text-grocery-400 text-sm line-through">{wasStr}</span>
        )}
      </div>
      <Button
        type="button"
        className="mt-3 h-10 min-h-0 gap-2 text-sm"
        onClick={handleAddToCart}
      >
        <CartPlusIcon className="text-white" />
        Add to cart
      </Button>
    </article>
  )
}
