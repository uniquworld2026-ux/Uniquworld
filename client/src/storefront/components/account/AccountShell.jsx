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
  { to: '/account/orders', label: 'My orders', icon: Package },
  { to: '/account/profile', label: 'Profile', icon: User },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/returns', label: 'Returns', icon: RotateCcw },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
]

function UserAvatar({ user }) {
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean)
    .join('')
    .toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'

  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-hm-primary font-sans text-lg font-semibold text-white">
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
    <div className="min-h-[70svh] bg-hm-muted/30 pb-16">
      <div className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <UserAvatar user={user} />
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-hm-accent">
                My account
              </p>
              <h1 className="font-display text-2xl font-semibold tracking-tight text-hm-text sm:text-3xl">
                Hello, {user?.firstName || 'there'}
              </h1>
              <p className="mt-0.5 font-sans text-sm text-hm-text-muted">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={onSignOut}>
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside className="lg:sticky lg:top-[var(--hm-header-offset)] lg:self-start">
          <nav className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    'flex shrink-0 items-center gap-2.5 rounded-xl border px-3.5 py-2.5 font-sans text-sm font-medium transition',
                    isActive
                      ? 'border-hm-accent/40 bg-hm-accent-muted text-hm-text'
                      : 'border-hm-border bg-hm-elevated text-hm-text-muted hover:border-hm-accent/30 hover:text-hm-text',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={onSignOut}
              className="flex shrink-0 items-center gap-2.5 rounded-xl border border-hm-border bg-hm-elevated px-3.5 py-2.5 font-sans text-sm font-medium text-hm-text-muted transition hover:border-hm-danger/30 hover:text-hm-danger lg:hidden"
            >
              <LogOut className="h-4 w-4" />
              Sign out
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
    <div className="rounded-2xl border border-dashed border-hm-border bg-hm-elevated/80 p-8 text-center sm:p-12">
      <p className="font-display text-2xl font-semibold text-hm-text">{title}</p>
      <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-hm-text-muted">{description}</p>
      {actionTo ? (
        <Link to={actionTo} className="mt-6 inline-block">
          <Button variant="primary">{actionLabel}</Button>
        </Link>
      ) : null}
    </div>
  )
}

export function AccountSection({ title, description, children, action }) {
  return (
    <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          {title ? <h2 className="font-sans text-base font-semibold text-hm-text">{title}</h2> : null}
          {description ? (
            <p className="mt-1 font-sans text-sm text-hm-text-muted">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}
