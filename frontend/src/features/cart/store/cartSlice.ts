import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { HotMeal } from '@/lib/api/mealsApi'
import { defaultCartLineId, type CartLine } from '@/features/cart/types'
import { loadCartLines } from '@/features/cart/utils/cartStorage'

export type CartState = {
  lines: CartLine[]
}

const initialState: CartState = {
  lines: loadCartLines(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(
      state,
      action: PayloadAction<{ meal: HotMeal; lineId?: string }>,
    ) {
      const { meal, lineId: rawLineId } = action.payload
      const id = rawLineId?.trim() || defaultCartLineId(meal)
      const idx = state.lines.findIndex((l) => l.lineId === id)
      if (idx >= 0) {
        const line = state.lines[idx]!
        state.lines[idx] = {
          ...line,
          quantity: line.quantity + 1,
          meal,
        }
      } else {
        state.lines.push({ lineId: id, meal, quantity: 1 })
      }
    },
    setQuantity(
      state,
      action: PayloadAction<{ lineId: string; quantity: number }>,
    ) {
      const { lineId, quantity } = action.payload
      if (!Number.isFinite(quantity) || quantity < 1) {
        state.lines = state.lines.filter((l) => l.lineId !== lineId)
        return
      }
      const q = Math.floor(quantity)
      for (let i = 0; i < state.lines.length; i++) {
        if (state.lines[i]!.lineId === lineId) {
          state.lines[i]!.quantity = q
          break
        }
      }
    },
    removeLine(state, action: PayloadAction<string>) {
      const lineId = action.payload
      state.lines = state.lines.filter((l) => l.lineId !== lineId)
    },
    clearCart(state) {
      state.lines = []
    },
  },
})

export const { addItem, setQuantity, removeLine, clearCart } =
  cartSlice.actions
export default cartSlice.reducer
