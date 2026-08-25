import { cn } from '@/lib/cn'
import type { ProfileNavKey } from '@/pages/profile/profileNavData'

type Props = { name: ProfileNavKey; className?: string }

export function ProfileNavIcon({ name, className }: Props) {
  const c = cn('h-5 w-5 shrink-0', className)
  switch (name) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25A2.25 2.25 0 0 1 8.25 10.5H6A2.25 2.25 0 0 1 3.75 8.25V6ZM13.5 6A2.25 2.25 0 0 1 15.75 3.75H18A2.25 2.25 0 0 1 20.25 6V8.25A2.25 2.25 0 0 1 18 10.5h-2.25A2.25 2.25 0 0 1 13.5 8.25V6ZM3.75 15.75A2.25 2.25 0 0 0 6 18h2.25A2.25 2.25 0 0 0 10.5 15.75V13.5A2.25 2.25 0 0 0 8.25 11.25H6A2.25 2.25 0 0 0 3.75 13.5v2.25ZM13.5 15.75A2.25 2.25 0 0 0 15.75 18H18A2.25 2.25 0 0 0 20.25 15.75V13.5A2.25 2.25 0 0 0 18 11.25h-2.25A2.25 2.25 0 0 0 13.5 13.5v2.25Z"
          />
        </svg>
      )
    case 'personal':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0" />
        </svg>
      )
    case 'payment':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 7.5h19.5M2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 16.5V7.5M5.25 12h.75m1.5 0H9m-3.75 0h.75m-1.5 3.75H9"
          />
        </svg>
      )
    case 'orders':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h7.5a.75.75 0 0 1 .75.75V8.25A2.25 2.25 0 0 1 14.25 10.5H9.75A2.25 2.25 0 0 1 7.5 8.25V7.5a.75.75 0 0 1 .75-.75ZM5.25 9V19.5A2.25 2.25 0 0 0 7.5 21.75H18a.75.75 0 0 0 .75-.75V9.75A2.25 2.25 0 0 0 16.5 7.5H8.25"
          />
        </svg>
      )
    case 'lists':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 6.75h12M8.25 12h12M8.25 17.25h12M3.75 6.75h.01M3.75 12h.01M3.75 17.25h.01"
          />
        </svg>
      )
    case 'addresses':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5C18 6.75 15.25 4.5 12 4.5S6 6.75 4.5 10.5c.75 3.75 3.3 6.3 5.1 7.4l1.1.5a.45.45 0 0 0 .4 0l1.1-.5c1.8-1.1 4.4-3.6 5.1-7.4Z"
          />
        </svg>
      )
    case 'security':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75A4.5 4.5 0 0 0 12 2.25a4.5 4.5 0 0 0-4.5 4.5V10.5M12 12.75v1.5m-3-1.5V18a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75v-5.25m-7.5 0A2.25 2.25 0 0 1 9.75 10.5h4.5a2.25 2.25 0 0 1 2.25 2.25V15"
          />
        </svg>
      )
    case 'loyalty':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2.5 14.1 7.1l4.4.3-3.2 2.4 1 3.4L12 10.3 7.6 15.2l1-3.4-3.2-2.4L9.8 7l2.1-4.4Z"
          />
        </svg>
      )
    case 'help':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.9 7.1a2.1 2.1 0 0 1 1.1-.1 1.5 1.5 0 0 1 1.2 1.1 1.5 1.5 0 0 1-.1 1.1 3.4 3.4 0 0 1-.5.4l-.1.1a.45.45 0 0 0 0 0A2.1 2.1 0 0 0 9.8 9.5v.5M12 15.1h.01M21 12a9 9 0 1 1-9-9 9 9 0 0 1 9 9Z"
          />
        </svg>
      )
    case 'settings':
      return (
        <svg viewBox="0 0 24 24" className={c} fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992.006.08.01.16.01.255 0 .096-.004.18-.01.255-.007.378.138.75.43.99l1.005.828a1.125 1.125 0 0 1 .26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.37.49l-1.217-.456a1.1 1.1 0 0 0-.22-.128c-.331-.184-.58-.496-.644-.87l-.213-1.281a1.1 1.1 0 0 0-.22-.128 1.1 1.1 0 0 0-1.076.124l-1.217.456a1.125 1.125 0 0 1-1.37-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827a1.1 1.1 0 0 0 .43-.99 1.1 1.1 0 0 0-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.49l1.216.456a1.1 1.1 0 0 0 1.076-.124c.072-.044.145-.088.22-.128.33-.184.58-.496.644-.87l.213-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      )
    default:
      return null
  }
}
