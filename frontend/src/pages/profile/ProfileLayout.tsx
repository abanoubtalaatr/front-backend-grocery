import { NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { profileNavItems, profilePath } from '@/pages/profile/profileNavData'
import { ProfileNavIcon } from '@/pages/profile/ProfileNavIcon'
import { getAuthDisplayName, getStoredToken, getStoredUser } from '@/lib/auth/authTokenStorage'
import { paths } from '@/constants/paths'
import { cn } from '@/lib/cn'


const base = import.meta.env.BASE_URL.replace(/\/$/, '')


const memberLabel = 'Gold Member'

export function ProfileLayout() {
  const location = useLocation()
  const user = getStoredUser()
  
  const displayName = getAuthDisplayName('Member')
  if (!getStoredToken()) {
    return <Navigate to={paths.login} state={{ from: location }} replace />
  }

  return (
    <div className="bg-grocery-50 flex min-h-svh w-full flex-col">
      
        <SiteHeader />
      
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row lg:items-start">
        <aside className="border-grocery-100 w-full shrink-0 rounded-2xl border bg-white p-4 shadow-sm lg:w-72">
          <div className="flex items-center gap-3 border-b border-grocery-100 pb-4">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-grocery-100">
              <img
                src={`${base}/profile-avatar.png`}
                alt=""
                className="h-full w-full object-cover"
                width={56}
                height={56}
                onError={(e) => {
                  const el = e.currentTarget
                  el.style.display = 'none'
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-grocery-900 truncate font-semibold">{displayName}</p>
              {user?.email && (
                <p className="text-grocery-500 mt-0.5 truncate text-xs">{user.email}</p>
              )}
              <p className="text-grocery-800 mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100/90 px-2.5 py-0.5 text-xs font-medium">
                <span className="text-amber-600" aria-hidden>
                  ♔
                </span>
                {memberLabel}
              </p>
            </div>
          </div>
          <nav className="mt-4 space-y-0.5" aria-label="Account">
            {profileNavItems.map((item) => (
              <NavLink
                key={item.key}
                to={profilePath(item.path)}
                className={({ isActive }) =>
                  cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition',
                    isActive
                      ? 'bg-grocery-900 text-white shadow-sm'
                      : 'text-grocery-600 hover:bg-grocery-50 hover:text-grocery-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={isActive ? 'text-white' : 'text-grocery-500'}
                      aria-hidden
                    >
                      <ProfileNavIcon name={item.key} />
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="border-grocery-100 min-h-[480px] w-full flex-1 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
