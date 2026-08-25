import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { useCart } from '@/features/cart/index'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

export function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, clearCart, subtotal } = useCart()

  if (lines.length === 0) {
    return <Navigate to={paths.cart} replace />
  }

  function placeOrder() {
    clearCart()
    toast.success('Order placed successfully.')
    navigate(paths.orderComplete, { replace: true })
  }

  return (
    <div className="bg-grocery-50/40 flex w-full flex-col">
      <div className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-grocery-600 text-sm">
            <Link to={paths.cart} className="text-grocery-900 font-medium underline">
              ← Back to cart
            </Link>
          </p>
          <h1 className="text-grocery-900 mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Checkout
          </h1>
          <p className="text-grocery-600 mt-1 text-sm">
            Confirm your order. Payment and delivery will connect to your backend later.
          </p>

          <div className="border-grocery-100 bg-white mt-8 rounded-2xl border p-6 shadow-sm">
            <h2 className="text-grocery-900 text-sm font-semibold">Order summary</h2>
            <ul className="mt-4 divide-y divide-grocery-100">
              {lines.map((line) => (
                <li
                  key={line.lineId}
                  className="text-grocery-700 flex justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"
                >
                  <span className="min-w-0">
                    <span className="font-medium text-grocery-900">{line.meal.name}</span>
                    <span className="text-grocery-500"> × {line.quantity}</span>
                  </span>
                  <span className="shrink-0 tabular-nums">
                    {line.meal.price != null && Number.isFinite(line.meal.price)
                      ? gbp.format(line.meal.price * line.quantity)
                      : '—'}
                  </span>
                </li>
              ))}
            </ul>
            <div className="border-grocery-100 mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-grocery-800 font-semibold">Total</span>
              <span className="text-grocery-900 text-lg font-bold tabular-nums">
                {gbp.format(subtotal)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            className="mt-8 h-11"
            onClick={placeOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  )
}
