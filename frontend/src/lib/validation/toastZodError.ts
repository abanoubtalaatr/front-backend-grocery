import { toast } from 'sonner'
import type { ZodError } from 'zod'

/** Shows the first validation message from a failed Zod parse. */
export function toastFirstZodIssue(error: ZodError) {
  const first = error.issues[0]
  toast.error(first?.message ?? 'Invalid input.')
}
