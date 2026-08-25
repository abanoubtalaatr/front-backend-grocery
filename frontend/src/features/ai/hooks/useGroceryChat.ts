import { useEffect, useMemo, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { toast } from 'sonner'
import { env } from '@/config/env'
import { useCart, selectCartLines } from '@/features/cart/index'
import { useAppSelector } from '@/store/hooks'
import type { HotMeal } from '@/lib/api/mealsApi'

type CartActionAdd = {
  type: 'add'
  id: string | number
  name: string
  price: number
  imageUrl?: string | null
  category?: string
  rating?: number
}
type CartActionRemove = { type: 'remove'; id: string | number; name?: string }
type CartActionClear = { type: 'clear' }
type CartAction = CartActionAdd | CartActionRemove | CartActionClear

/** Extracts all <cart_action>…</cart_action> blocks from a string. */
export function parseCartActions(text: string): CartAction[] {
  const results: CartAction[] = []
  // Match both raw tags and tags that Claude may have wrapped in code fences
  const re = /(?:```[^\n]*\n)?<cart_action>([\s\S]*?)<\/cart_action>(?:\n```)?/g
  let match
  while ((match = re.exec(text)) !== null) {
    try {
      const action = JSON.parse(match[1]!.trim()) as CartAction
      if (action && typeof action.type === 'string') {
        results.push(action)
      }
    } catch {
      // malformed — skip
    }
  }
  return results
}

/** Strips all <cart_action> blocks (and surrounding code fences) from text. */
export function stripCartActions(text: string): string {
  return text
    .replace(/```[^\n]*\n<cart_action>[\s\S]*?<\/cart_action>\n```/g, '')
    .replace(/<cart_action>[\s\S]*?<\/cart_action>/g, '')
    .trim()
}

function buildMeal(a: CartActionAdd): HotMeal {
  return {
    id: String(a.id),
    name: a.name,
    description: null,
    imageUrl: a.imageUrl ?? null,
    categoryLabel: a.category ?? 'Grocery',
    vendorLabel: 'Grocery+',
    rating: a.rating ?? 0,
    ratingCount: 0,
    price: typeof a.price === 'number' ? a.price : null,
    compareAtPrice: null,
  }
}

/** Chat with Claude with live cart integration via <cart_action> tags. */
export function useGroceryChat() {
  const api = useMemo(() => env.chatApiUrl, [])
  const { addItem, removeLine, clearCart } = useCart()
  const lines = useAppSelector(selectCartLines)
  const transport = useMemo(() => new DefaultChatTransport({ api }), [api])

  // Keep refs so the effect always sees the latest cart state without re-creating useChat
  const addItemRef = useRef(addItem)
  const removeLineRef = useRef(removeLine)
  const clearCartRef = useRef(clearCart)
  const linesRef = useRef(lines)
  addItemRef.current = addItem
  removeLineRef.current = removeLine
  clearCartRef.current = clearCart
  linesRef.current = lines

  const chat = useChat({ transport })

  // Track which message IDs we've already processed to avoid double execution
  const processedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    const msgs = chat.messages
    const last = msgs[msgs.length - 1]
    if (!last || last.role !== 'assistant') return
    if (processedIds.current.has(last.id)) return

    // Only process when message is complete (not streaming)
    if (chat.status === 'streaming' || chat.status === 'submitted') return

    // Get raw text (with action tags still present)
    const rawText = Array.isArray((last as { parts?: unknown[] }).parts)
      ? (last as { parts: Array<{ type: string; text?: string }> }).parts
          .filter((p) => p.type === 'text')
          .map((p) => p.text ?? '')
          .join('')
      : ''

    const actions = parseCartActions(rawText)
    if (actions.length === 0) return

    processedIds.current.add(last.id)

    for (const action of actions) {
      if (action.type === 'add') {
        const meal = buildMeal(action)
        addItemRef.current(meal, `chat:${meal.id}`)
        toast.success(`✓ ${meal.name} added to cart`, {
          description: `£${meal.price?.toFixed(2) ?? '—'}`,
          duration: 3500,
        })
      } else if (action.type === 'remove') {
        const productId = String(action.id)
        const line = linesRef.current.find(
          (l) => l.meal.id === productId || l.lineId === `chat:${productId}`,
        )
        if (line) {
          removeLineRef.current(line.lineId)
          toast.success(`✓ ${action.name ?? 'Item'} removed from cart`)
        } else {
          toast.error('Item not found in cart')
        }
      } else if (action.type === 'clear') {
        clearCartRef.current()
        toast.success('Cart cleared')
      }
    }
  }, [chat.messages, chat.status])

  return chat
}
