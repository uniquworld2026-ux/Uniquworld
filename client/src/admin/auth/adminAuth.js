const STORAGE_KEY = 'hm_admin_auth_v1'

/** Demo admin credentials (local). */
export const ADMIN_CREDENTIALS = {
  email: 'ranjith.c96me@gmail.com',
  password: '12345678',
  name: 'Ranjith Kumar C',
  role: 'Admin',
}

export function readAdminSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.email || !parsed?.loggedInAt) return null
    return parsed
  } catch {
    return null
  }
}

export function writeAdminSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  return session
}

export function clearAdminSession() {
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Validate email/password against configured admin account.
 * @returns {{ ok: true, session: object } | { ok: false, error: string }}
 */
export function authenticateAdmin(email, password) {
  const normalized = String(email || '').trim().toLowerCase()
  const pass = String(password || '')

  if (!normalized || !pass) {
    return { ok: false, error: 'Email and password are required.' }
  }

  if (
    normalized !== ADMIN_CREDENTIALS.email.toLowerCase() ||
    pass !== ADMIN_CREDENTIALS.password
  ) {
    return { ok: false, error: 'Invalid email or password.' }
  }

  const session = writeAdminSession({
    email: ADMIN_CREDENTIALS.email,
    name: ADMIN_CREDENTIALS.name,
    role: ADMIN_CREDENTIALS.role,
    loggedInAt: new Date().toISOString(),
  })

  return { ok: true, session }
}
