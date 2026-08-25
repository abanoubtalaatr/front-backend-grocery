import { Link } from 'react-router-dom'
import { paths } from '@/constants/paths'

export function OrderCompletePage() {
  return (
    <div className="bg-grocery-50/40 flex w-full flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <div className="border-grocery-100 bg-white max-w-md rounded-2xl border p-10 text-center shadow-sm">
          <div className="bg-emerald-50 text-emerald-700 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl">
            ✓
          </div>
          <h1 className="text-grocery-900 text-xl font-bold">Thank you!</h1>
          <p className="text-grocery-600 mt-2 text-sm">
            Your order has been recorded. You&apos;ll receive confirmation details once your
            backend checkout is wired up.
          </p>
          <Link
            to={paths.home}
            className="bg-grocery-900 text-white hover:bg-grocery-800 mt-8 inline-flex h-11 w-full items-center justify-center rounded-[10px] px-4 text-sm font-medium transition"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
