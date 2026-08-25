import type { ComponentType } from 'react'
import {
  IconBakery,
  IconDairy,
  IconFruit,
  IconGrid,
  IconMeat,
  IconSeafood,
  IconVeg,
} from '@/components/category/categoryIcons'

export function iconForCategoryLabel(
  label: string,
): ComponentType<{ className?: string }> {
  const l = label.toLowerCase()
  if (l.includes('fruit')) {
    return IconFruit
  }
  if (l.includes('veg')) {
    return IconVeg
  }
  if (l.includes('dairy') || l.includes('egg')) {
    return IconDairy
  }
  if (l.includes('baker') || l.includes('bread')) {
    return IconBakery
  }
  if (l.includes('sea') || l.includes('fish')) {
    return IconSeafood
  }
  if (l.includes('meat') || l.includes('chicken') || l.includes('poultry')) {
    return IconMeat
  }
  return IconGrid
}
