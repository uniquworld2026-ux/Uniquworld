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
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
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

              <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain p-4 pb-[max(1.5rem,calc(var(--uw-bottom-nav-h)+1rem))] pl-[max(1rem,env(safe-area-inset-left))]">
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
                <nav className="mb-4 grid grid-cols-2 gap-2">
                  {primaryNav.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex flex-col overflow-hidden rounded-2xl border transition',
                          isActive
                            ? 'border-hm-accent bg-hm-accent/5 ring-1 ring-hm-accent/30'
                            : 'border-hm-border bg-hm-bg hover:border-hm-accent/40',
                        )
                      }
                    >
                      <div className="aspect-[5/3] overflow-hidden bg-hm-muted">
                        <img
                          src={item.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <span className="px-2.5 py-2.5 text-center text-sm font-semibold text-hm-primary">
                        {item.label}
                      </span>
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
        <div className="bg-gradient-to-r from-hm-primary via-[#0d3a63] to-hm-accent text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-1.5 text-center text-[11px] font-medium tracking-wide sm:text-xs">
            <Truck className="hidden h-3.5 w-3.5 shrink-0 sm:block" />
            <span className="line-clamp-1">
              India&apos;s most premium gifting experience — curated delivery nationwide
            </span>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-3 py-2 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <BrandLogo
            priority
            className="min-w-0 shrink-0"
            imgClassName="h-7 w-auto max-w-[7.5rem] object-contain object-left sm:h-10 sm:max-w-none"
          />

          <form onSubmit={onSearch} className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle sm:left-3.5" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gifts…"
              className="h-10 w-full rounded-xl border border-hm-border bg-white/80 pl-9 pr-3 text-sm text-hm-text outline-none transition placeholder:text-hm-text-subtle focus:border-hm-accent focus:ring-2 focus:ring-hm-ring sm:h-11 sm:pl-10 sm:pr-4"
              aria-label="Search"
            />
          </form>

          <div className="ml-auto hidden min-w-0 shrink-0 items-center lg:flex">
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
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-hm-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              ) : null}
            </button>
            <Link
              to="/account"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/reminders"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-hm-text hover:bg-hm-muted"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="text-hm-text"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <nav
          className="flex gap-2 overflow-x-auto px-3 pb-2.5 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
          aria-label="Shop"
        >
          {primaryNav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition',
                  isActive
                    ? 'border-hm-accent bg-hm-accent/10 text-hm-accent'
                    : 'border-hm-border bg-hm-bg text-hm-text-muted',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <nav className="hidden border-t border-hm-border bg-hm-elevated/95 lg:block" aria-label="Primary">
          <div className="mx-auto grid max-w-7xl grid-cols-5">
            {primaryNav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'group relative flex min-w-0 flex-col items-center gap-0.5 border-b-2 px-0.5 py-1 transition sm:px-1',
                    isActive
                      ? 'border-hm-accent bg-hm-accent/[0.04]'
                      : 'border-transparent hover:bg-hm-muted/50',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        'relative block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 transition duration-300 sm:h-8 sm:w-8',
                        isActive
                          ? 'ring-2 ring-hm-accent shadow-[0_0_0_2px_rgba(217,44,43,0.12)]'
                          : 'ring-hm-border group-hover:ring-hm-accent/50',
                      )}
                    >
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        loading="lazy"
                        decoding="async"
                      />
                    </span>
                    <span
                      className={cn(
                        'max-w-full truncate text-center text-[8px] font-semibold leading-tight tracking-wide sm:text-[10px]',
                        isActive ? 'text-hm-primary' : 'text-hm-text-muted group-hover:text-hm-primary',
                      )}
                    >
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      {mobileMenu}
    </>
  )
}
