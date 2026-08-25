import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-8 w-8 text-grocery-800', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden
    >
      <path
        d="M3.75 9.75V6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v3.75a1.5 1.5 0 0 0 0 3V18A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18v-5.25a1.5 1.5 0 0 0 0-3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 9.75h6M9 14.25h3" strokeLinecap="round" />
    </svg>
  )
}

function RefundIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-8 w-8 text-grocery-800', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden
    >
      <path
        d="M3.75 11.25A8.25 8.25 0 1 1 12 20.25c-2.327 0-4.425-.963-5.925-2.513"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M3.75 6.75v4.5h4.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5v4.5l3 1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DeliveryIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-8 w-8 text-grocery-800', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden
    >
      <path
        d="M3 6.75h10.5V16.5H3V6.75Zm10.5 3h3.45c.4 0 .78.16 1.06.44l1.54 1.54c.28.28.45.66.45 1.06v3.7H13.5v-6.75Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="17.25" r="1.5" />
      <circle cx="16.5" cy="17.25" r="1.5" />
    </svg>
  )
}

type BenefitProps = {
  title: string
  text: string
  icon: ReactNode
}

function BenefitItem({ title, text, icon }: BenefitProps) {
  return (
    <article className="flex items-center gap-4">
      <div className="bg-grocery-50 rounded-full p-3">{icon}</div>
      <div>
        <h3 className="text-grocery-900 text-xl font-semibold">{title}</h3>
        <p className="text-grocery-500 mt-1 text-sm">{text}</p>
      </div>
    </article>
  )
}

export function HomeBenefitsStrip() {
  return (
    <section className="border-grocery-100 border-t border-b bg-white px-4 py-8">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
        <BenefitItem
          title="Best Prices & Deals"
          text="Don’t miss our daily amazing deals and prices."
          icon={<TicketIcon />}
        />
        <BenefitItem
          title="Refundable"
          text="If your items have damage we agree to refund it."
          icon={<RefundIcon />}
        />
        <BenefitItem
          title="Free Delivery"
          text="Do purchase over £50 and get free delivery anywhere."
          icon={<DeliveryIcon />}
        />
      </div>
    </section>
  )
}
