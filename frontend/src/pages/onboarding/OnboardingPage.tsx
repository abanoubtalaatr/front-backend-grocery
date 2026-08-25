import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@/components/ui/FormIcons'
import { paths } from '@/constants/paths'
import { storageKeys } from '@/constants/storageKeys'
import { cn } from '@/lib/cn'

const slides = [
  {
    key: 'shop',
    title: 'Shop Everything You Need, In One Click',
    body: 'Browse fresh produce, pantry staples, and household items from one app — built for a fast, simple shop.',
  },
  {
    key: 'deliver',
    title: 'Save Time, Get Groceries Delivered to Your Door',
    body: 'Track your order in real time and get delivery when it fits your day.',
  },
] as const

function IllustrationShop() {
  return (
    <svg className="text-grocery-900 w-full max-w-64" viewBox="0 0 200 200" role="img" aria-hidden>
      <rect x="24" y="100" width="140" height="8" rx="2" className="fill-grocery-200" />
      <rect x="40" y="78" width="32" height="30" rx="2" className="fill-sky-200" />
      <rect x="80" y="70" width="32" height="38" rx="2" className="fill-amber-200" />
      <rect x="120" y="82" width="28" height="26" rx="2" className="fill-emerald-200" />
      <circle cx="100" cy="40" r="12" className="fill-grocery-900" />
      <rect x="92" y="52" width="16" height="28" rx="3" className="fill-sky-300" />
    </svg>
  )
}

function IllustrationDelivery() {
  return (
    <svg className="text-grocery-900 w-full max-w-64" viewBox="0 0 200 200" role="img" aria-hidden>
      <rect x="30" y="120" width="100" height="10" rx="2" className="fill-grocery-200" />
      <rect x="40" y="100" width="32" height="20" rx="2" className="fill-sky-200" />
      <circle cx="50" cy="140" r="8" className="fill-grocery-800" />
      <circle cx="120" cy="140" r="8" className="fill-grocery-800" />
      <path
        d="M72 100h30l20 20H72v-20Z"
        className="fill-grocery-300"
      />
      <circle cx="68" cy="50" r="10" className="fill-grocery-900" />
    </svg>
  )
}

const art = [<IllustrationShop key="a" />, <IllustrationDelivery key="b" />]

export function OnboardingPage() {
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const isLast = index === slides.length - 1

  function goNext() {
    if (isLast) {
      localStorage.setItem(storageKeys.onboardingComplete, '1')
      navigate(paths.login, { replace: true })
      return
    }
    setIndex((i) => i + 1)
  }

  function onSkip() {
    localStorage.setItem(storageKeys.onboardingComplete, '1')
    navigate(paths.login, { replace: true })
  }

  const slide = slides[index]!

  return (
    <div className="bg-grocery-50/50 flex min-h-svh flex-col">
      <div className="flex items-center justify-end p-4">
        <button
          type="button"
          onClick={onSkip}
          className="text-grocery-600 text-sm font-medium"
        >
          Skip
        </button>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pt-2">
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          {art[index]}
          <h1 className="text-grocery-900 text-2xl font-semibold leading-tight">
            {slide.title}
          </h1>
          <p className="text-grocery-600 text-sm leading-relaxed">{slide.body}</p>
        </div>

        <div className="flex items-center justify-between gap-4 pb-10">
          <div className="flex flex-1 justify-center gap-2" role="tablist" aria-label="Onboarding step">
            {slides.map((s, i) => (
              <span
                key={s.key}
                className={cn(
                  'h-2.5 w-2.5 rounded-full transition',
                  i === index ? 'bg-grocery-900' : 'bg-grocery-200',
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={goNext}
            className="bg-grocery-900 flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-md"
            aria-label={isLast ? 'Get started' : 'Next'}
          >
            <ChevronRightIcon className="stroke-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
