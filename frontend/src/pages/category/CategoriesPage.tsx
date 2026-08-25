import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryFilterSidebar, type CategoryRow } from '@/components/category/CategoryFilterSidebar'
import { IconGrid } from '@/components/category/categoryIcons'
import { iconForCategoryLabel } from '@/components/category/categoryFilterUtils'
import { ProductCard } from '@/components/home/ProductCard'
import { HomeBenefitsStrip } from '@/components/layout/HomeBenefitsStrip'
import { paths } from '@/constants/paths'
import {
  type CatalogProduct,
  fetchBestSells,
  fetchHotMeals,
  fetchNewProducts,
} from '@/lib/api/mealsApi'

type SourceType = 'hot' | 'new' | 'best'

type CatalogItem = CatalogProduct & { source: SourceType }

function dedupeById(items: CatalogItem[]) {
  const seen = new Set<string>()
  return items.filter((item) => {
    const key = `${item.id}:${item.name.toLowerCase()}`
    if (seen.has(key)) {
      return false
    }
    seen.add(key)
    return true
  })
}

function matchesProductType(
  item: CatalogItem,
  fresh: boolean,
  organic: boolean,
  frozen: boolean,
): boolean {
  if (!fresh && !organic && !frozen) {
    return true
  }
  const n = item.name.toLowerCase()
  const hitFresh = !/frozen/.test(n)
  const hitOrganic = /organic/.test(n)
  const hitFrozen = /frozen/.test(n)
  return (
    (fresh && hitFresh) || (organic && hitOrganic) || (frozen && hitFrozen)
  )
}

function passesStockFilter(
  item: CatalogItem,
  stockIn: boolean,
  stockOut: boolean,
): boolean {
  if (!stockIn && !stockOut) {
    return true
  }
  const hasPrice = item.price != null && Number.isFinite(item.price)
  if (stockIn && stockOut) {
    return true
  }
  if (stockIn) {
    return hasPrice
  }
  return !hasPrice
}

function passesPriceRange(
  item: CatalogItem,
  min: number,
  max: number,
  boundMin: number,
  boundMax: number,
): boolean {
  const fullRange = min <= boundMin && max >= boundMax
  if (item.price == null || !Number.isFinite(item.price)) {
    return fullRange
  }
  return item.price >= min && item.price <= max
}

export function CategoriesPage() {
  const [allItems, setAllItems] = useState<CatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [productFresh, setProductFresh] = useState(false)
  const [productOrganic, setProductOrganic] = useState(false)
  const [productFrozen, setProductFrozen] = useState(false)
  const [stockIn, setStockIn] = useState(true)
  const [stockOut, setStockOut] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  /** When `null`, min/max follow catalog bounds. After the user drags sliders, we store overrides. */
  const [userPriceRange, setUserPriceRange] = useState<{
    min: number
    max: number
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      setLoading(true)
      setError(null)

      const [hotResult, newResult, bestResult] = await Promise.allSettled([
        fetchHotMeals(),
        fetchNewProducts(),
        fetchBestSells(),
      ])

      if (cancelled) {
        return
      }

      const merged: CatalogItem[] = []

      if (hotResult.status === 'fulfilled') {
        hotResult.value.forEach((item) => merged.push({ ...item, source: 'hot' }))
      }
      if (newResult.status === 'fulfilled') {
        newResult.value.forEach((item) => merged.push({ ...item, source: 'new' }))
      }
      if (bestResult.status === 'fulfilled') {
        bestResult.value.forEach((item) => merged.push({ ...item, source: 'best' }))
      }

      if (
        hotResult.status === 'rejected' &&
        newResult.status === 'rejected' &&
        bestResult.status === 'rejected'
      ) {
        setError('Could not load categories right now. Please try again in a moment.')
        setAllItems([])
      } else {
        setAllItems(dedupeById(merged))
      }

      setLoading(false)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  const categoryOptions = useMemo(() => {
    const dynamic = Array.from(
      new Set(
        allItems
          .map((item) => item.categoryLabel.trim())
          .filter((label) => label.length > 0),
      ),
    )
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 12)

    return ['All', ...dynamic]
  }, [allItems])

  const categoryRows = useMemo((): CategoryRow[] => {
    const rows: CategoryRow[] = [{ value: 'all', label: 'All', icon: IconGrid }]
    for (const label of categoryOptions) {
      if (label === 'All') {
        continue
      }
      const value = label.toLowerCase()
      const Icon = iconForCategoryLabel(label)
      rows.push({ value, label, icon: Icon })
    }
    return rows
  }, [categoryOptions])

  const brandOptions = useMemo(() => {
    const set = new Set<string>()
    for (const item of allItems) {
      const v = item.vendorLabel.replace(/^By\s+/i, '').trim()
      if (v) {
        set.add(v)
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b)).slice(0, 8)
  }, [allItems])

  const { priceMinBound, priceMaxBound } = useMemo(() => {
    const prices = allItems
      .map((i) => i.price)
      .filter((n): n is number => n != null && Number.isFinite(n))
    if (prices.length === 0) {
      return { priceMinBound: 0, priceMaxBound: 0 }
    }
    const lo = Math.floor(Math.min(...prices))
    const hi = Math.ceil(Math.max(...prices))
    return { priceMinBound: lo, priceMaxBound: Math.max(lo + 1, hi) }
  }, [allItems])

  const priceRangeMin = userPriceRange?.min ?? priceMinBound
  const priceRangeMax = userPriceRange?.max ?? priceMaxBound

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return allItems.filter((item) => {
      if (activeCategory !== 'all') {
        if (item.categoryLabel.toLowerCase() !== activeCategory) {
          return false
        }
      }
      if (q && !item.name.toLowerCase().includes(q)) {
        return false
      }
      if (selectedBrands.length > 0) {
        const v = item.vendorLabel.replace(/^By\s+/i, '').trim()
        if (!selectedBrands.some((b) => v.toLowerCase() === b.toLowerCase())) {
          return false
        }
      }
      if (
        !matchesProductType(item, productFresh, productOrganic, productFrozen)
      ) {
        return false
      }
      if (!passesStockFilter(item, stockIn, stockOut)) {
        return false
      }
      if (
        !passesPriceRange(
          item,
          priceRangeMin,
          priceRangeMax,
          priceMinBound,
          priceMaxBound,
        )
      ) {
        return false
      }
      return true
    })
  }, [
    allItems,
    activeCategory,
    searchQuery,
    selectedBrands,
    productFresh,
    productOrganic,
    productFrozen,
    stockIn,
    stockOut,
    priceRangeMin,
    priceRangeMax,
    priceMinBound,
    priceMaxBound,
  ])

  function onBrandToggle(brand: string, selected: boolean) {
    setSelectedBrands((prev) =>
      selected ? [...prev, brand] : prev.filter((b) => b !== brand),
    )
  }

  function onProductTypeChange(
    key: 'fresh' | 'organic' | 'frozen',
    value: boolean,
  ) {
    if (key === 'fresh') {
      setProductFresh(value)
    } else if (key === 'organic') {
      setProductOrganic(value)
    } else {
      setProductFrozen(value)
    }
  }

  function onStockChange(key: 'in' | 'out', value: boolean) {
    if (key === 'in') {
      setStockIn(value)
    } else {
      setStockOut(value)
    }
  }

  function onPriceRangeChange(min: number, max: number) {
    const lo = priceMinBound
    const hi = priceMaxBound
    let a = Math.min(min, max)
    let b = Math.max(min, max)
    a = Math.max(lo, Math.min(a, hi))
    b = Math.max(lo, Math.min(b, hi))
    if (a > b) {
      ;[a, b] = [b, a]
    }
    setUserPriceRange({ min: a, max: b })
  }

  return (
    <div className="bg-white flex w-full flex-col">
      <div className="flex-1">
        <section
          className="relative isolate overflow-hidden px-4 py-16 md:py-20 h-[400px] md:h-auto"
          style={{
            backgroundImage: `url(${import.meta.env.BASE_URL.replace(/\/$/, '')}/categories-hero.jpg)`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '400px',
          }}
          aria-labelledby="categories-hero-title"
        >
          <div
            className="absolute inset-0 -z-10"
            style={{ backgroundColor: '#232832C7' }}
            aria-hidden
          />
          <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="text-sm font-semibold text-white">
              <Link to={paths.home} className="hover:text-sky-300 transition">
                Home
              </Link>
              <span className="mx-2 text-white/60">/</span>
              <span className="text-sky-300">Shop</span>
            </p>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white/90">
                WELCOME TO OUR COMPANY
              </p>
              <h1
                id="categories-hero-title"
                className="mt-2 text-5xl font-bold text-[#00A6FF] md:text-6xl"
              >
                Shop
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-grocery-50/40 border-grocery-100 border-b px-4 py-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-grocery-900 text-2xl font-bold tracking-tight md:text-3xl">
              Shop by category
            </h2>
            <p className="text-grocery-600 mt-1 text-sm">
              Use the filters to narrow products from hot deals, new arrivals, and
              best sellers.
            </p>

            <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
              <CategoryFilterSidebar
                categoryRows={categoryRows}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                brandOptions={brandOptions}
                selectedBrands={selectedBrands}
                onBrandToggle={onBrandToggle}
                productFresh={productFresh}
                productOrganic={productOrganic}
                productFrozen={productFrozen}
                onProductTypeChange={onProductTypeChange}
                stockIn={stockIn}
                stockOut={stockOut}
                onStockChange={onStockChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={() => undefined}
                priceMinBound={priceMinBound}
                priceMaxBound={priceMaxBound}
                priceRangeMin={priceRangeMin}
                priceRangeMax={priceRangeMax}
                onPriceRangeChange={onPriceRangeChange}
              />

              <div className="min-w-0 flex-1">
                {loading && (
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <li
                        key={i}
                        className="border-grocery-100 bg-white rounded-2xl border p-3 shadow-sm"
                      >
                        <div className="bg-grocery-100 aspect-square w-full animate-pulse rounded-xl" />
                        <div className="bg-grocery-100 mt-3 h-3 w-1/3 animate-pulse rounded" />
                        <div className="bg-grocery-100 mt-2 h-4 w-4/5 animate-pulse rounded" />
                        <div className="bg-grocery-100 mt-3 h-9 w-full animate-pulse rounded-lg" />
                      </li>
                    ))}
                  </ul>
                )}

                {!loading && error && (
                  <p className="text-grocery-600 text-sm">{error}</p>
                )}

                {!loading && !error && filteredItems.length === 0 && (
                  <p className="text-grocery-600 text-sm">
                    No products match your filters. Try clearing some options.
                  </p>
                )}

                {!loading && filteredItems.length > 0 && (
                  <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
                    {filteredItems.map((item) => (
                      <li key={`${item.source}-${item.id}`}>
                        <ProductCard meal={item} cartLineId={`${item.source}:${item.id}`} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
      <HomeBenefitsStrip />
    </div>
  )
}
