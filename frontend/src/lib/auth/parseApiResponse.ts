type JsonRecord = Record<string, unknown>

/**
 * Picks a bearer token from common API shapes (Laravel / Sanctum, etc.).
 */
export function extractAccessToken(data: unknown): string | null {
  if (data == null || typeof data !== 'object') {
    return null
  }
  const o = data as JsonRecord

  const from = (x: unknown): string | null => {
    if (x == null || typeof x !== 'object') {
      return null
    }
    const r = x as JsonRecord
    if (typeof r.token === 'string') {
      return r.token
    }
    if (typeof r.access_token === 'string') {
      return r.access_token
    }
    if (typeof r.plainTextToken === 'string') {
      return r.plainTextToken
    }
    if (typeof r.accessToken === 'string') {
      return r.accessToken
    }
    if (r.data) {
      return from(r.data)
    }
    return null
  }

  return from(o) ?? (typeof o.data === 'object' ? from(o.data) : null)
}

/** Normalized user from Laravel-style auth payloads. */
export type AuthUser = {
  id: number
  username: string
  email: string
  phone: string
}

/**
 * Reads `user` from common shapes: `{ user }`, `{ data: { user } }`.
 */
export function extractUserFromAuthResponse(data: unknown): AuthUser | null {
  if (data == null || typeof data !== 'object') {
    return null
  }
  const o = data as JsonRecord
  let userUnknown: unknown = o.user
  if (userUnknown == null && o.data != null && typeof o.data === 'object') {
    userUnknown = (o.data as JsonRecord).user
  }
  if (userUnknown == null || typeof userUnknown !== 'object' || Array.isArray(userUnknown)) {
    return null
  }
  const u = userUnknown as JsonRecord
  const idRaw = u.id
  const id = typeof idRaw === 'number' ? idRaw : Number(idRaw)
  if (!Number.isFinite(id)) {
    return null
  }
  const username = typeof u.username === 'string' ? u.username.trim() : ''
  const email = typeof u.email === 'string' ? u.email.trim() : ''
  const phone = typeof u.phone === 'string' ? u.phone.trim() : ''
  if (!username && !email) {
    return null
  }
  return { id, username, email, phone }
}

function humanizeField(field: string) {
  return field
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Collects every message from Laravel-style `errors: { field: string[] | string }`.
 * Prefer this for UI; use {@link getErrorMessageFromBody} for a single string (e.g. thrown errors).
 */
export function collectValidationMessages(data: unknown): string[] {
  if (data == null || typeof data !== 'object') {
    return []
  }
  const errors = (data as JsonRecord).errors
  if (errors == null || typeof errors !== 'object' || Array.isArray(errors)) {
    return []
  }
  const out: string[] = []
  for (const [field, value] of Object.entries(errors as Record<string, unknown>)) {
    const label = humanizeField(field)
    if (Array.isArray(value)) {
      for (const msg of value) {
        if (typeof msg === 'string' && msg.trim()) {
          out.push(`${label}: ${msg.trim()}`)
        }
      }
    } else if (typeof value === 'string' && value.trim()) {
      out.push(`${label}: ${value.trim()}`)
    }
  }
  return out
}

/**
 * Prefer field-level `errors` over generic `message` (e.g. "Validation failed").
 */
export function getErrorMessageFromBody(data: unknown, fallback: string) {
  const lines = collectValidationMessages(data)
  if (lines.length > 0) {
    return lines.join('\n')
  }
  if (data != null && typeof data === 'object') {
    const o = data as JsonRecord
    const msg = typeof o.message === 'string' ? o.message.trim() : ''
    const err = typeof o.error === 'string' ? o.error.trim() : ''
    if (msg && err) {
      return `${msg} — ${err}`
    }
    if (err) {
      return err
    }
    if (msg) {
      return msg
    }
  }
  return fallback
}
