import { useEffect, useState } from 'react'

const query = typeof window === 'undefined' ? null : window.matchMedia(
  '(prefers-reduced-motion: reduce)',
)

/**
 * For accessibility: skip or shorten heavy animations for users
 * who prefer reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => query?.matches ?? false)

  useEffect(() => {
    if (!query) {
      return
    }
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
