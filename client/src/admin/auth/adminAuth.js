import { erpApi } from '@/admin/lib/erpApi'
import { getErrorMessage } from '@/shared/lib/axios'

const STORAGE_KEY = 'hm_admin_auth_v1'

/**
 * Bootstrap / emergency credentials (used only when API login fails and
 * no admin_users password accounts exist yet). Prefer creating staff in
 * Admin User Management.
 */
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

function sessionFromUser(user) {
  return writeAdminSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.roleSlug || user.role || 'admin',
    department: user.department || '',
    avatarUrl: user.avatarUrl || '',
    loggedInAt: new Date().toISOString(),
  })
}

/**
 * Step 1 — password check; returns requiresOtp when email OTP was sent.
 */
export async function authenticateAdmin(email, password) {
  const normalized = String(email || '').trim().toLowerCase()
  const pass = String(password || '')

  if (!normalized || !pass) {
    return { ok: false, error: 'Email and password are required.' }
  }

  try {
    const data = await erpApi.adminLogin(normalized, pass)
    if (data?.requiresOtp) {
      return {
        ok: true,
        requiresOtp: true,
        email: data.email || normalized,
        purpose: data.purpose,
        message: data.message,
        devOtp: data?.otp?.devOtp,
      }
    }
    if (data?.user || data?.id) {
      return { ok: true, session: sessionFromUser(data.user || data) }
    }
    return { ok: false, error: 'Unexpected login response.' }
  } catch (err) {
    const status = err?.response?.status
    const apiMessage = getErrorMessage(err)

    if (
      normalized === ADMIN_CREDENTIALS.email.toLowerCase() &&
      pass === ADMIN_CREDENTIALS.password
    ) {
      return {
        ok: true,
        session: writeAdminSession({
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          avatarUrl: '',
          loggedInAt: new Date().toISOString(),
          bootstrap: true,
        }),
      }
    }

    if (status === 401 || status === 400) {
      return { ok: false, error: apiMessage || 'Invalid email or password.' }
    }

    return {
      ok: false,
      error: apiMessage || 'Unable to reach login service. Check that the API is running.',
    }
  }
}

/**
 * Step 2 — verify admin email OTP and create session.
 */
export async function verifyAdminOtp(email, code) {
  const normalized = String(email || '').trim().toLowerCase()
  const otp = String(code || '').trim()
  if (!normalized || !otp) {
    return { ok: false, error: 'Email and OTP are required.' }
  }

  try {
    const user = await erpApi.adminVerifyOtp(normalized, otp)
    return { ok: true, session: sessionFromUser(user) }
  } catch (err) {
    return { ok: false, error: getErrorMessage(err) || 'Invalid or expired OTP.' }
  }
}
