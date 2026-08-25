import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/cn'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
})

export type CategoryRow = {
  value: string
  label: string
  icon: ComponentType<{ className?: string }>
}

function FilterHeading({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <h3 className="text-grocery-900 flex items-center gap-2 text-sm font-bold">
      {icon}
      {children}
    </h3>
  )
}

function SmallBlueIcon() {
  return (
    <span className="bg-sky-500 inline-block h-2 w-2 rotate-45 rounded-sm" aria-hidden />
  )
}

type CheckboxProps = {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function FilterCheckbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="text-grocery-700 hover:text-grocery-900 flex cursor-pointer items-center gap-2.5 text-sm"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="border-grocery-300 text-grocery-900 focus:ring-grocery-500 h-4 w-4 rounded"
      />
      {label}
    </label>
  )
}

export type CategoryFilterSidebarProps = {
  categoryRows: CategoryRow[]
  activeCategory: string
  onCategoryChange: (value: string) => void
  /** Unique vendor names from products */
  brandOptions: string[]
  selectedBrands: string[]
  onBrandToggle: (brand: string, selected: boolean) => void
  productFresh: boolean
  productOrganic: boolean
  productFrozen: boolean
  onProductTypeChange: (key: 'fresh' | 'organic' | 'frozen', value: boolean) => void
  stockIn: boolean
  stockOut: boolean
  onStockChange: (key: 'in' | 'out', value: boolean) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  onSearchSubmit: () => void
  priceMinBound: number
  priceMaxBound: number
  priceRangeMin: number
  priceRangeMax: number
  onPriceRangeChange: (min: number, max: number) => void
  className?: string
}

export function CategoryFilterSidebar({
  categoryRows,
  activeCategory,
  onCategoryChange,
  brandOptions,
  selectedBrands,
  onBrandToggle,
  productFresh,
  productOrganic,
  productFrozen,
  onProductTypeChange,
  stockIn,
  stockOut,
  onStockChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  priceMinBound,
  priceMaxBound,
  priceRangeMin,
  priceRangeMax,
  onPriceRangeChange,
  className,
}: CategoryFilterSidebarProps) {
  const hasBrands = brandOptions.length > 0
  const rangeDisabled = !Number.isFinite(priceMaxBound) || priceMaxBound <= priceMinBound

  return (
    <aside
      className={cn(
        'bg-sky-50/70 border-grocery-100 w-full shrink-0 rounded-2xl border p-4 lg:w-72 xl:w-80',
        className,
      )}
    >
      <div className="space-y-6">
        <div>
          <FilterHeading>Categories</FilterHeading>
          <ul className="mt-3 space-y-0.5" role="list">
            {categoryRows.map(({ value, label, icon: Icon }) => {
              const active = activeCategory === value
              return (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange(value)}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-medium transition',
                      active
                        ? 'bg-sky-100/90 text-grocery-900'
                        : 'text-grocery-600 hover:bg-white/80 hover:text-grocery-900',
                    )}
                  >
                    <span className="text-grocery-500 shrink-0">
                      <Icon />
                    </span>
                    {label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {hasBrands && (
          <div>
            <FilterHeading>Brand</FilterHeading>
            <div className="mt-3 space-y-2.5">
              {brandOptions.map((b) => (
                <FilterCheckbox
                  key={b}
                  id={`brand-${b}`}
                  label={b}
                  checked={selectedBrands.includes(b)}
                  onChange={(c) => onBrandToggle(b, c)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <FilterHeading>Product Type</FilterHeading>
          <div className="mt-3 space-y-2.5">
            <FilterCheckbox
              id="pt-fresh"
              label="Fresh"
              checked={productFresh}
              onChange={(c) => onProductTypeChange('fresh', c)}
            />
            <FilterCheckbox
              id="pt-organic"
              label="Organic"
              checked={productOrganic}
              onChange={(c) => onProductTypeChange('organic', c)}
            />
            <FilterCheckbox
              id="pt-frozen"
              label="Frozen"
              checked={productFrozen}
              onChange={(c) => onProductTypeChange('frozen', c)}
            />
            <p className="text-grocery-500 text-xs">
              Matches keywords in the product name (e.g. organic, frozen).
            </p>
          </div>
        </div>

        <div>
          <FilterHeading>Availability</FilterHeading>
          <div className="mt-3 space-y-2.5">
            <FilterCheckbox
              id="av-in"
              label="In stock"
              checked={stockIn}
              onChange={(c) => onStockChange('in', c)}
            />
            <FilterCheckbox
              id="av-out"
              label="Out of stock"
              checked={stockOut}
              onChange={(c) => onStockChange('out', c)}
            />
          </div>
        </div>

        <div>
          <FilterHeading icon={<SmallBlueIcon />}>Search</FilterHeading>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              onSearchSubmit()
            }}
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your keyword…"
              className="border-grocery-200 focus:border-grocery-500 focus:ring-grocery-200 min-w-0 flex-1 rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2"
            />
            <button
              type="submit"
              className="bg-grocery-900 text-white hover:bg-grocery-800 flex shrink-0 items-center justify-center rounded-lg p-2.5 transition"
              aria-label="Search"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        <div>
          <FilterHeading icon={<SmallBlueIcon />}>Filter by price</FilterHeading>
          <p className="text-grocery-600 mt-3 text-sm">
            Your range:{' '}
            <span className="text-grocery-900 font-semibold">
              {gbp.format(priceRangeMin)} – {gbp.format(priceRangeMax)}
            </span>
          </p>
          <div className="mt-4 space-y-3">
            <label className="text-grocery-500 block text-xs font-medium">
              Min
              <input
                type="range"
                min={priceMinBound}
                max={rangeDisabled ? priceMinBound : priceMaxBound}
                step={1}
                value={Math.min(priceRangeMin, priceRangeMax)}
                disabled={rangeDisabled}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  onPriceRangeChange(Math.min(v, priceRangeMax), priceRangeMax)
                }}
                className="accent-sky-600 w-full"
              />
            </label>
            <label className="text-grocery-500 block text-xs font-medium">
              Max
              <input
                type="range"
                min={priceMinBound}
                max={rangeDisabled ? priceMaxBound : priceMaxBound}
                step={1}
                value={Math.max(priceRangeMin, priceRangeMax)}
                disabled={rangeDisabled}
                onChange={(e) => {
                  const v = Number(e.target.value)
                  onPriceRangeChange(priceRangeMin, Math.max(v, priceRangeMin))
                }}
                className="accent-sky-600 w-full"
              />
            </label>
            {rangeDisabled && (
              <p className="text-grocery-500 text-xs">Add products with prices to use the range filter.</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
