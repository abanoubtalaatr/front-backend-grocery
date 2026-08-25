import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { paths } from '@/constants/paths'
import { apiClient } from '@/lib/api/httpClient'
import { getStoredToken } from '@/lib/auth/authTokenStorage'

type MeResponse = {
  data?: {
    user?: {
      id: number
      username: string
      email: string
      is_admin?: boolean
    }
  }
}

/**
 * Gate for `/dashboard`.
 *
 * Admin-ness is confirmed against the API rather than a stored flag — the token
 * is the only thing a browser can be trusted with, and the admin endpoints
 * enforce it again server-side anyway.
 */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const hasToken = Boolean(getStoredToken())

  const { data, isPending, isError } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await apiClient.get<MeResponse>('/api/auth/me')
      return res.data.data?.user ?? null
    },
    enabled: hasToken,
    staleTime: 5 * 60_000,
    retry: false,
  })

  if (!hasToken) {
    return <Navigate to={paths.login} replace />
  }

  if (isPending) {
    return (
      <div className="grid min-h-svh w-full place-items-center">
        <span
          className="border-grocery-200 border-t-grocery-900 h-8 w-8 animate-spin rounded-full border-2"
          aria-label="Loading"
        />
      </div>
    )
  }

  if (isError || !data) {
    return <Navigate to={paths.login} replace />
  }

  if (!data.is_admin) {
    return (
      <div className="grid min-h-svh w-full place-items-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-grocery-900 text-xl font-semibold">Admin access required</h1>
          <p className="text-grocery-500 mt-2 text-sm">
            This account cannot open the dashboard. Sign in with an admin account or head back to
            the store.
          </p>
          <a
            href={paths.home}
            className="bg-grocery-900 hover:bg-grocery-800 mt-6 inline-flex h-11 items-center rounded-[10px] px-5 text-sm font-medium text-white transition"
          >
            Back to store
          </a>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
