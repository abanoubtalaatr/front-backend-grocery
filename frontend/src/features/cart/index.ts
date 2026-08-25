export { default as cartReducer } from '@/features/cart/store/cartSlice'
export { addItem, setQuantity, removeLine, clearCart } from '@/features/cart/store/cartSlice'
export {
  selectCartLines,
  selectTotalQuantity,
  selectSubtotal,
} from '@/features/cart/store/cartSelectors'
export { useCart } from '@/features/cart/hooks/useCart'
export type { CartLine } from '@/features/cart/types'
