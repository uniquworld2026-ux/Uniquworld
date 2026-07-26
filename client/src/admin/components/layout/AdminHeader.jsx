import { useNavigate } from 'react-router-dom'
import { Bell, LogOut, Menu, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '@/shared/hooks/useTheme'
import { useSidebar } from '@/admin/context/SidebarContext'
import { useAdminAuth } from '@/admin/auth/AdminAuthContext'
import { cn } from '@/shared/utils/cn'

/**
 * @param {{ title?: string; subtitle?: string }} props
 */
export function AdminHeader({ title = 'Dashboard', subtitle }) {
  const { toggleTheme, isDark } = useTheme()
  const { openMobile, collapsed } = useSidebar()
  const { session, logout } = useAdminAuth()
  const navigate = useNavigate()

  const initials = (session?.name || 'A')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-admin-border',
        'bg-admin-elevated/85 px-4 backdrop-blur-xl sm:px-6',
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={openMobile}
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl text-admin-text-muted transition-colors hover:bg-admin-muted hover:text-admin-text lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h1 className="truncate font-sans text-base font-semibold tracking-tight text-admin-text sm:text-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden truncate text-xs text-admin-text-muted sm:block">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div
          className={cn(
            'hidden items-center gap-2 rounded-xl border border-admin-border bg-admin-bg px-3 py-2',
            'text-admin-text-muted md:flex',
            collapsed ? 'w-48 lg:w-56' : 'w-56 lg:w-64',
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            placeholder="Search orders, products…"
            className="w-full bg-transparent text-sm text-admin-text outline-none placeholder:text-admin-text-muted"
          />
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-xl p-2 text-admin-text-muted transition-colors hover:bg-admin-muted hover:text-admin-text"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        <button
          type="button"
          className="relative rounded-xl p-2 text-admin-text-muted transition-colors hover:bg-admin-muted hover:text-admin-text"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-admin-accent ring-2 ring-admin-elevated" />
        </button>

        <div className="ml-1 flex items-center gap-2.5 rounded-xl border border-admin-border bg-admin-bg py-1 pl-1 pr-2.5 sm:pr-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-admin-primary text-xs font-semibold text-admin-elevated">
            {initials}
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-xs font-semibold text-admin-text">
              {session?.name || 'Admin'}
            </p>
            <p className="truncate text-[10px] text-admin-text-muted">
              {session?.email || ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl text-admin-text-muted transition-colors hover:bg-admin-muted hover:text-admin-danger"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
