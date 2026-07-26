import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  authenticateAdmin,
  clearAdminSession,
  readAdminSession,
} from '@/admin/auth/adminAuth'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => readAdminSession())

  const login = useCallback((email, password) => {
    const result = authenticateAdmin(email, password)
    if (result.ok) {
      setSession(result.session)
    }
    return result
  }, [])

  const logout = useCallback(() => {
    clearAdminSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login,
      logout,
    }),
    [session, login, logout],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return ctx
}
