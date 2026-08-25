import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type IconButtonProps = {
  label: string
  onClick: () => void
  tone?: 'default' | 'danger'
  disabled?: boolean
  children: ReactNode
}

/** Square action button for table rows — the label is the accessible name. */
export function IconButton({ label, onClick, tone = 'default', disabled, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid h-9 w-9 place-items-center rounded-lg transition disabled:pointer-events-none disabled:opacity-40',
        tone === 'danger'
          ? 'text-danger-700 hover:bg-danger-50'
          : 'text-grocery-600 hover:bg-surface-muted',
      )}
    >
      {children}
    </button>
  )
}
