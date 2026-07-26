import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/storefront/api/account'
import { getErrorMessage, tokenStore } from '@/shared/lib/axios'

const CustomerAuthContext = createContext(null)

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    if (!tokenStore.getAccess()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const data = await authApi.me()
      setUser(data.user || data)
    } catch {
      tokenStore.clear()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    tokenStore.set(data.tokens)
    setUser(data.user)
    return data.user
  }, [])

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      const refreshToken = tokenStore.getRefresh()
      if (refreshToken) await authApi.logout(refreshToken)
    } catch {
      // ignore logout network errors
    } finally {
      tokenStore.clear()
      setUser(null)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const data = await authApi.me()
    const next = data.user || data
    setUser(next)
    return next
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
      errorMessage: getErrorMessage,
    }),
    [user, loading, login, register, logout, refreshUser],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  return ctx
}
