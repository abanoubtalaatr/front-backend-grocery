import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type TextFieldProps = {
  id?: string
  className?: string
  inputClassName?: string
  label: string
  type?: 'email' | 'password' | 'text' | 'tel'
  startAdornment?: ReactNode
  endAdornment?: ReactNode
  /** When false, password fields hide the show/hide control (e.g. login mockups). @default true */
  passwordShowToggle?: boolean
} & InputHTMLAttributes<HTMLInputElement>

const baseField =
  'h-12 w-full rounded-[10px] border border-grocery-200 bg-white pl-10 pr-3 text-sm text-grocery-900 placeholder:text-grocery-300 outline-none transition focus:border-grocery-500 focus:ring-2 focus:ring-grocery-200'

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      id,
      className,
      inputClassName,
      label,
      type = 'text',
      startAdornment,
      endAdornment,
      autoComplete,
      passwordShowToggle = true,
      ...rest
    },
    ref,
  ) {
    const autoId = useId()
    const fieldId = id ?? autoId
    const isPassword = type === 'password'
    const [show, setShow] = useState(false)
    const inputType = isPassword && show ? 'text' : type
    return (
      <div className={cn('w-full', className)}>
        <label htmlFor={fieldId} className="text-grocery-500 sr-only">
          {label}
        </label>
        <div className="relative flex items-stretch">
          {startAdornment && (
            <span
              className="text-grocery-300 pointer-events-none absolute left-3 top-1/2 z-1 flex h-5 w-5 -translate-y-1/2"
              aria-hidden
            >
              {startAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              baseField,
              (isPassword && !endAdornment && passwordShowToggle) || endAdornment ? 'pr-12' : undefined,
              inputClassName,
            )}
            type={inputType}
            name={rest.name}
            autoComplete={autoComplete}
            placeholder={label}
            aria-required={rest.required}
            {...rest}
          />
          {isPassword && !endAdornment && passwordShowToggle && (
            <button
              type="button"
              className="text-grocery-500 absolute right-1 top-1/2 z-1 min-h-9 min-w-10 -translate-y-1/2 text-xs font-medium"
              onClick={() => setShow((v) => !v)}
              aria-pressed={show}
            >
              {show ? 'Hide' : 'Show'}
            </button>
          )}
          {endAdornment}
        </div>
      </div>
    )
  },
)
