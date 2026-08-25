import type { HotMeal } from '@/lib/api/mealsApi'
import type { CartLine } from '@/features/cart/types'

/** Shape of cart state + actions returned by `useCart` (backed by Redux). */
export type CartContextValue = {
  lines: CartLine[]
  addItem: (meal: HotMeal, lineId?: string) => void
  setQuantity: (lineId: string, quantity: number) => void
  removeLine: (lineId: string) => void
  clearCart: () => void
  totalQuantity: number
  subtotal: number
}
