import { Outlet } from 'react-router-dom'
import { StorefrontHeader } from '@/storefront/components/layout/StorefrontHeader'
import { StorefrontFooter } from '@/storefront/components/layout/StorefrontFooter'
import { CartProvider } from '@/storefront/hooks/useCart'
import { CartToast } from '@/storefront/components/cart/CartToast'
import { CartDrawer } from '@/storefront/components/cart/CartDrawer'
import { InstallAppPrompt } from '@/storefront/components/pwa/InstallAppPrompt'
import { usePrefetchStorefrontCatalog } from '@/shared/catalog/useLiveCatalog'

function CatalogPrefetch() {
  usePrefetchStorefrontCatalog()
  return null
}

export function StorefrontLayout() {
  return (
    <CartProvider>
      <div className="hm-atmosphere min-h-svh text-hm-text">
        <CatalogPrefetch />
        <StorefrontHeader />
        <main className="hm-animate-in">
          <Outlet />
        </main>
        <StorefrontFooter />
        <CartDrawer />
        <CartToast />
        <InstallAppPrompt />
      </div>
    </CartProvider>
  )
}
