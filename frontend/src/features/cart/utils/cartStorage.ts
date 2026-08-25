import { storageKeys } from '@/constants/storageKeys'
import type { CartLine } from '@/features/cart/types'
import type { HotMeal } from '@/lib/api/mealsApi'

function isHotMeal(x: unknown): x is HotMeal {
  if (x == null || typeof x !== 'object' || Array.isArray(x)) {
    return false
  }
  const o = x as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.name === 'string'
}

function normalizeLine(raw: unknown): CartLine | null {
  if (raw == null || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const o = raw as Record<string, unknown>
  const lineId = typeof o.lineId === 'string' ? o.lineId : ''
  const quantity = typeof o.quantity === 'number' && Number.isFinite(o.quantity) ? Math.floor(o.quantity) : 0
  const meal = o.meal
  if (!lineId || quantity < 1 || !isHotMeal(meal)) {
    return null
  }
  return {
    lineId,
    meal,
    quantity,
  }
}

export function loadCartLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(storageKeys.cart)
    if (!raw) {
      return []
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }
    const out: CartLine[] = []
    for (const row of parsed) {
      const line = normalizeLine(row)
      if (line) {
        out.push(line)
      }
    }
    return out
  } catch {
    return []
  }
}

export function saveCartLines(lines: CartLine[]) {
  try {
    localStorage.setItem(storageKeys.cart, JSON.stringify(lines))
  } catch {
    /* ignore quota / private mode */
  }
}
