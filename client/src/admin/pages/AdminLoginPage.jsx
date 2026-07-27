import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import { useAdminAuth } from '@/admin/auth/AdminAuthContext'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

/**
 * Admin portal login — email + password, then email OTP.
 */
export function AdminLoginPage() {
  const { login, verifyOtp, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [otpStep, setOtpStep] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = location.state?.from || '/admin'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setSubmitting(true)
    try {
      const result = await login(email, password)
      if (!result.ok) {
        setError(result.error)
        return
      }
      if (result.requiresOtp) {
        setOtpStep({
          email: result.email || email,
          purpose: result.purpose || 'admin_login',
        })
        setInfo(result.message || 'OTP sent to your email.')
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Sign in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await verifyOtp(otpStep.email, otpCode)
      if (!result.ok) {
        setError(result.error)
        return
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'OTP verification failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-shell flex min-h-svh items-center justify-center bg-admin-bg px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block font-display text-3xl text-admin-primary">
            Uniquworld
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-admin-text-muted">
            Admin portal
          </p>
        </div>

        <div className="rounded-2xl border border-admin-border bg-admin-elevated p-6 shadow-admin sm:p-8">
          <h1 className="text-xl font-semibold tracking-tight text-admin-text">
            {otpStep ? 'Enter OTP' : 'Sign in'}
          </h1>
          <p className="mt-1 text-sm text-admin-text-muted">
            {otpStep
              ? `We emailed a one-time code to ${otpStep.email}`
              : 'Password first, then email OTP — required for every admin sign-in.'}
          </p>

          {otpStep ? (
            <form className="mt-6 space-y-4" onSubmit={handleOtpSubmit}>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-admin-text-muted">OTP code</span>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="6-digit code"
                    className="h-11 w-full rounded-xl border border-admin-border bg-admin-bg pl-10 pr-3 text-sm text-admin-text outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
                    required
                  />
                </div>
              </label>

              {error ? (
                <p className="rounded-lg border border-admin-danger/30 bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger" role="alert">
                  {error}
                </p>
              ) : null}
              {info ? <p className="text-xs text-admin-accent">{info}</p> : null}

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-admin-primary text-admin-elevated hover:opacity-90"
                disabled={submitting}
              >
                {submitting ? 'Verifying…' : 'Verify & enter admin'}
              </Button>
              <button
                type="button"
                className="w-full text-center text-xs text-admin-text-muted hover:text-admin-text disabled:opacity-50"
                disabled={submitting || !password}
                onClick={async () => {
                  setError('')
                  setInfo('')
                  setSubmitting(true)
                  try {
                    const result = await login(otpStep.email || email, password)
                    if (!result.ok) {
                      setError(result.error)
                      return
                    }
                    if (result.requiresOtp) {
                      setOtpStep({
                        email: result.email || otpStep.email || email,
                        purpose: result.purpose || 'admin_login',
                      })
                      setOtpCode('')
                      setInfo(result.message || 'A new OTP was sent. Check inbox and spam.')
                    }
                  } catch (err) {
                    setError(err?.message || 'Could not resend OTP.')
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                Resend OTP
              </button>
              <button
                type="button"
                className="w-full text-center text-xs text-admin-text-muted hover:text-admin-text"
                onClick={() => {
                  setOtpStep(null)
                  setOtpCode('')
                  setError('')
                  setInfo('')
                }}
              >
                ← Back to password
              </button>
            </form>
          ) : (
            <form className="mt-6 space-y-4" onSubmit={handlePasswordSubmit}>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-admin-text-muted">Email</span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
                  <input
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-admin-border bg-admin-bg pl-10 pr-3 text-sm text-admin-text outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
                    required
                  />
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-admin-text-muted">Password</span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-admin-border bg-admin-bg pl-10 pr-11 text-sm text-admin-text outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-ring"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-admin-text-muted hover:bg-admin-muted hover:text-admin-text"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              {error ? (
                <p
                  className={cn(
                    'rounded-lg border border-admin-danger/30 bg-admin-danger/10 px-3 py-2 text-xs text-admin-danger',
                  )}
                  role="alert"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="primary"
                className="w-full bg-admin-primary text-admin-elevated hover:opacity-90"
                disabled={submitting}
              >
                {submitting ? 'Sending OTP…' : 'Continue'}
              </Button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-admin-text-muted">
          <Link to="/" className="hover:text-admin-text">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  )
}
