import { isAnyOf, type Middleware } from '@reduxjs/toolkit'
import {
  addItem,
  setQuantity,
  removeLine,
  clearCart,
} from '@/features/cart/index'
import { saveCartLines } from '@/features/cart/utils/cartStorage'

export const cartPersistenceMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action)
  if (isAnyOf(addItem, setQuantity, removeLine, clearCart)(action)) {
    saveCartLines(store.getState().cart.lines)
  }
  return result
}
