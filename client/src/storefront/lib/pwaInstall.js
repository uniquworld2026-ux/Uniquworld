/** Shared PWA install state — show prompt right after login on mobile. */

const SESSION_DISMISS_KEY = 'uw_install_prompt_session_dismissed'
const INSTALLED_KEY = 'uw_install_prompt_installed'
const LEGACY_DISMISS_KEY = 'uw_install_prompt_dismissed_at'

const listeners = new Set()
let deferredPrompt = null
let afterLogin = false
let initialized = false

function notify() {
  listeners.forEach((fn) => {
    try {
      fn()
    } catch {
      /* ignore */
    }
  })
}

export function subscribePwaInstall(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getDeferredInstallPrompt() {
  return deferredPrompt
}

export function isAfterLoginInstall() {
  return afterLogin
}

export function isStandalone() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    Boolean(window.navigator.standalone)
  )
}

export function isMobileViewport() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
}

export function isIos() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

function clearLegacyDismiss() {
  try {
    localStorage.removeItem(LEGACY_DISMISS_KEY)
  } catch {
    /* ignore */
  }
}

export function wasInstalled() {
  try {
    if (isStandalone()) return true
    return localStorage.getItem(INSTALLED_KEY) === '1'
  } catch {
    return isStandalone()
  }
}

export function markInstalled() {
  try {
    localStorage.setItem(INSTALLED_KEY, '1')
    sessionStorage.removeItem(SESSION_DISMISS_KEY)
  } catch {
    /* ignore */
  }
  afterLogin = false
  notify()
}

function wasDismissedThisSession() {
  try {
    return sessionStorage.getItem(SESSION_DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function markDismissedThisSession() {
  try {
    sessionStorage.setItem(SESSION_DISMISS_KEY, '1')
  } catch {
    /* ignore */
  }
  afterLogin = false
  notify()
}

export function shouldShowInstallPrompt({ ignoreSessionDismiss = false } = {}) {
  if (wasInstalled()) return false
  if (!ignoreSessionDismiss && wasDismissedThisSession() && !afterLogin) return false
  if (!isMobileViewport()) return false
  return true
}

/** Call once after login / OTP verify — opens install UI on mobile immediately. */
export function requestInstallAfterLogin() {
  if (wasInstalled() || !isMobileViewport()) return
  afterLogin = true
  try {
    sessionStorage.removeItem(SESSION_DISMISS_KEY)
  } catch {
    /* ignore */
  }
  notify()
}

export function initPwaInstall() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  clearLegacyDismiss()

  if (isStandalone()) {
    markInstalled()
    return
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    notify()
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    markInstalled()
  })
}

export function clearDeferredInstallPrompt() {
  deferredPrompt = null
  notify()
}
