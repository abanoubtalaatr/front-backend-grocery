import axios from 'axios'
import { env } from '@/config/env'
import { handleSessionExpired } from '@/lib/auth/handleSessionExpired'
import { getStoredToken } from '@/lib/auth/authTokenStorage'

function createBaseClient() {
  return axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
      Accept: 'application/json',
    },
  })
}

/**
 * Login/register/forgot-password — no `Authorization` header so a stale stored
 * token cannot affect auth endpoints (same as the previous plain `fetch` usage).
 */
export const publicApiClient = createBaseClient()

/**
 * Authenticated API calls. Sends `Bearer` when a token exists.
 */
export const apiClient = createBaseClient()

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      handleSessionExpired()
    }
    return Promise.reject(error)
  },
)
