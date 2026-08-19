import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/storefront/api/account'
import { getErrorMessage, tokenStore } from '@/shared/lib/axios'
import { requestInstallAfterLogin } from '@/storefront/lib/pwaInstall'
import { ensureFreshSession, startSessionKeepAlive } from '@/storefront/lib/sessionRefresh'

const CustomerAuthContext = createContext(null)

async function restoreSession() {
  const access = tokenStore.getAccess()
  const refresh = tokenStore.getRefresh()

  if (!access && !refresh) {
    return null
  }

  const fresh = await ensureFreshSession()
  if (!fresh && !tokenStore.getAccess()) {
    throw Object.assign(new Error('Refresh failed'), { response: { status: 401 } })
  }

  const data = await authApi.me()
  return data.user || data
}

export function CustomerAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    if (!tokenStore.getAccess() && !tokenStore.getRefresh()) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const nextUser = await restoreSession()
      setUser(nextUser)
    } catch (err) {
      const status = err?.response?.status
      // Only wipe browser session on auth failure — keep tokens on network blips
      if (status === 401 || status === 403) {
        tokenStore.clear()
        setUser(null)
      } else {
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  useEffect(() => {
    if (!user) return undefined
    return startSessionKeepAlive()
  }, [user])

  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password })
    if (data?.requiresOtp) {
      return data
    }
    if (data?.tokens) {
      tokenStore.set(data.tokens)
      setUser(data.user)
      requestInstallAfterLogin()
    }
    return data
  }, [])

  const completeLoginWithOtp = useCallback(async ({ email, code, purpose }) => {
    const data = await authApi.verifyOtp({ email, code, purpose })
    if (data?.tokens) {
      tokenStore.set(data.tokens)
      setUser(data.user)
      requestInstallAfterLogin()
    }
    return data
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

  const checkoutStart = useCallback(async ({ email, firstName }) => {
    return authApi.checkoutStart({ email, firstName })
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      completeLoginWithOtp,
      checkoutStart,
      register,
      logout,
      refreshUser,
      errorMessage: getErrorMessage,
    }),
    [user, loading, login, completeLoginWithOtp, checkoutStart, register, logout, refreshUser],
  )

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext)
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider')
  return ctx
}
