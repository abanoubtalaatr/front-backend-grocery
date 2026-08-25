import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { BestSellsSection } from '@/components/home/BestSellsSection'
import { HeroBanner } from '@/components/home/HeroBanner'
import { HotDealsSection } from '@/components/home/HotDealsSection'
import { NewProductsSection } from '@/components/home/NewProductsSection'
import { OffersSection } from '@/components/home/OffersSection'
import { HomeBenefitsStrip } from '@/components/layout/HomeBenefitsStrip'

type HomeLocationState = { scrollTo?: string } | null

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const state = location.state as HomeLocationState
    if (state?.scrollTo !== 'deals') {
      return
    }
    const el = document.getElementById('hot-deals')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location])

  return (
    <div className="bg-white flex w-full flex-col">
      <div className="flex-1">
        <HeroBanner />
        
        <HotDealsSection />
        <NewProductsSection />
        <OffersSection />
        <BestSellsSection />
      </div>
      <HomeBenefitsStrip />
    </div>
  )
}
