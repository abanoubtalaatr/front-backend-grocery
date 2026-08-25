import { cn } from '@/lib/cn'

type GroceryLogoMarkProps = {
  className?: string
  withPlus?: boolean
  'aria-hidden'?: boolean
}

/**
 * Styling-only logo mark. Replace with brand SVG when the design team
 * provides final art.
 */
export function GroceryLogoMark({
  className,
  withPlus = false,
  'aria-hidden': ariaHidden = true,
}: GroceryLogoMarkProps) {
  return (
    <div
      className={cn('relative inline-flex items-end justify-center', className)}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : 'Grocery+ logo'}
      aria-hidden={ariaHidden || undefined}
    >
      <svg
        className="h-20 w-16 text-grocery-900"
        viewBox="0 0 64 80"
        fill="currentColor"
        aria-hidden
      >
        <path d="M32 2c-4-3-8-1-8 0 0-4 4-8 6-2 0-2 2-2l2 4c-10 2-20 10-20 30 0 24 20 32 24 50 0 0 2 0 2-2C38 64 50 50 50 32c0-8-2-12-2-12 4-4 6-2 4-2-2 2-4-2-6-2-1 0-3 0-3 2 0-4-2-4-2-2Z" />
        <circle cx="32" cy="34" r="10" fill="white" />
      </svg>
      {withPlus && (
        <span
          className="text-grocery-900 absolute -right-1.5 -top-1.5 text-lg font-bold leading-none"
          aria-hidden
        >
          +
        </span>
      )}
    </div>
  )
}
