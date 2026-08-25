import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BadgePercent,
  ChartNoAxesColumn,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Settings,
  ShoppingBag,
  Star,
  Store,
  Users,
  X,
} from 'lucide-react'
import { paths } from '@/constants/paths'
import { cn } from '@/lib/cn'
import { clearStoredToken, getAuthDisplayName } from '@/lib/auth/authTokenStorage'

type NavItem = {
  to: string
  label: string
  icon: typeof LayoutGrid
  end?: boolean
}

const navSections: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Overview',
    items: [{ to: paths.dashboard, label: 'Dashboard', icon: ChartNoAxesColumn, end: true }],
  },
  {
    title: 'Catalog',
    items: [
      { to: paths.dashboardProducts, label: 'Products', icon: Package },
      { to: paths.dashboardCategories, label: 'Categories', icon: LayoutGrid },
    ],
  },
  {
    title: 'Sales',
    items: [
      { to: paths.dashboardOrders, label: 'Orders', icon: ShoppingBag },
      { to: paths.dashboardOffers, label: 'Offers', icon: BadgePercent },
    ],
  },
  {
    title: 'People',
    items: [
      { to: paths.dashboardCustomers, label: 'Customers', icon: Users },
      { to: paths.dashboardReviews, label: 'Reviews', icon: Star },
      { to: paths.dashboardInbox, label: 'Inbox', icon: MessageSquare },
    ],
  },
  {
    title: 'Store',
    items: [
      { to: paths.dashboardContent, label: 'Content', icon: FileText },
      { to: paths.dashboardSettings, label: 'Settings', icon: Settings },
    ],
  },
]

export function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  function handleSignOut() {
    clearStoredToken()
    navigate(paths.login, { replace: true })
  }

  return (
    <div className="bg-surface-muted flex min-h-svh w-full">
      {/* Mobile scrim — the sidebar is a drawer below `lg`. */}
      {menuOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'border-line bg-surface fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r transition-transform lg:static lg:translate-x-0',
          menuOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-line flex h-16 items-center justify-between gap-2 border-b px-5">
          <span className="text-grocery-900 text-base font-semibold">Grocery Plus</span>
          <button
            type="button"
            aria-label="Close menu"
            className="text-grocery-500 hover:bg-surface-muted grid h-9 w-9 place-items-center rounded-lg lg:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navSections.map((section) => (
            <div key={section.title} className="mb-5">
              <p className="text-grocery-300 px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase">
                {section.title}
              </p>
              <ul className="flex flex-col gap-1">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition',
                          isActive
                            ? 'bg-grocery-900 text-white'
                            : 'text-grocery-600 hover:bg-surface-muted',
                        )
                      }
                    >
                      <item.icon className="h-4 w-4 shrink-0" aria-hidden />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-line border-t p-3">
          <NavLink
            to={paths.home}
            className="text-grocery-600 hover:bg-surface-muted flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            <Store className="h-4 w-4" aria-hidden />
            Back to store
          </NavLink>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-danger-700 hover:bg-danger-50 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-line bg-surface sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 lg:px-6">
          <button
            type="button"
            aria-label="Open menu"
            className="text-grocery-600 hover:bg-surface-muted grid h-9 w-9 place-items-center rounded-lg lg:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>

          <p className="text-grocery-500 min-w-0 flex-1 truncate text-sm">
            Signed in as <span className="text-grocery-900 font-medium">{getAuthDisplayName('Admin')}</span>
          </p>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
