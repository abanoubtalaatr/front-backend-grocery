import { apiClient } from '@/lib/api/httpClient'
import { getStoredUser } from '@/lib/auth/authTokenStorage'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

/** Prefer nested `overview` object; otherwise treat the payload as the metrics object. */
function getDashboardMetrics(payload: unknown): Record<string, unknown> | null {
  if (payload == null || typeof payload !== 'object') {
    return null
  }
  const p = payload as Record<string, unknown>
  const ov = p.overview
  if (ov != null && typeof ov === 'object' && !Array.isArray(ov)) {
    return ov as Record<string, unknown>
  }
  return p as Record<string, unknown>
}

export function DashboardPage() {
  const user = getStoredUser()

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await apiClient.get<unknown>('/api/dashboard')
      return res.data
    },
  })

  if (isPending) {
    return <p className="text-grocery-600 text-sm">Loading…</p>
  }

  if (isError) {
    const msg = axios.isAxiosError(error)
      ? error.response?.status === 401
        ? 'Unauthorized — try signing in again.'
        : (error.response?.data as { message?: string } | undefined)?.message ??
          error.message
      : error instanceof Error
        ? error.message
        : 'Could not load dashboard.'
    return (
      <p className="text-red-600 text-sm" role="alert">
        {msg}
      </p>
    )
  }

  const metrics = getDashboardMetrics(data)
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : Number(v)) || 0

  return (
    <div className="space-y-2">
      <div className="bg-[#014162] flex w-full flex-col rounded-lg p-4 text-white">
        <div>
          <h2 className="text-xl font-bold">
            Welcome back, {user?.username?.trim() || user?.email || 'Member'}
          </h2>
          <p className="text-sm">Here&apos;s what&apos;s happening with your grocery shopping.</p>
        </div>
        <div className="my-4 flex gap-4 p-4">
          <div className="flex-1 rounded-lg border border-white/20 bg-[#F7FCFF] p-5 text-black">
            <div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M19.8801 7.07733L11.9991 11.8093M4.98708 17.4513L10.7371 20.8993C11.1182 21.1284 11.5544 21.2494 11.9991 21.2494C12.4437 21.2494 12.88 21.1284 13.2611 20.8993L19.0111 17.4513C19.3771 17.2323 19.6811 16.9213 19.8911 16.5503C20.0961 16.1803 20.2061 15.7643 20.2091 15.3403V8.27733C20.2109 7.85005 20.1014 7.42966 19.8913 7.05757C19.6812 6.68549 19.3779 6.37453 19.0111 6.15533L13.2611 3.09033C12.8779 2.86743 12.4424 2.75 11.9991 2.75C11.5557 2.75 11.1203 2.86743 10.7371 3.09033L4.98708 6.15533C4.62045 6.37445 4.31718 6.68524 4.10712 7.05714C3.89706 7.42904 3.78745 7.84922 3.78908 8.27633V15.3413C3.79208 15.7643 3.90208 16.1803 4.10708 16.5503C4.31708 16.9213 4.62108 17.2323 4.98708 17.4513Z"
                  stroke="#014162"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.11719 7.07553L11.9982 11.8075V21.2475M16.3782 12.9315V9.17653L8.06419 4.51953"
                  stroke="#014162"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <h3>Tracked Orders</h3>
              <p>{num(metrics?.tracking_order)}</p>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-white/20 bg-[#F7FCFF] p-4 text-black">
            <div>icon</div>
            <div>
              <h3>Loyalty Points</h3>
              <p>{num(metrics?.loyalty_points)}</p>
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-white/20 bg-[#F7FCFF] p-4 text-black">
            <div>icon</div>
            <div>
              <h3>
                {typeof metrics?.store_name === 'string' && metrics.store_name.trim()
                  ? metrics.store_name
                  : 'Store'}
              </h3>
              <p>{num(metrics?.store_credits)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
