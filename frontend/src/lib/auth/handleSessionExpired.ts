import { paths } from '@/constants/paths'
import { clearStoredToken } from '@/lib/auth/authTokenStorage'

let redirecting = false

const AUTH_PATHS = [
  paths.login,
  paths.signUp,
  paths.forgotPassword,
  paths.verifyOtp,
  paths.resetPassword,
] as const

function appPathname(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const { pathname } = window.location
  if (base && pathname.startsWith(base)) {
    return pathname.slice(base.length) || '/'
  }
  return pathname
}

function isOnAuthRoute(): boolean {
  const path = appPathname()
  return AUTH_PATHS.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))
}

export function loginUrlWithExpiredSession(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}${paths.login}?session=expired`
}

/** Clear stored auth and send the user to login (once per page load). */
export function handleSessionExpired(): void {
  if (redirecting || typeof window === 'undefined' || isOnAuthRoute()) {
    return
  }
  redirecting = true
  clearStoredToken()
  window.location.replace(loginUrlWithExpiredSession())
}
