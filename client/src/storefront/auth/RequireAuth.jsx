import { Navigate, useLocation } from 'react-router-dom'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'

export function RequireAuth({ children }) {
  const { isAuthenticated, loading } = useCustomerAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center text-sm text-hm-text-muted">
        Loading your account…
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
