import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GroceryLogoMark } from '@/components/brand/GroceryLogoMark'
import { paths } from '@/constants/paths'
import { storageKeys } from '@/constants/storageKeys'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'
import { cn } from '@/lib/cn'

const TOTAL_MS = 2500

const STAGE = {
  base: 0,
  apple: 1,
  appleDown: 2,
  withPlus: 3,
} as const

type Stage = (typeof STAGE)[keyof typeof STAGE]

export function SplashPage() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState<Stage>(STAGE.base)

  const displayStage: Stage = useMemo(
    () => (reduced ? STAGE.withPlus : stage),
    [reduced, stage],
  )

  const finish = useCallback(() => {
    const hasSeen = localStorage.getItem(storageKeys.onboardingComplete) === '1'
    navigate(hasSeen ? paths.login : paths.onboarding, { replace: true })
  }, [navigate])

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(finish, 500)
      return () => clearTimeout(t)
    }

    const t1 = setTimeout(() => setStage(STAGE.apple), 200)
    const t2 = setTimeout(() => setStage(STAGE.appleDown), 900)
    const t3 = setTimeout(() => setStage(STAGE.withPlus), 1500)
    const t4 = setTimeout(finish, TOTAL_MS)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [reduced, finish])

  return (
    <div
      className="from-grocery-50 flex min-h-svh items-center justify-center bg-gradient-to-b to-white p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex min-h-32 min-w-40 flex-col items-center justify-center">
        {displayStage === STAGE.base && (
          <div className="bg-grocery-900/20 h-3 w-20 rounded-full shadow-inner" />
        )}

        {displayStage >= STAGE.apple && (
          <GroceryLogoMark
            withPlus={displayStage >= STAGE.withPlus}
            className={cn(
              'transition duration-500 ease-out',
              displayStage === STAGE.apple && 'scale-100 opacity-100',
              displayStage === STAGE.appleDown && 'scale-[0.9]',
              displayStage >= STAGE.withPlus && 'scale-95',
            )}
          />
        )}
        <span className="text-grocery-500 sr-only">
          {displayStage >= STAGE.withPlus ? 'Ready' : 'Loading'}
        </span>
      </div>
    </div>
  )
}
