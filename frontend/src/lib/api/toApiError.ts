import axios from 'axios'
import { ApiError } from '@/lib/api/apiError'
import { getErrorMessageFromBody } from '@/lib/auth/parseApiResponse'

/**
 * Normalises anything a query/mutation can reject with into an {@link ApiError},
 * so `toastApiError` keeps its field-level `errors` rendering for axios calls too.
 */
export function toApiError(error: unknown, fallback = 'Something went wrong'): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0
    const body = error.response?.data
    return new ApiError(getErrorMessageFromBody(body, error.message || fallback), status, body)
  }

  if (error instanceof Error) {
    return new ApiError(error.message || fallback, 0, null)
  }

  return new ApiError(fallback, 0, null)
}
