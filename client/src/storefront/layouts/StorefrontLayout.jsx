import { Outlet, useLocation } from 'react-router-dom'
import { StorefrontHeader } from '@/storefront/components/layout/StorefrontHeader'
import { StorefrontFooter } from '@/storefront/components/layout/StorefrontFooter'
import {
  StorefrontBottomNav,
  shouldHideBottomNav,
} from '@/storefront/components/layout/StorefrontBottomNav'
import { CartProvider } from '@/storefront/hooks/useCart'
import { CartToast } from '@/storefront/components/cart/CartToast'
import { CartDrawer } from '@/storefront/components/cart/CartDrawer'
import { InstallAppPrompt } from '@/storefront/components/pwa/InstallAppPrompt'
import { usePrefetchStorefrontCatalog } from '@/shared/catalog/useLiveCatalog'
import { cn } from '@/shared/utils/cn'

function CatalogPrefetch() {
  usePrefetchStorefrontCatalog()
  return null
}

export function StorefrontLayout() {
  const location = useLocation()
  const showBottomNav = !shouldHideBottomNav(location.pathname)

  return (
    <CartProvider>
      <div
        className={cn(
          'hm-atmosphere min-h-svh text-hm-text',
          showBottomNav && 'has-mobile-bottom-nav',
        )}
      >
        <CatalogPrefetch />
        <StorefrontHeader />
        <main className="hm-animate-in">
          <Outlet />
        </main>
        <StorefrontFooter />
        {showBottomNav ? <StorefrontBottomNav /> : null}
        <CartDrawer />
        <CartToast />
        <InstallAppPrompt />
      </div>
    </CartProvider>
  )
}
