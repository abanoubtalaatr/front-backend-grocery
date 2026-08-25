import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type ToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  placeholder?: string
  children?: ReactNode
}

/** Search box plus optional filter controls above a table. */
export function Toolbar({ search, onSearchChange, placeholder = 'Search…', children }: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <Search
          className="text-grocery-300 pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="border-line text-grocery-900 placeholder:text-grocery-300 focus:border-grocery-500 focus:ring-grocery-200 h-10 w-full rounded-lg border bg-white pr-3 pl-9 text-sm outline-none transition focus:ring-2"
        />
      </div>
      {children}
    </div>
  )
}

type FilterSelectProps = {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  className?: string
}

export function FilterSelect({ label, value, onChange, options, className }: FilterSelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cn(
        'border-line text-grocery-600 focus:border-grocery-500 focus:ring-grocery-200 h-10 rounded-lg border bg-white px-3 text-sm outline-none transition focus:ring-2',
        className,
      )}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
