import { NavLink, useLocation } from 'react-router-dom'
import { Heart, Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/storefront/hooks/useCart'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { cn } from '@/shared/utils/cn'

const SHOP_PREFIXES = [
  '/categories',
  '/products',
  '/personalized',
  '/handmade',
  '/surprise',
  '/store',
  '/search',
]

export function shouldHideBottomNav(pathname) {
  if (!pathname) return false
  if (pathname.startsWith('/checkout')) return true
  if (pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password') return true
  if (pathname.includes('/demo')) return true
  return false
}

function isShopPath(pathname) {
  return SHOP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

/**
 * App-style bottom navigation — phones and tablets only (`lg:hidden`).
 */
export function StorefrontBottomNav() {
  const location = useLocation()
  const { count, openCart } = useCart()
  const { isAuthenticated } = useCustomerAuth()
  const pathname = location.pathname

  if (shouldHideBottomNav(pathname)) return null

  const accountTo = isAuthenticated ? '/account' : '/login'
  const shopActive = isShopPath(pathname)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hm-border bg-hm-elevated/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgba(10,45,77,0.18)] backdrop-blur-xl lg:hidden"
      aria-label="Mobile"
    >
      <div className="mx-auto grid h-[3.75rem] max-w-lg grid-cols-5">
        <NavLink
          to="/"
          end
          className={({ isActive }) => itemClass(isActive)}
        >
          <Home className="h-5 w-5" strokeWidth={1.75} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/categories" className={() => itemClass(shopActive)}>
          <LayoutGrid className="h-5 w-5" strokeWidth={1.75} />
          <span>Shop</span>
        </NavLink>

        <button
          type="button"
          onClick={openCart}
          className={itemClass(false)}
          aria-label={count ? `Bag, ${count} items` : 'Bag'}
        >
          <span className="relative">
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {count > 0 ? (
              <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-hm-accent px-1 text-[9px] font-bold leading-none text-white">
                {count > 99 ? '99+' : count}
              </span>
            ) : null}
          </span>
          <span>Bag</span>
        </button>

        <NavLink to="/wishlist" className={({ isActive }) => itemClass(isActive)}>
          <Heart className="h-5 w-5" strokeWidth={1.75} />
          <span>Saved</span>
        </NavLink>

        <NavLink to={accountTo} className={({ isActive }) => itemClass(isActive || pathname.startsWith('/account'))}>
          <User className="h-5 w-5" strokeWidth={1.75} />
          <span>Account</span>
        </NavLink>
      </div>
    </nav>
  )
}

function itemClass(active) {
  return cn(
    'flex min-h-0 min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-semibold tracking-wide transition [touch-action:manipulation]',
    active ? 'text-hm-accent' : 'text-hm-text-muted active:text-hm-primary',
  )
}
