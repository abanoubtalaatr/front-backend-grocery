import type { UIMessage } from 'ai'
import { stripCartActions } from '@/features/ai/hooks/useGroceryChat'

export function getMessageText(message: UIMessage): string {
  if (!Array.isArray(message.parts)) {
    return ''
  }
  const raw = message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('')

  return message.role === 'assistant' ? stripCartActions(raw) : raw
}
