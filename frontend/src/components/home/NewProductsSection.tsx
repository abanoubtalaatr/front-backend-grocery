import { fetchNewProducts } from '@/lib/api/mealsApi'
import { ProductsSection } from '@/components/home/ProductsSection'

export function NewProductsSection() {
  return (
    <ProductsSection
      id="new-products"
      title="New Product"
      fetcher={fetchNewProducts}
      emptyMessage="No new products right now — check back soon."
      cartLinePrefix="new:"
    />
  )
}
