import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const baseTextarea =
  'w-full rounded-[10px] border border-grocery-200 bg-white pl-3 pr-3 py-2 text-sm text-grocery-900 placeholder:text-grocery-300 outline-none transition focus:border-grocery-500 focus:ring-2 focus:ring-grocery-200'

export type TextAreaProps = {
  label: string
  /** Classes on the outer wrapper */
  className?: string
  /** Extra classes merged onto the `<textarea>` (after base styles) */
  textareaClassName?: string
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

export function TextAreaField({ label, className, textareaClassName, ...props }: TextAreaProps) {
  return (
    <div className={cn('w-full', className)}>
      <label htmlFor={props.id} className="text-grocery-500 sr-only">
        {label}
      </label>
      <textarea {...props} className={cn(baseTextarea, textareaClassName)} />
    </div>
  )
}