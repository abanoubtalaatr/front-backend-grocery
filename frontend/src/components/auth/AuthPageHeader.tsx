import { GroceryWordmark } from '@/components/brand/GroceryWordmark'
import { cn } from '@/lib/cn'

type AuthPageHeaderProps = { className?: string }

/**
 * Curved top header with brand. Optional `src` for a header pattern can
 * be added when design provides a texture file.
 */
export function AuthPageHeader({ className }: AuthPageHeaderProps) {
  return (
    <header
      className={cn(
        'bg-grocery-900 relative z-0 overflow-hidden w-[40%] pt-10 pb-12 text-center',
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 0%, #fff, transparent 50%), radial-gradient(circle at 90% 20%, #38bdf8, transparent 40%)',
        }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center">
        <GroceryWordmark variant="onPrimary" className="text-3xl" />
      </div>
    </header>
  )
}
