import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  authenticateAdmin,
  clearAdminSession,
  readAdminSession,
  verifyAdminOtp,
} from '@/admin/auth/adminAuth'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => readAdminSession())

  const login = useCallback(async (email, password) => {
    const result = await authenticateAdmin(email, password)
    if (result.ok && result.session) {
      setSession(result.session)
    }
    return result
  }, [])

  const verifyOtp = useCallback(async (email, code) => {
    const result = await verifyAdminOtp(email, code)
    if (result.ok && result.session) {
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
      verifyOtp,
      logout,
    }),
    [session, login, verifyOtp, logout],
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
