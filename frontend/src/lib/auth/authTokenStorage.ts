import type { AuthUser } from '@/lib/auth/parseApiResponse'

const TOKEN_KEY = 'grocery:auth_token'
const USER_KEY = 'grocery:auth_user'

export function getStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY)
  clearStoredUser()
}

function isAuthUser(x: unknown): x is AuthUser {
  if (x == null || typeof x !== 'object') {
    return false
  }
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'number' &&
    typeof o.username === 'string' &&
    typeof o.email === 'string' &&
    typeof o.phone === 'string'
  )
}

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    return isAuthUser(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function setStoredUser(user: AuthUser) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    /* quota / private mode */
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(USER_KEY)
  } catch {
    /* ignore */
  }
}

/** First line of header / profile: username, else email local-part, else fallback. */
export function getAuthDisplayName(fallback = 'Profile'): string {
  const u = getStoredUser()
  if (!u) {
    return fallback
  }

  if (u.username.trim()) {
    
    return u.username
  }
  const local = u.email.split('@')[0]?.trim()
  if (local) {
    return local
  }
  return fallback
}
