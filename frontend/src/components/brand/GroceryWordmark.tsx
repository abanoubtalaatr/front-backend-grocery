import { brand } from '@/constants/brand'
import { cn } from '@/lib/cn'

type GroceryWordmarkProps = {
  className?: string
  variant?: 'onPrimary' | 'onLight'
}

export function GroceryWordmark({
  className,
  variant = 'onLight',
}: GroceryWordmarkProps) {
  const isOnPrimary = variant === 'onPrimary'
  return (
    <span
      className={cn(
        'inline-flex items-baseline gap-0.5 text-2xl font-bold tracking-tight',
        isOnPrimary ? 'text-white' : 'text-grocery-900',
        className,
      )}
    >
      <span>Grocery</span>
      <span className={isOnPrimary ? 'text-sky-200' : 'text-sky-600'}>+</span>
      <span className="sr-only">{brand.name}</span>
    </span>
  )
}
