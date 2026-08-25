type OrderItem = {
  id: number
  quantity: number
  unit_price: number
  subtotal: number
  meal?: {
    id: number
    title: string
    image_url?: string | null
  } | null
}

export type OrderDto = {
  id: number
  order_number: string
  payment_method: string
  delivery_type: string
  status: string
  status_description: string
  items: OrderItem[]
  subtotal: string
  tax: string
  discount: string
  shipping_fee: number
  total: string
  created_at: string
}

const money = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
})

function statusStyle(status: string): string {
  switch (status.toLowerCase()) {
    case 'placed':
      return 'bg-sky-100 text-sky-800'
    case 'processing':
      return 'bg-amber-100 text-amber-800'
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800'
    case 'cancelled':
      return 'bg-rose-100 text-rose-800'
    default:
      return 'bg-grocery-100 text-grocery-700'
  }
}

function labelize(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Order({ order }: { order: OrderDto }) {
  const created = new Date(order.created_at)
  const createdLabel = Number.isNaN(created.getTime())
    ? order.created_at
    : created.toLocaleString()

  const subtotal = Number(order.subtotal) || 0
  const tax = Number(order.tax) || 0
  const discount = Number(order.discount) || 0
  const shipping = Number(order.shipping_fee) || 0
  const total = Number(order.total) || 0

  return (
    <article className="border-grocery-100 w-full rounded-2xl border bg-white p-4 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-grocery-100 pb-3">
        <div>
          <h3 className="text-grocery-900 font-semibold">{order.order_number}</h3>
          <p className="text-grocery-500 mt-0.5 text-xs">{createdLabel}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(order.status)}`}>
          {labelize(order.status)}
        </span>
      </header>

      <ul className="mt-4 space-y-3">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <div className="bg-grocery-50 h-14 w-14 shrink-0 overflow-hidden rounded-lg">
              {item.meal?.image_url ? (
                <img
                  src={item.meal.image_url}
                  alt={item.meal.title}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-grocery-900 truncate text-sm font-medium">
                {item.meal?.title ?? `Meal #${item.meal?.id ?? '-'}`}
              </p>
              <p className="text-grocery-500 text-xs">
                Qty: {item.quantity} · Unit: {money.format(item.unit_price)}
              </p>
            </div>
            <p className="text-grocery-900 text-sm font-semibold">{money.format(item.subtotal)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-grocery-100 pt-3 text-sm">
        <p className="text-grocery-500">Payment</p>
        <p className="text-grocery-900 text-right font-medium">{labelize(order.payment_method)}</p>
        <p className="text-grocery-500">Delivery</p>
        <p className="text-grocery-900 text-right font-medium">{labelize(order.delivery_type)}</p>
        <p className="text-grocery-500">Subtotal</p>
        <p className="text-grocery-900 text-right">{money.format(subtotal)}</p>
        <p className="text-grocery-500">Tax</p>
        <p className="text-grocery-900 text-right">{money.format(tax)}</p>
        <p className="text-grocery-500">Discount</p>
        <p className="text-grocery-900 text-right">-{money.format(discount)}</p>
        <p className="text-grocery-500">Shipping</p>
        <p className="text-grocery-900 text-right">{money.format(shipping)}</p>
        <p className="text-grocery-900 pt-1 font-semibold">Total</p>
        <p className="text-grocery-900 text-right text-base font-bold">{money.format(total)}</p>
      </div>
    </article>
  )
}