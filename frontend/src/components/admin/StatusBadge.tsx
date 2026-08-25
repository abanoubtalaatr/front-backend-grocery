import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-sunken text-grocery-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  danger: 'bg-danger-50 text-danger-700',
  info: 'bg-info-50 text-info-700',
}

/** Order lifecycle → tone. Anything unknown falls back to neutral. */
const orderStatusTones: Record<string, Tone> = {
  placed: 'info',
  processing: 'info',
  shipping: 'warning',
  out_for_delivery: 'warning',
  delivered: 'success',
  cancelled: 'danger',
  new: 'info',
  read: 'neutral',
  replied: 'success',
  resolved: 'success',
  spam: 'danger',
}

export function humanize(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

type StatusBadgeProps = {
  status: string
  tone?: Tone
  className?: string
}

export function StatusBadge({ status, tone, className }: StatusBadgeProps) {
  const resolved = tone ?? orderStatusTones[status] ?? 'neutral'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        tones[resolved],
        className,
      )}
    >
      {humanize(status)}
    </span>
  )
}

type BoolBadgeProps = {
  value: boolean
  trueLabel?: string
  falseLabel?: string
}

export function BoolBadge({ value, trueLabel = 'Yes', falseLabel = 'No' }: BoolBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        value ? tones.success : tones.neutral,
      )}
    >
      {value ? trueLabel : falseLabel}
    </span>
  )
}
