import { Link } from 'react-router-dom'
import { paths } from '@/constants/paths'

const HERO_BG = '#014162F2'

function heroImageSrc() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${base}/hero-produce.png`
}

export function HeroBanner() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: HERO_BG }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 md:flex-row md:py-14 md:pl-8 md:pr-0">
        <div className="max-w-xl text-center md:flex-1 md:text-left">
          <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
            Don&apos;t miss our daily amazing deals.
          </h1>
          <p className="mt-3 text-base text-white/90 md:text-lg">
            Save up to 60% off on your first order
          </p>
          <Link
            to={paths.home}
            state={{ scrollTo: 'deals' }}
            className="mt-6 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-grocery-900 shadow-md transition hover:bg-grocery-50"
          >
            Shop Now
          </Link>
        </div>
        <div className="relative w-full max-w-md shrink-0 md:-mr-4 md:max-w-lg lg:max-w-xl">
          <img
            src={heroImageSrc()}
            alt=""
            className="pointer-events-none h-auto w-full max-h-[280px] object-contain object-bottom drop-shadow-lg md:max-h-[340px]"
            width={600}
            height={400}
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
