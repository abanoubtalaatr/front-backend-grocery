import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { paths } from '@/constants/paths'
import { getStoredToken } from '@/lib/auth/authTokenStorage'

type RequireGuestProps = {
  children: ReactNode
}

/**
 * Renders children only when there is no auth token; otherwise redirects (e.g. away from login).
 */
export function RequireGuest({ children }: RequireGuestProps) {
  if (getStoredToken()) {
    return <Navigate to={paths.home} replace />
  }

  return <>{children}</>
}
