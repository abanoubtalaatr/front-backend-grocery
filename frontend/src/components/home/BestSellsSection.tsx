import { fetchBestSells } from '@/lib/api/mealsApi'
import { ProductsSection } from '@/components/home/ProductsSection'

export function BestSellsSection() {
  return (
    <ProductsSection
      id="best-sells"
      title="Daily Best Sells"
      fetcher={fetchBestSells}
      emptyMessage="No best sells available yet."
      cartLinePrefix="best:"
    />
  )
}
