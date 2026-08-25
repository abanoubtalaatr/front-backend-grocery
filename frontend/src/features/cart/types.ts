import type { HotMeal } from '@/lib/api/mealsApi'

export type CartLine = {
  lineId: string
  meal: HotMeal
  quantity: number
}

export function defaultCartLineId(meal: HotMeal): string {
  return `${meal.id}::${meal.name.trim().toLowerCase()}`
}
