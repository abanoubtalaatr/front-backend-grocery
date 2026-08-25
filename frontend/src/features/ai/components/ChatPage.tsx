import { MessageCircle } from 'lucide-react'
import { ChatPanel } from '@/features/ai/components/ChatPanel'
import { ChatProductShowcase } from '@/features/ai/components/ChatProductShowcase'
import { ChatAdStats } from '@/features/ai/components/ChatAdStats'

export function ChatPage() {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col gap-2 sm:gap-2.5">
      {/* Compact hero — fixed height, no page scroll */}
      <div className="shrink-0">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-4">
          <div className="min-w-0 text-center lg:text-left">
            <div className="flex flex-wrap justify-center gap-1.5 lg:justify-start">
              <span className="rounded-full bg-emerald-400/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-200 ring-1 ring-emerald-400/40">
                ✦ AI powered
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 ring-1 ring-white/20">
                4000+ products
              </span>
              <span className="hidden rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 ring-1 ring-white/20 sm:inline">
                Same-day delivery
              </span>
            </div>

            <h1 className="mt-1.5 text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl lg:text-[1.65rem]">
              Shop smarter.{' '}
              <span className="bg-[length:200%_auto] bg-gradient-to-r from-emerald-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent animate-gradient-shift">
                Ask AI. Add to cart.
              </span>
            </h1>

            <p className="mx-auto mt-1 max-w-lg text-[11px] leading-snug text-white/60 sm:text-xs lg:mx-0">
              Live catalog · real prices · instant answers
            </p>
          </div>

          <ChatAdStats className="mt-0" />
        </div>
      </div>

      {/* Chat + products fill remaining viewport */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="absolute -inset-0.5 animate-glow-pulse rounded-2xl bg-gradient-to-br from-emerald-400/50 via-cyan-400/35 to-violet-500/25 blur-sm" />
        <div className="relative flex min-h-0 flex-1 flex-col rounded-2xl border border-white/10 bg-grocery-950/50 p-1.5 shadow-[0_16px_48px_-16px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-2">
          <div className="mb-1 flex shrink-0 items-center justify-center gap-1.5 sm:justify-start">
            <MessageCircle className="h-3.5 w-3.5 text-emerald-400" aria-hidden />
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Live demo · real catalog
            </p>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-3">
            <ChatPanel />
            <div className="hidden min-h-0 lg:flex lg:flex-col">
              <ChatProductShowcase />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
