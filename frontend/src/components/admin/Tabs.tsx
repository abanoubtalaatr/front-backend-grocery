import { cn } from '@/lib/cn'

type TabsProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  tabs: Array<{ value: T; label: string }>
}

export function Tabs<T extends string>({ value, onChange, tabs }: TabsProps<T>) {
  return (
    <div role="tablist" className="border-line bg-surface inline-flex gap-1 rounded-xl border p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded-lg px-3 py-1.5 text-sm font-medium transition',
            tab.value === value
              ? 'bg-grocery-900 text-white'
              : 'text-grocery-600 hover:bg-surface-muted',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
