import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useCart } from '@/storefront/hooks/useCart'

/** `/cart` opens the side bag drawer instead of a full page. */
export function CartPage() {
  const { openCart } = useCart()

  useEffect(() => {
    openCart()
  }, [openCart])

  return <Navigate to="/" replace />
}
