import { useCallback } from 'react'
import type { CartContextValue } from '@/features/cart/cartContext'
import {
  addItem as addItemAction,
  setQuantity as setQuantityAction,
  removeLine as removeLineAction,
  clearCart as clearCartAction,
} from '@/features/cart/store/cartSlice'
import {
  selectCartLines,
  selectSubtotal,
  selectTotalQuantity,
} from '@/features/cart/store/cartSelectors'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { HotMeal } from '@/lib/api/mealsApi'

export function useCart(): CartContextValue {
  const dispatch = useAppDispatch()
  const lines = useAppSelector(selectCartLines)
  const totalQuantity = useAppSelector(selectTotalQuantity)
  const subtotal = useAppSelector(selectSubtotal)

  const addItem = useCallback(
    (meal: HotMeal, lineId?: string) => {
      dispatch(addItemAction({ meal, lineId }))
    },
    [dispatch],
  )

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => {
      dispatch(setQuantityAction({ lineId, quantity }))
    },
    [dispatch],
  )

  const removeLine = useCallback(
    (lineId: string) => {
      dispatch(removeLineAction(lineId))
    },
    [dispatch],
  )

  const clearCart = useCallback(() => {
    dispatch(clearCartAction())
  }, [dispatch])

  return {
    lines,
    addItem,
    setQuantity,
    removeLine,
    clearCart,
    totalQuantity,
    subtotal,
  }
}
