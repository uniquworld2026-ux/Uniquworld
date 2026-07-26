import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '@/admin/auth/AdminAuthContext'

/** Protect admin routes — redirect to login when not signed in. */
export function RequireAdminAuth({ children }) {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return children
}
