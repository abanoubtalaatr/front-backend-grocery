import { toast } from 'sonner'
import type { ApiError } from '@/lib/api/apiError'
import { collectValidationMessages } from '@/lib/auth/parseApiResponse'

/**
 * Shows API validation lines in the toast description when `errors` is present.
 */
export function toastApiError(err: ApiError, title = 'Something went wrong') {
  const lines = collectValidationMessages(err.body)
  if (lines.length > 0) {
    toast.error(title, {
      description: lines.join('\n'),
      classNames: {
        description: '!whitespace-pre-wrap !text-left !text-sm',
      },
    })
    return
  }
  toast.error(err.message)
}
