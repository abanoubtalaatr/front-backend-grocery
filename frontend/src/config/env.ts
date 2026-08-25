/** API origin without trailing slash. Set `VITE_API_BASE_URL` in `.env` / `.env.local`. */
const DEFAULT_API_BASE = 'https://grocery.newcinderella.online'

function stripTrailingSlash(url: string) {
  return url.replace(/\/$/, '')
}

function resolveApiBaseUrl(): string {
  const explicit = import.meta.env.VITE_API_BASE_URL
  if (explicit !== undefined && explicit !== '') {
    return stripTrailingSlash(explicit)
  }
  // Dev: relative `/api` → Vite proxy (vite.config.ts) so the browser stays same-origin.
  if (import.meta.env.DEV) {
    return ''
  }
  return DEFAULT_API_BASE
}

const apiBaseUrl = resolveApiBaseUrl()

/** Chat endpoint. In dev + mock mode, Vite runs Claude with the live product catalog. */
function resolveChatApiUrl(): string {
  const path = '/api/ai/chat'
  if (import.meta.env.DEV && import.meta.env.VITE_AI_MOCK !== 'false') {
    return path
  }
  if (apiBaseUrl) {
    return `${apiBaseUrl}${path}`
  }
  return path
}

export const env = {
  apiBaseUrl,
  chatApiUrl: resolveChatApiUrl(),
  /**
   * Backend Google OAuth entry endpoint (expects POST in this app).
   * Override with `VITE_GOOGLE_LOGIN_URL` when needed.
   */
  googleLoginUrl: stripTrailingSlash(
    import.meta.env.VITE_GOOGLE_LOGIN_URL || `${DEFAULT_API_BASE}/api/auth/google`,
  ),
} as const
