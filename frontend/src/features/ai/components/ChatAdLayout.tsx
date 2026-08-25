import { Link, Outlet } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { GroceryWordmark } from '@/components/brand/GroceryWordmark'
import { ChatAdBackground } from '@/features/ai/components/ChatAdBackground'
import { paths } from '@/constants/paths'

/** Minimal chrome for /chat — locked to viewport (no page scroll). */
export function ChatAdLayout() {
  return (
    <div className="flex h-svh max-h-svh w-full flex-col overflow-hidden bg-grocery-950">
      <ChatAdBackground />

      <header className="relative z-10 flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-6">
        <Link to={paths.home}>
          <GroceryWordmark variant="onPrimary" className="text-base sm:text-lg" />
        </Link>
        <Link
          to={paths.home}
          className="group relative overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-1.5 text-[11px] font-bold text-grocery-950 shadow-[0_0_20px_-4px_rgba(52,211,153,0.7)] transition hover:brightness-110"
        >
          <span className="relative z-10 flex items-center gap-1">
            <Sparkles className="h-3 w-3" aria-hidden />
            Shop now
          </span>
        </Link>
      </header>

      <main className="relative z-10 min-h-0 flex-1 overflow-hidden px-4 pb-3 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
