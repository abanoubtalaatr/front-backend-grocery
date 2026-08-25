export const PROFILE_BASE = '/profile' as const

export type ProfileNavKey =
  | 'dashboard'
  | 'personal'
  | 'payment'
  | 'orders'
  | 'lists'
  | 'addresses'
  | 'security'
  | 'loyalty'
  | 'help'
  | 'settings'

export const profileNavItems: { key: ProfileNavKey; label: string; path: string }[] = [
  { key: 'dashboard', label: 'Dashboard', path: 'dashboard' },
  { key: 'personal', label: 'Personal Info', path: 'personal' },
  { key: 'payment', label: 'Payment & Wallet', path: 'payment' },
  { key: 'orders', label: 'Order History', path: 'orders' },
  { key: 'lists', label: 'Smart Lists', path: 'lists' },
  { key: 'addresses', label: 'Addresses', path: 'addresses' },
  { key: 'security', label: 'Security & Login', path: 'security' },
  { key: 'loyalty', label: 'Loyalty & Rewards', path: 'loyalty' },
  { key: 'help', label: 'Help & Support', path: 'help' },
  { key: 'settings', label: 'Settings', path: 'settings' },
]

export function profilePath(segment: string) {
  return `${PROFILE_BASE}/${segment}` as const
}
