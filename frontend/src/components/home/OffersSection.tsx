import { Button } from '@/components/ui/Button'

function OfferCard({
  badge,
  title,
  subtitle,
  image,
}: {
  badge: string
  title: string
  subtitle: string
  image?: string
}) {
  return (
    <article className="border-grocery-100 relative overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="bg-grocery-900 absolute inset-0 opacity-[0.04]" />
      <div className="relative flex min-h-56 items-center justify-between gap-4 p-6">
        <div className="max-w-xs">
          <p className="bg-grocery-900/10 text-grocery-900 inline-flex rounded-md px-2 py-1 text-xs font-semibold">
            {badge}
          </p>
          <h3 className="text-grocery-900 mt-3 text-3xl font-bold leading-tight">{title}</h3>
          <p className="text-grocery-600 mt-2 text-base">{subtitle}</p>
          <Button type="button" className="mt-5 h-10 min-h-0 w-auto px-5">
            Shop Now
          </Button>
        </div>
        {image && (
          <img
            src={image}
            alt=""
            className="pointer-events-none hidden max-h-44 w-auto object-contain md:block"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
    </article>
  )
}

export function OffersSection() {
  return (
    <section id="offers" className="bg-white px-4 py-8" aria-labelledby="offers-heading">
      <div className="mx-auto max-w-6xl">
        <h2 id="offers-heading" className="text-grocery-900 text-2xl font-bold md:text-3xl">
          Offers
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <OfferCard
            badge="Free Delivery"
            title="Free delivery over £50"
            subtitle="Shop £50 product and get free delivery anywhere."
          />
          <OfferCard
            badge="60% Off"
            title="Organic Food"
            subtitle="Save up to 60% off on your first order."
            image={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/hero-produce.png`}
          />
        </div>
      </div>
    </section>
  )
}
