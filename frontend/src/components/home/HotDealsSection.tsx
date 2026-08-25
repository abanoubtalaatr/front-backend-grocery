import { fetchHotMeals } from '@/lib/api/mealsApi'
import { ProductsSection } from '@/components/home/ProductsSection'

export function HotDealsSection() {
  return (
    <ProductsSection
      id="hot-deals"
      title="Hot Deals"
      fetcher={fetchHotMeals}
      emptyMessage="No hot deals yet — check back soon."
      cartLinePrefix="hot:"
    />
  )
}
