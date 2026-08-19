import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Bell,
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  User,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { cn } from '@/shared/utils/cn'

const NAV = [
  { to: '/account', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/returns', label: 'Returns', icon: RotateCcw },
  { to: '/account/notifications', label: 'Alerts', icon: Bell },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
]

function UserAvatar({ user }) {
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-hm-primary font-sans text-base font-semibold text-white sm:h-12 sm:w-12 sm:text-lg">
      {initials}
    </span>
  )
}

export function AccountShell() {
  const { user, logout } = useCustomerAuth()
  const navigate = useNavigate()

  const onSignOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-[70svh] bg-hm-muted/30 pb-[calc(1rem+var(--uw-bottom-nav-h))] lg:pb-16">
      <div className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:gap-4 sm:py-6 sm:px-8">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            <UserAvatar user={user} />
            <div className="min-w-0">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-hm-accent sm:text-xs">
                My account
              </p>
              <h1 className="truncate font-display text-xl font-semibold tracking-tight text-hm-text sm:text-3xl">
                Hello, {user?.firstName || 'there'}
              </h1>
              <p className="truncate font-sans text-xs text-hm-text-muted sm:mt-0.5 sm:text-sm">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-4 px-3 py-4 sm:gap-6 sm:px-8 sm:py-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-[var(--hm-header-offset)] lg:self-start">
          {/* Mobile: icon grid — easy tap targets, all visible at once */}
          <nav className="grid grid-cols-4 gap-2 sm:grid-cols-7 lg:flex lg:flex-col lg:gap-1.5">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-xl border font-sans text-sm font-medium transition',
                    'flex-col justify-center px-2 py-3 text-center text-[11px] sm:text-xs lg:flex-row lg:justify-start lg:px-3.5 lg:py-2.5 lg:text-left lg:text-sm',
                    isActive
                      ? 'border-hm-accent/40 bg-hm-accent-muted text-hm-text'
                      : 'border-hm-border bg-hm-elevated text-hm-text-muted hover:border-hm-accent/30 hover:text-hm-text',
                  )
                }
              >
                <Icon className="h-5 w-5 shrink-0 lg:h-4 lg:w-4" />
                <span className="leading-tight">{label}</span>
              </NavLink>
            ))}
            <button
              type="button"
              onClick={onSignOut}
              className="flex flex-col items-center justify-center gap-2.5 rounded-xl border border-hm-border bg-hm-elevated px-2 py-3 font-sans text-[11px] font-medium text-hm-text-muted transition hover:border-hm-danger/30 hover:text-hm-danger sm:text-xs lg:flex-row lg:justify-start lg:px-3.5 lg:py-2.5 lg:text-sm"
            >
              <LogOut className="h-5 w-5 lg:h-4 lg:w-4" />
              <span className="leading-tight">Sign out</span>
            </button>
          </nav>
        </aside>

        <main className="min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function AccountEmptyState({ title, description, actionLabel, actionTo }) {
  return (
    <div className="rounded-2xl border border-dashed border-hm-border bg-hm-elevated/80 p-6 text-center sm:p-12">
      <p className="font-display text-lg font-semibold text-hm-text sm:text-2xl">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm font-sans text-xs text-hm-text-muted sm:mt-2 sm:text-sm">{description}</p>
      {actionTo ? (
        <Link to={actionTo} className="mt-4 inline-block sm:mt-6">
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  )
}

export function AccountSection({ title, description, children, action }) {
  return (
    <section className="rounded-2xl border border-hm-border bg-hm-elevated p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4 sm:gap-3">
        <div>
          {title ? <h2 className="font-sans text-sm font-semibold text-hm-text sm:text-base">{title}</h2> : null}
          {description ? (
            <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
