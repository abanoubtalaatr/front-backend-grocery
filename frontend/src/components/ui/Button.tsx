import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = {
  className?: string
  children: ReactNode
  loading?: boolean
  variant?: ButtonVariant
} & ButtonHTMLAttributes<HTMLButtonElement>

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-grocery-900 text-white hover:bg-grocery-800 focus-visible:ring-2 focus-visible:ring-grocery-900/40 disabled:opacity-50',
  secondary:
    'border border-grocery-200 bg-white text-grocery-900 hover:bg-grocery-50 focus-visible:ring-2 focus-visible:ring-grocery-200',
  ghost: 'text-grocery-600 hover:bg-grocery-100 focus-visible:ring-2 focus-visible:ring-grocery-200',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, children, loading, variant = 'primary', disabled, type = 'button', ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex min-h-12 w-full min-w-0 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition',
          'disabled:pointer-events-none',
          variants[variant],
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && (
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden
          />
        )}
        {children}
      </button>
    )
  },
)
