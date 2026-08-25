import { Link } from 'react-router-dom'
import { paths } from '@/constants/paths'
import { useCart } from '@/features/cart/index'

const gbp = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

function formatPrice(n: number | null): string {
  if (n == null || !Number.isFinite(n)) {
    return '—'
  }
  return gbp.format(n)
}

export function CartPage() {
  const { lines, setQuantity, removeLine, subtotal } = useCart()

  return (
    <div className="bg-grocery-50/40 flex min-h-svh w-full flex-col">
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-grocery-900 text-2xl font-bold tracking-tight md:text-3xl">
            My cart
          </h1>
          <p className="text-grocery-600 mt-1 text-sm">
            Review items and proceed to checkout when you&apos;re ready.
          </p>

          {lines.length === 0 ? (
            <div className="border-grocery-100 bg-white mt-8 rounded-2xl border p-10 text-center shadow-sm">
              <p className="text-grocery-600 text-sm">Your cart is empty.</p>
              <Link
                to={paths.home}
                className="text-grocery-900 mt-4 inline-block text-sm font-semibold underline"
              >
                Continue shopping
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-8 space-y-4">
                {lines.map((line) => {
                  const unit = line.meal.price
                  const lineTotal =
                    unit != null && Number.isFinite(unit)
                      ? unit * line.quantity
                      : null
                  return (
                    <li
                      key={line.lineId}
                      className="border-grocery-100 bg-white flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 gap-4">
                        <div className="bg-grocery-50 h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                          {line.meal.imageUrl ? (
                            <img
                              src={line.meal.imageUrl}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-grocery-400 flex h-full items-center justify-center text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-grocery-500 text-xs font-medium uppercase tracking-wide">
                            {line.meal.categoryLabel}
                          </p>
                          <p className="text-grocery-900 font-semibold">{line.meal.name}</p>
                          <p className="text-grocery-500 mt-0.5 text-xs">
                            {formatPrice(unit)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="border-grocery-200 hover:bg-grocery-50 flex h-9 w-9 items-center justify-center rounded-lg border text-lg font-medium"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              setQuantity(line.lineId, line.quantity - 1)
                            }
                          >
                            −
                          </button>
                          <span className="text-grocery-900 min-w-[2rem] text-center text-sm font-semibold">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            className="border-grocery-200 hover:bg-grocery-50 flex h-9 w-9 items-center justify-center rounded-lg border text-lg font-medium"
                            aria-label="Increase quantity"
                            onClick={() =>
                              setQuantity(line.lineId, line.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-6">
                          <p className="text-grocery-900 text-base font-bold tabular-nums">
                            {formatPrice(lineTotal)}
                          </p>
                          <button
                            type="button"
                            className="text-grocery-500 hover:text-red-600 text-sm font-medium underline"
                            onClick={() => removeLine(line.lineId)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="border-grocery-100 bg-white mt-8 rounded-2xl border p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-grocery-700 text-sm font-medium">Subtotal</span>
                  <span className="text-grocery-900 text-xl font-bold tabular-nums">
                    {gbp.format(subtotal)}
                  </span>
                </div>
                <p className="text-grocery-500 mt-2 text-xs">
                  Delivery and taxes can be calculated at checkout.
                </p>
                <Link
                  to={paths.checkout}
                  className="bg-grocery-900 text-white hover:bg-grocery-800 focus-visible:ring-grocery-900/40 mt-6 inline-flex h-11 w-full items-center justify-center rounded-[10px] px-4 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
                >
                  Proceed to checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
