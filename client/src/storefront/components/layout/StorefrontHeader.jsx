import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Heart,
  Menu,
  Moon,
  Search,
  ShoppingBag,
  Sun,
  Truck,
  User,
  X,
} from 'lucide-react'
import { primaryNav } from '@/storefront/config/sitemap'
import { Button } from '@/shared/components/ui/Button'
import { useTheme } from '@/shared/hooks/useTheme'
import { useCart } from '@/storefront/hooks/useCart'
import { cn } from '@/shared/utils/cn'

export function StorefrontHeader() {
  const { toggleTheme, isDark } = useTheme()
  const { count, openCart } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return undefined
    const prevOverflow = document.body.style.overflow
    const prevPadding = document.body.style.paddingRight
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.body.style.paddingRight = prevPadding
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  function onSearch(e) {
    e.preventDefault()
    const q = query.trim()
    setOpen(false)
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search')
  }

  const mobileMenu =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-hm-overlay"
              onClick={() => setOpen(false)}
            />
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="absolute inset-y-0 left-0 flex w-[min(20rem,86vw)] max-w-full flex-col bg-hm-elevated shadow-hm-elevated"
            >
              <div className="flex shrink-0 items-center justify-between border-b border-hm-border px-4 py-3 pl-[max(1rem,env(safe-area-inset-left))]">
                <p className="font-display text-2xl text-hm-text">Menu</p>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-hm-text-muted hover:bg-hm-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pl-[max(1rem,env(safe-area-inset-left))]">
                <form onSubmit={onSearch} className="relative mb-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search gifts…"
                    className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg pl-10 pr-3 text-sm outline-none focus:border-hm-accent"
                    aria-label="Search"
                  />
                </form>

                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                  Shop
                </p>
                <nav className="mb-4 flex flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-bg">
                  {primaryNav.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'border-b border-hm-border/60 px-4 py-3.5 text-base font-medium last:border-0',
                          isActive ? 'bg-hm-primary/8 text-hm-primary' : 'text-hm-text',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                  Account
                </p>
                <nav className="flex flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-bg">
                  <Link
                    to="/account"
                    onClick={() => setOpen(false)}
                    className="border-b border-hm-border/60 px-4 py-3.5 text-base font-medium text-hm-text"
                  >
                    My account
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setOpen(false)}
                    className="border-b border-hm-border/60 px-4 py-3.5 text-base font-medium text-hm-text"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/reminders"
                    onClick={() => setOpen(false)}
                    className="border-b border-hm-border/60 px-4 py-3.5 text-base font-medium text-hm-text"
                  >
                    Notifications
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false)
                      openCart()
                    }}
                    className="border-b border-hm-border/60 px-4 py-3.5 text-left text-base font-medium text-hm-text"
                  >
                    Bag ({count})
                  </button>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="border-b border-hm-border/60 px-4 py-3.5 text-base font-medium text-hm-text"
                  >
                    Sign in
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      toggleTheme()
                      setOpen(false)
                    }}
                    className="px-4 py-3.5 text-left text-base font-medium text-hm-text"
                  >
                    {isDark ? 'Light mode' : 'Dark mode'}
                  </button>
                </nav>
              </div>
            </aside>
          </div>,
          document.body,
        )
      : null

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-hm-border/80 bg-hm-elevated/90 shadow-hm-soft backdrop-blur-xl">
        <div className="bg-gradient-to-r from-hm-primary via-[#9a2748] to-hm-accent text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] font-medium tracking-wide sm:text-xs">
            <Truck className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
            <span className="line-clamp-1">
              India&apos;s most premium gifting experience — curated delivery nationwide
            </span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="min-w-0 shrink-0">
            <span className="font-display text-xl tracking-tight text-hm-primary sm:text-3xl">
              Uniquworld
            </span>
          </Link>

          <form onSubmit={onSearch} className="relative hidden min-w-0 flex-1 md:block">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gifts, occasions, surprises..."
              className="h-11 w-full rounded-xl border border-hm-border bg-white/80 pl-10 pr-4 text-sm text-hm-text outline-none transition placeholder:text-hm-text-subtle focus:border-hm-accent focus:ring-2 focus:ring-hm-ring"
              aria-label="Search"
            />
          </form>

          <div className="ml-auto flex min-w-0 shrink-0 items-center">
            <Link
              to="/search"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Link>
            <Link
              to="/wishlist"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-hm-accent px-1 text-[10px] font-bold text-hm-primary">
                  {count}
                </span>
              ) : null}
            </button>
            <Link
              to="/account"
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted sm:inline-flex"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/reminders"
              className="hidden min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted sm:inline-flex"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="hidden text-hm-text sm:inline-flex"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav className="relative border-t border-hm-border" aria-label="Primary">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-6 bg-gradient-to-r from-hm-elevated to-transparent lg:hidden"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-6 bg-gradient-to-l from-hm-elevated to-transparent lg:hidden"
            aria-hidden
          />
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex items-stretch gap-0.5 overflow-x-auto overscroll-x-contain scroll-smooth scrollbar-none [-webkit-overflow-scrolling:touch] sm:gap-1">
              {primaryNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap border-b-2 border-transparent px-3 text-[12px] font-semibold tracking-wide text-hm-text-muted transition hover:text-hm-primary sm:px-3.5 sm:text-[13px]',
                      isActive && 'border-hm-accent text-hm-primary',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {mobileMenu}
    </>
  )
}
