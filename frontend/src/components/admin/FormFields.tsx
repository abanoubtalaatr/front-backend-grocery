import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

/**
 * Compact form primitives for the dashboard. The storefront's `TextField` is
 * built for tall mobile auth screens; admin forms need dense rows instead.
 */

const control =
  'border-line text-grocery-900 placeholder:text-grocery-300 focus:border-grocery-500 focus:ring-grocery-200 w-full rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2 disabled:opacity-60'

type FieldShellProps = {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  className?: string
  children: ReactNode
}

function FieldShell({ label, htmlFor, hint, error, className, children }: FieldShellProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-grocery-600 text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-danger-700 text-xs" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-grocery-300 text-xs">{hint}</p>
      ) : null}
    </div>
  )
}

type TextInputProps = {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
} & InputHTMLAttributes<HTMLInputElement>

export function TextInput({ label, hint, error, wrapperClassName, className, id, ...rest }: TextInputProps) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <FieldShell label={label} htmlFor={fieldId} hint={hint} error={error} className={wrapperClassName}>
      <input id={fieldId} className={cn(control, 'h-10', className)} {...rest} />
    </FieldShell>
  )
}

type TextAreaProps = {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextArea({ label, hint, error, wrapperClassName, className, id, rows = 4, ...rest }: TextAreaProps) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <FieldShell label={label} htmlFor={fieldId} hint={hint} error={error} className={wrapperClassName}>
      <textarea id={fieldId} rows={rows} className={cn(control, 'py-2', className)} {...rest} />
    </FieldShell>
  )
}

type SelectProps = {
  label: string
  hint?: string
  error?: string
  wrapperClassName?: string
  options: Array<{ value: string; label: string }>
} & SelectHTMLAttributes<HTMLSelectElement>

export function Select({ label, hint, error, wrapperClassName, className, id, options, ...rest }: SelectProps) {
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <FieldShell label={label} htmlFor={fieldId} hint={hint} error={error} className={wrapperClassName}>
      <select id={fieldId} className={cn(control, 'h-10', className)} {...rest}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}

type SwitchProps = {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export function Switch({ label, description, checked, onChange, disabled }: SwitchProps) {
  return (
    <label
      className={cn(
        'border-line flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5',
        disabled && 'pointer-events-none opacity-60',
      )}
    >
      <span className="min-w-0">
        <span className="text-grocery-900 block text-sm font-medium">{label}</span>
        {description ? <span className="text-grocery-500 block text-xs">{description}</span> : null}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition',
          checked ? 'bg-grocery-900' : 'bg-surface-sunken',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition',
            checked && 'translate-x-5',
          )}
        />
      </span>
    </label>
  )
}

type ImageInputProps = {
  label: string
  currentUrl?: string | null
  onChange: (file: File | null) => void
  hint?: string
}

export function ImageInput({ label, currentUrl, onChange, hint }: ImageInputProps) {
  const fieldId = useId()

  return (
    <FieldShell label={label} htmlFor={fieldId} hint={hint}>
      <div className="flex items-center gap-3">
        {currentUrl ? (
          <img
            src={currentUrl}
            alt=""
            className="border-line h-14 w-14 shrink-0 rounded-lg border object-cover"
          />
        ) : (
          <span className="bg-surface-sunken text-grocery-300 grid h-14 w-14 shrink-0 place-items-center rounded-lg text-xs">
            —
          </span>
        )}
        <input
          id={fieldId}
          type="file"
          accept="image/*"
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          className="text-grocery-600 file:border-line file:bg-surface-muted file:text-grocery-900 w-full text-sm file:mr-3 file:rounded-lg file:border file:px-3 file:py-1.5 file:text-sm"
        />
      </div>
    </FieldShell>
  )
}
