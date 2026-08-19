import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { KeyRound, Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/storefront/components/ui/Input'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { useCart } from '@/storefront/hooks/useCart'
import { accountApi, authApi } from '@/storefront/api/account'
import { getErrorMessage } from '@/shared/lib/axios'
import { validatePassword } from '@/shared/lib/password'
import { formatINR, loadRazorpay } from '@/storefront/lib/commerce'
import { calcCartTotals } from '@/storefront/lib/orderPricing'
import { BillingSummary } from '@/storefront/components/checkout/BillingSummary'
import { cn } from '@/shared/utils/cn'

function AuthShell({ title, subtitle, children, footer, badge }) {
  return (
    <div className="min-h-[80svh] bg-gradient-to-b from-hm-muted/80 to-hm-bg px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center sm:text-left">
          <BrandLogo priority imgClassName="mx-auto h-11 sm:mx-0 sm:h-12" />
          {badge ? (
            <p className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-hm-accent/30 bg-hm-accent-muted px-3 py-1 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-hm-accent">
              <ShieldCheck className="h-3.5 w-3.5" />
              {badge}
            </p>
          ) : null}
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-hm-text sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 font-sans text-sm leading-relaxed text-hm-text-muted">{subtitle}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-hm-border bg-hm-elevated p-5 shadow-hm-soft sm:p-6">
          {children}
        </div>

        {footer ? (
          <div className="mt-6 text-center font-sans text-sm leading-relaxed text-hm-text-muted sm:text-left">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function TextField({ label, type = 'text', icon: Icon, register, error, placeholder }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans text-xs font-medium text-hm-text-muted">{label}</span>
      <span className="relative block">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
        ) : null}
        <Input
          type={type}
          placeholder={placeholder}
          className={cn(Icon && 'pl-10')}
          {...register}
        />
      </span>
      {error ? <span className="font-sans text-xs text-hm-danger">{error}</span> : null}
    </label>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, completeLoginWithOtp, isAuthenticated } = useCustomerAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [otpStep, setOtpStep] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const from = location.state?.from || '/account'

  useEffect(() => {
    if (isAuthenticated) navigate(from, { replace: true })
  }, [isAuthenticated, navigate, from])

  if (otpStep) {
    const isLoginOtp = otpStep.purpose === 'login'
    return (
      <AuthShell
        title={isLoginOtp ? 'Enter login code' : 'Verify email'}
        subtitle={`We sent a 6-digit code to ${otpStep.email}`}
        badge="Secure sign in"
        footer={
          <Link to="/login" className="text-hm-accent hover:underline" onClick={() => setOtpStep(null)}>
            Back to sign in
          </Link>
        }
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setInfo('')
            setVerifying(true)
            try {
              const data = await completeLoginWithOtp({
                email: otpStep.email,
                code: otpCode,
                purpose: otpStep.purpose,
              })
              if (data?.tokens) {
                navigate(from, { replace: true })
                return
              }
              setInfo(data?.message || 'Email verified. Sign in again to receive your login OTP.')
              setOtpStep(null)
              setOtpCode('')
            } catch (err) {
              setError(getErrorMessage(err))
            } finally {
              setVerifying(false)
            }
          }}
        >
          <Input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="6-digit OTP"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="text-center tracking-[0.3em]"
          />
          {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
          {info ? <p className="text-sm text-hm-accent">{info}</p> : null}
          <Button type="submit" variant="primary" className="w-full" disabled={verifying}>
            {verifying ? 'Verifying…' : isLoginOtp ? 'Verify & sign in' : 'Verify email'}
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in with your email and password. We'll send a one-time code to keep your account secure."
      badge="Customer account"
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-medium text-hm-accent hover:underline">
            Create account
          </Link>
          <br className="hidden sm:block" />
          <span className="hidden sm:inline"> · </span>
          <Link to="/forgot-password" className="font-medium text-hm-accent hover:underline">
            Forgot password?
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError('')
          setInfo('')
          try {
            const data = await login(values.email, values.password)
            if (data?.requiresOtp) {
              setOtpStep({
                email: data.email || values.email,
                purpose: data.purpose,
              })
              setInfo(data.message || 'OTP sent to your email. Check your inbox.')
              return
            }
            navigate(from, { replace: true })
          } catch (err) {
            setError(getErrorMessage(err, 'Invalid email or password'))
          }
        })}
      >
        <TextField
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@email.com"
          register={register('email', { required: 'Email required' })}
          error={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          icon={Lock}
          placeholder="Your password"
          register={register('password', { required: 'Password required' })}
          error={errors.password?.message}
        />
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        {info ? <p className="text-sm text-hm-accent">{info}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Continue'}
        </Button>
      </form>
    </AuthShell>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const { register: registerUser, completeLoginWithOtp, isAuthenticated } = useCustomerAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [otpStep, setOtpStep] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    if (isAuthenticated) navigate('/account', { replace: true })
  }, [isAuthenticated, navigate])

  if (otpStep) {
    return (
      <AuthShell
        title="Verify email"
        subtitle={`Enter the OTP sent to ${otpStep.email}`}
        badge="Almost there"
        footer={
          <Link to="/login" className="font-medium text-hm-accent hover:underline">
            Back to sign in
          </Link>
        }
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setVerifying(true)
            try {
              const data = await completeLoginWithOtp({
                email: otpStep.email,
                code: otpCode,
                purpose: 'email_verification',
              })
              if (data?.tokens) {
                navigate('/account', { replace: true })
                return
              }
              setInfo(data?.message || 'Email verified. You can sign in now.')
              setTimeout(() => navigate('/login'), 1200)
            } catch (err) {
              setError(getErrorMessage(err))
            } finally {
              setVerifying(false)
            }
          }}
        >
          <Input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="6-digit OTP"
            inputMode="numeric"
            autoComplete="one-time-code"
            className="text-center tracking-[0.3em]"
          />
          {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
          {info ? <p className="text-sm text-hm-accent">{info}</p> : null}
          <Button type="submit" variant="primary" className="w-full" disabled={verifying}>
            {verifying ? 'Verifying…' : 'Verify & continue'}
          </Button>
        </form>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Join Uniquworld to track orders, save addresses, and manage your profile in one place."
      badge="New customer"
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-hm-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError('')
          setInfo('')
          try {
            const nameParts = values.name.trim().split(/\s+/)
            await registerUser({
              email: values.email,
              password: values.password,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(' ') || undefined,
            })
            setOtpStep({
              email: values.email,
            })
            setInfo('Verification code sent to your email.')
          } catch (err) {
            setError(getErrorMessage(err))
          }
        })}
      >
        <TextField
          label="Full name"
          icon={User}
          placeholder="Your name"
          register={register('name', { required: 'Name required' })}
          error={errors.name?.message}
        />
        <TextField
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@email.com"
          register={register('email', { required: 'Email required' })}
          error={errors.email?.message}
        />
        <TextField
          label="Password"
          type="password"
          icon={KeyRound}
          placeholder="Min. 8 characters"
          register={register('password', {
            required: 'Password required',
            validate: validatePassword,
          })}
          error={errors.password?.message}
        />
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}

export function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll email you a one-time code to reset your password."
      badge="Account recovery"
      footer={
        <Link to="/login" className="font-medium text-hm-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          setError('')
          setMessage('')
          try {
            const data = await authApi.forgotPassword(values.email)
            setMessage(data?.message || 'If that email exists, an OTP has been sent.')
          } catch (err) {
            setError(getErrorMessage(err))
          }
        })}
      >
        <TextField
          label="Email"
          type="email"
          icon={Mail}
          placeholder="you@email.com"
          register={register('email', { required: 'Email required' })}
          error={errors.email?.message}
        />
        {message ? <p className="text-sm text-hm-accent">{message}</p> : null}
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          Send OTP
        </Button>
      </form>
    </AuthShell>
  )
}

export function WishlistPage() {
  const { isAuthenticated, loading } = useCustomerAuth()
  const { addItem } = useCart()
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isAuthenticated) return
    accountApi
      .listWishlist()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
  }, [isAuthenticated])

  if (loading) return <p className="p-8 text-sm text-hm-text-muted">Loading…</p>

  if (!isAuthenticated) {
    return (
      <div>
        <PageHero eyebrow="Saved" title="Wishlist" description="Sign in to sync your saved gifts." />
        <div className="mx-auto max-w-3xl px-5 py-12 text-center sm:px-8">
          <Link to="/login"><Button variant="primary">Sign in</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHero eyebrow="Saved" title="Wishlist" description="Gifts you’re considering — move them to bag when ready." />
      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        {!items.length ? (
          <div className="text-center">
            <p className="text-sm text-hm-text-muted">Your wishlist is empty for now.</p>
            <Link to="/categories" className="mt-6 inline-block">
              <Button variant="primary">Browse gifts</Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const product = item.product || {}
              return (
                <li key={item.id} className="flex items-center gap-4 rounded-2xl border border-hm-border bg-hm-elevated p-4">
                  {product.image ? (
                    <img src={product.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg bg-hm-muted" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-hm-text">{product.name}</p>
                    {product.price != null ? (
                      <p className="text-sm text-hm-text-muted">{formatINR(product.price)}</p>
                    ) : null}
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      addItem({
                        id: product.id || item.catalogKey,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        tag: product.tag,
                      })
                    }
                  >
                    Add to bag
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await accountApi.removeWishlist(item.catalogKey)
                      setItems((prev) => prev.filter((i) => i.id !== item.id))
                    }}
                  >
                    Remove
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { isAuthenticated, user, loading } = useCustomerAuth()
  const { items, subtotal, clearCart } = useCart()
  const [addresses, setAddresses] = useState([])
  const [addressId, setAddressId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
    },
  })

  useEffect(() => {
    if (!isAuthenticated) return
    accountApi.listAddresses().then((list) => {
      setAddresses(list)
      const def = list.find((a) => a.isDefault) || list[0]
      if (def) setAddressId(def.id)
    })
  }, [isAuthenticated])

  if (loading) {
    return <p className="p-8 text-sm text-hm-text-muted">Loading checkout…</p>
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-hm-text">Sign in to checkout</h1>
        <p className="mt-2 text-sm text-hm-text-muted">Your bag will stay ready after login.</p>
        <Link to="/login" state={{ from: '/checkout' }} className="mt-6 inline-block">
          <Button variant="primary">Sign in</Button>
        </Link>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-hm-text">Your bag is empty</h1>
        <Link to="/categories" className="mt-6 inline-block">
          <Button variant="primary">Browse gifts</Button>
        </Link>
      </div>
    )
  }

  const billing = calcCartTotals(items)
  const total = billing.totalAmount

  const openRazorpay = async (payment, order) => {
    const ok = await loadRazorpay()
    if (!ok) throw new Error('Unable to load Razorpay checkout')

    const brandName = payment.name || 'Uniquworld'
    const logo =
      payment.image ||
      `${window.location.origin}/brand/uniquworld-icon.png`

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        name: brandName,
        description: payment.description || `Uniquworld · Order ${order.orderNumber}`,
        image: logo,
        order_id: payment.razorpayOrderId,
        notes: {
          brand: brandName,
          store: 'Uniquworld',
          orderNumber: order.orderNumber,
        },
        prefill: {
          name: [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.firstName,
          email: user?.email,
          contact: user?.phone || '',
        },
        theme: {
          color: payment.themeColor || '#4a3426',
        },
        handler: async (response) => {
          try {
            const verified = await accountApi.verifyPayment({
              orderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            resolve(verified)
          } catch (err) {
            reject(err)
          }
        },
        modal: {
          ondismiss: () => reject(new Error('Payment cancelled')),
        },
      })
      rzp.open()
    })
  }

  const place = async (payload) => {
    setBusy(true)
    setError('')
    try {
      const result = await accountApi.placeOrder({
        ...payload,
        items: items.map((item) => ({
          id: item.id,
          catalogKey: String(item.id),
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image,
          channel: item.channel || item.meta?.channel,
          storeId: item.meta?.storeId || item.storeId,
          storeProductId: item.meta?.storeProductId || (item.channel === 'store' ? item.id : undefined),
          meta: item.meta,
        })),
        paymentMethod,
      })

      if (result.payment?.requiresPayment) {
        const verified = await openRazorpay(result.payment, result.order)
        clearCart()
        navigate(`/order-success?order=${verified.orderNumber || result.order.orderNumber}`)
        return
      }

      clearCart()
      navigate(`/order-success?order=${result.order.orderNumber}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHero eyebrow="Checkout" title="Secure checkout" description="Pay with Razorpay or Cash on Delivery. Shipments via Shiprocket." />
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {addresses.length ? (
            <section className="rounded-2xl border border-hm-border bg-hm-elevated p-6">
              <h2 className="text-sm font-semibold text-hm-text">Saved addresses</h2>
              <div className="mt-3 space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className="flex cursor-pointer gap-3 rounded-xl border border-hm-border p-3 text-sm hover:border-hm-accent">
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === a.id}
                      onChange={() => setAddressId(a.id)}
                    />
                    <span>
                      <span className="font-medium text-hm-text">{a.fullName}</span>
                      <br />
                      <span className="text-hm-text-muted">
                        {a.line1}, {a.city} {a.postalCode}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <Button
                className="mt-4"
                variant="primary"
                disabled={busy || !addressId}
                onClick={() => place({ addressId })}
              >
                {busy ? 'Placing…' : 'Place order'}
              </Button>
            </section>
          ) : null}

          <form
            className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-6"
            onSubmit={handleSubmit((values) =>
              place({
                shippingAddress: {
                  ...values,
                  country: 'India',
                },
              }),
            )}
          >
            <h2 className="text-sm font-semibold text-hm-text">
              {addresses.length ? 'Or ship to a new address' : 'Shipping address'}
            </h2>
            <input required placeholder="Full name" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('fullName', { required: true })} />
            <input required placeholder="Phone" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('phone', { required: true })} />
            <input required placeholder="Address line" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('line1', { required: true })} />
            <input placeholder="Landmark / line 2" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('line2')} />
            <div className="grid gap-3 sm:grid-cols-3">
              <input required placeholder="City" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('city', { required: true })} />
              <input required placeholder="State" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('state', { required: true })} />
              <input required placeholder="Pincode" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" {...register('postalCode', { required: true })} />
            </div>

            <h2 className="pt-2 text-sm font-semibold text-hm-text">Payment</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm"
            >
              <option value="upi">UPI (Razorpay)</option>
              <option value="card">Card (Razorpay)</option>
              <option value="cod">Cash on delivery</option>
            </select>

            {error ? <p className="text-sm text-hm-danger">{error}</p> : null}

            <Button type="submit" variant="primary" className="w-full" size="lg" disabled={busy}>
              {busy ? 'Processing…' : `Pay ${formatINR(total)}`}
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-hm-border bg-hm-elevated p-6 text-sm">
          <p className="font-semibold text-hm-text">Price details</p>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.key} className="flex justify-between gap-3 text-hm-text-muted">
                <span className="line-clamp-2 pr-2">
                  {item.name} × {item.qty}
                </span>
                <span className="shrink-0 text-hm-text">{formatINR(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t border-hm-border pt-4">
            <BillingSummary {...billing} compact />
          </div>
        </div>
      </div>
    </div>
  )
}

export function OrderSuccessPage() {
  const [params] = useSearchParams()
  const orderNumber = params.get('order')

  return (
    <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col items-center justify-center px-5 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">Thank you</p>
      <h1 className="mt-3 font-display text-4xl text-hm-text sm:text-5xl">Order placed</h1>
      <p className="mt-3 text-sm text-hm-text-muted">
        {orderNumber
          ? `Order ${orderNumber} is confirmed. Track it anytime from My Orders.`
          : 'We’ve received your order. A confirmation is on its way.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/account/orders"><Button variant="primary">View orders</Button></Link>
        <Link to="/categories"><Button variant="outline">Continue shopping</Button></Link>
      </div>
    </div>
  )
}
