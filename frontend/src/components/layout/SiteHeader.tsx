import {  useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { GroceryWordmark } from '@/components/brand/GroceryWordmark'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { profilePath } from '@/pages/profile/profileNavData'
import { logoutSession } from '@/lib/api/authApi'

import {
  clearStoredToken,
  getAuthDisplayName,
  getStoredToken,
} from '@/lib/auth/authTokenStorage'
import { useCart } from '@/features/cart/index'
import { cn } from '@/lib/cn'

function HomeNavIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        d="m2.25 12 8.954-8.955a1.125 1.125 0 0 1 1.591 0L21.75 12M4.5 9.75v10.125a1.125 1.125 0 0 0 1.125 1.125H9v-4.875a1.125 1.125 0 0 1 1.125-1.125h2.25a1.125 1.125 0 0 1 1.125 1.125V21h4.125a1.125 1.125 0 0 0 1.125-1.125V9.75M8.25 21h8.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GridNavIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75a2.25 2.25 0 0 1 2.25-2.25h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25v-2.25ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0"
      />
    </svg>
  )
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-5 w-5 shrink-0', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3H2.25m0-13.5V11a2.25 2.25 0 0 0 2.25 2.25h13.5M7.5 14.25H19.5m0 0a3 3 0 0 1-3 3H9.75M19.5 14.25V9.75a2.25 2.25 0 0 0-2.25-2.25h-9M19.5 14.25v2.25a2.25 2.25 0 0 1-2.25 2.25H9.75M9.75 9.75v4.5m0-4.5h4.5m-4.5 0H7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const navLinkClass =
  'text-grocery-600 hover:text-grocery-900 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition'

export function SiteHeader() {
  const navigate = useNavigate()
  
  const hasToken = Boolean(getStoredToken())
  const [loggingOut, setLoggingOut] = useState(false)
  const { totalQuantity } = useCart()
  const profileLabel = hasToken ? getAuthDisplayName() : ''

  async function onLogout() {
    if (loggingOut) {
      return
    }
    setLoggingOut(true)
    try {
      await logoutSession()
    } catch {
      toast.error('Could not reach the server. You were signed out on this device.')
    } finally {
      clearStoredToken()
      setLoggingOut(false)
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <header className="border-grocery-100 bg-white shadow-sm shadow-black/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-3 md:flex-row md:items-center md:gap-6 md:py-3">
        <div className="flex items-center justify-between gap-4 md:justify-start">
          <Link
            to={paths.home}
            className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-grocery-900/30 rounded"
          >
            <GroceryWordmark className="text-xl md:text-2xl" />
          </Link>
          <nav
            className="hidden items-center gap-1 sm:flex"
            aria-label="Primary"
          >
            <Link to={paths.home} className={navLinkClass}>
              <HomeNavIcon />
              Home
            </Link>
            <Link to={paths.categories} className={navLinkClass}>
              <GridNavIcon />
              Categories
            </Link>
            <Link to={paths.chat} className={navLinkClass}>
              Chat
            </Link>
          </nav>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-grocery-200 bg-grocery-50/50 p-1">
          <label className="sr-only" htmlFor="header-search-scope">
            Category scope
          </label>
          <select
            id="header-search-scope"
            className="text-grocery-800 border-grocery-200 bg-white max-w-[40%] shrink-0 cursor-pointer rounded-lg border px-2 py-2 text-xs font-medium sm:max-w-none sm:px-3 sm:text-sm"
            defaultValue="all"
          >
            <option value="all">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="beverages">Coffee &amp; teas</option>
            <option value="meat">Meat</option>
          </select>
          <label className="sr-only" htmlFor="header-search">
            Search products
          </label>
          <input
            id="header-search"
            type="search"
            placeholder="Search for items…"
            className="text-grocery-900 placeholder:text-grocery-400 min-w-0 flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none"
          />
          <button
            type="button"
            className="bg-grocery-900 text-white hover:bg-grocery-800 inline-flex shrink-0 items-center justify-center rounded-lg p-2.5 transition"
            aria-label="Search"
            onClick={() => toast.message('Search will connect to your catalog API.')}
          >
            <SearchIcon className="text-white" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          {hasToken && (
            <Link
              to={profilePath('orders')}
              className={cn(navLinkClass, 'text-grocery-700 max-w-[8rem]')}
              title={profileLabel}
            >
              <UserCircleIcon />
              <span className="hidden truncate sm:inline">{profileLabel}</span>
            </Link>
          )}
          <Link
            to={paths.cart}
            className={cn(navLinkClass, 'text-grocery-700 relative')}
          >
            <CartIcon />
            <span className="hidden sm:inline">My cart</span>
            {totalQuantity > 0 && (
              <span className="bg-sky-500 text-white absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none">
                {totalQuantity > 99 ? '99+' : totalQuantity}
              </span>
            )}
          </Link>
          {hasToken ? (
            <Button
              type="button"
              variant="secondary"
              className="h-10 min-h-0 w-auto shrink-0 px-4 text-sm"
              onClick={() => {
                void onLogout()
              }}
              loading={loggingOut}
            >
              Log out
              {/* {counter} */}
            </Button>
          ) : (
            <>
              <Link
                to={paths.login}
                className="text-grocery-600 hover:text-grocery-900 hidden text-sm font-medium sm:inline"
              >
                Log in
              </Link>
              <Link
                to={paths.signUp}
                className="bg-grocery-900 text-white hover:bg-grocery-800 focus-visible:ring-grocery-900/40 inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] px-4 text-sm font-medium transition focus-visible:ring-2 focus-visible:outline-none"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
