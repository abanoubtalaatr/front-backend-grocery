import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'

export const selectCartLines = (state: RootState) => state.cart.lines

export const selectTotalQuantity = createSelector(selectCartLines, (lines) =>
  lines.reduce((s, l) => s + l.quantity, 0),
)

export const selectSubtotal = createSelector(selectCartLines, (lines) =>
  lines.reduce((sum, l) => {
    const p = l.meal.price
    if (p == null || !Number.isFinite(p)) {
      return sum
    }
    return sum + p * l.quantity
  }, 0),
)
