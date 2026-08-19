import { authApi } from '@/storefront/api/account'
import { tokenStore } from '@/shared/lib/axios'

const REFRESH_BUFFER_MS = 3 * 60 * 1000
const CHECK_INTERVAL_MS = 10 * 60 * 1000

function getJwtExpiryMs(token) {
  if (!token) return 0
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return Number(payload.exp) * 1000
  } catch {
    return 0
  }
}

function accessNeedsRefresh(accessToken) {
  if (!accessToken) return true
  const exp = getJwtExpiryMs(accessToken)
  if (!exp) return true
  return exp - Date.now() < REFRESH_BUFFER_MS
}

/** Silently rotate tokens when access is missing or near expiry (30-day refresh window). */
export async function ensureFreshSession() {
  const refresh = tokenStore.getRefresh()
  if (!refresh) return false

  const access = tokenStore.getAccess()
  if (!accessNeedsRefresh(access)) return true

  try {
    const refreshed = await authApi.refresh(refresh)
    const tokens = refreshed?.tokens || refreshed
    if (!tokens?.accessToken) return false
    tokenStore.set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || refresh,
    })
    return true
  } catch {
    return false
  }
}

/** Keep session alive while the app is open — pairs with JWT_REFRESH_EXPIRES_IN=30d on server. */
export function startSessionKeepAlive() {
  if (typeof document === 'undefined') return () => {}

  let timer = null

  const tick = () => {
    if (!tokenStore.getRefresh()) return
    ensureFreshSession().catch(() => {})
  }

  const onVisibility = () => {
    if (document.visibilityState === 'visible') tick()
  }

  document.addEventListener('visibilitychange', onVisibility)
  timer = window.setInterval(tick, CHECK_INTERVAL_MS)
  tick()

  return () => {
    document.removeEventListener('visibilitychange', onVisibility)
    if (timer) window.clearInterval(timer)
  }
}
