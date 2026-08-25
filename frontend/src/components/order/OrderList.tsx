import { useEffect, useState } from 'react'
import { Order, type OrderDto } from './Order'
import { apiClient } from '@/lib/api/httpClient'

export function OrderList() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchOrders() {
      setLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<{ data?: OrderDto[] }>('/api/orders')
        if (!cancelled) {
          setOrders(Array.isArray(response.data?.data) ? response.data.data : [])
        }
      } catch {
        if (!cancelled) {
          setError('Could not load orders right now.')
          setOrders([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void fetchOrders()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8">
      <h1 className="text-grocery-900 text-2xl font-bold">Order list</h1>
      <p className="text-grocery-500 mt-1 text-sm">Track your latest orders and totals.</p>

      {loading && <p className="text-grocery-500 mt-6 text-sm">Loading orders...</p>}
      {!loading && error && <p className="mt-6 text-sm text-rose-600">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-grocery-500 mt-6 text-sm">No orders found.</p>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="mt-6 space-y-4 flex gap-1">
          {orders.map((order) => (
            <Order key={order.id} order={order} />
          ))}
        </div>
      )}
    </section>
  )
}