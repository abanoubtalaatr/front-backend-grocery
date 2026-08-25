import { Bot, Package, Zap } from 'lucide-react'
import { cn } from '@/lib/cn'

const STATS = [
  { icon: Package, label: '4,000+', sub: 'Products' },
  { icon: Bot, label: 'AI', sub: 'Assistant' },
  { icon: Zap, label: '< 3s', sub: 'Answers' },
] as const

type ChatAdStatsProps = {
  className?: string
}

export function ChatAdStats({ className }: ChatAdStatsProps) {
  return (
    <ul className={cn('flex shrink-0 flex-wrap justify-center gap-1.5 lg:justify-end', className)}>
      {STATS.map(({ icon: Icon, label, sub }) => (
        <li
          key={sub}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-sm"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/30 to-cyan-400/20 text-emerald-300">
            <Icon className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="leading-none">
            <span className="block text-xs font-extrabold text-white">{label}</span>
            <span className="text-[10px] text-white/50">{sub}</span>
          </span>
        </li>
      ))}
    </ul>
  )
}
