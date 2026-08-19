import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Lock, Mail, ShieldCheck, User } from 'lucide-react'
import { BillingSummary } from '@/storefront/components/checkout/BillingSummary'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/storefront/components/ui/Input'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { accountApi } from '@/storefront/api/account'
import { useStorefrontProduct } from '@/shared/catalog/useLiveCatalog'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatINR, loadRazorpay } from '@/storefront/lib/commerce'
import { calcOrderTotals } from '@/storefront/lib/orderPricing'

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans text-xs font-medium text-hm-text-muted">{label}</span>
      {children}
    </label>
  )
}

/** Guest-friendly buy now — name/email OTP, auto account, Flipkart-style billing, Razorpay + Shiprocket order. */
export function BuyNowCheckoutPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const productId = params.get('product') || ''
  const qty = Math.max(1, Number(params.get('qty')) || 1)
  const { product, isLoading: productLoading } = useStorefrontProduct(productId)
  const { isAuthenticated, user, loading: authLoading, checkoutStart, completeLoginWithOtp, login } =
    useCustomerAuth()

  const [step, setStep] = useState('identity')
  const [otpPurpose, setOtpPurpose] = useState('email_verification')
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
    },
  })

  useEffect(() => {
    if (authLoading) return
    if (isAuthenticated) setStep('delivery')
  }, [authLoading, isAuthenticated])

  const lineTotal = product ? Number(product.price) * qty : 0
  const billing = useMemo(() => calcOrderTotals(lineTotal), [lineTotal])

  async function verifyOtpAndContinue() {
    setError('')
    setBusy(true)
    try {
      await completeLoginWithOtp({
        email: checkoutEmail,
        code: otpCode,
        purpose: otpPurpose,
      })
      setStep('delivery')
      setInfo('Email verified — you are signed in. Add delivery details to complete your order.')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  async function openRazorpay(payment, order) {
    const ok = await loadRazorpay()
    if (!ok) throw new Error('Unable to load Razorpay checkout')

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: payment.keyId,
        amount: payment.amount,
        currency: payment.currency || 'INR',
        name: payment.name || 'Uniquworld',
        description: payment.description || `Order ${order.orderNumber}`,
        image: payment.image,
        order_id: payment.razorpayOrderId,
        prefill: {
          name: user?.firstName || '',
          email: user?.email || checkoutEmail,
          contact: user?.phone || '',
        },
        theme: { color: payment.themeColor || '#0a2d4d' },
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
            accountApi.failPayment({ orderId: order.id, reason: 'Payment verification failed' }).catch(() => {})
            reject(err)
          }
        },
        modal: {
          ondismiss: () => {
            accountApi.failPayment({ orderId: order.id, reason: 'Payment cancelled' }).catch(() => {})
            reject(new Error('Payment cancelled'))
          },
        },
      })
      rzp.on('payment.failed', (resp) => {
        const reason = resp?.error?.description || 'Payment failed'
        accountApi.failPayment({ orderId: order.id, reason }).catch(() => {})
        reject(new Error(reason))
      })
      rzp.open()
    })
  }

  const placeOrder = handleSubmit(async (values) => {
    if (!product) return
    setBusy(true)
    setError('')
    try {
      const result = await accountApi.placeOrder({
        items: [
          {
            id: product.id,
            catalogKey: String(product.id),
            name: product.name,
            productName: product.name,
            price: product.price,
            unitPrice: product.price,
            quantity: qty,
            image: product.image || product.images?.[0],
            imageUrl: product.image || product.images?.[0],
            productId: product.id,
          },
        ],
        paymentMethod,
        shippingAddress: {
          fullName: values.fullName || user?.firstName || 'Customer',
          phone: values.phone,
          line1: values.line1,
          line2: values.line2,
          city: values.city,
          state: values.state,
          postalCode: values.postalCode,
          country: 'India',
          email: user?.email || checkoutEmail,
        },
      })

      if (result.payment?.requiresPayment) {
        const verified = await openRazorpay(result.payment, result.order)
        navigate(`/order-success?order=${verified.orderNumber || result.order.orderNumber}`)
        return
      }

      navigate(`/order-success?order=${result.order.orderNumber}`)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  })

  if (productLoading || authLoading) {
    return <p className="p-8 text-center font-sans text-sm text-hm-text-muted">Loading checkout…</p>
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-hm-text">Product not found</h1>
        <Link to="/categories" className="mt-6 inline-block">
          <Button variant="primary">Browse gifts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-[80svh] bg-hm-muted/30 pb-16">
      <div className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center gap-1 font-sans text-sm text-hm-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to product
          </Link>
          <h1 className="mt-3 font-display text-3xl font-semibold text-hm-text">Buy now</h1>
          <p className="mt-1 font-sans text-sm text-hm-text-muted">
            Secure checkout · Razorpay payments · Shiprocket delivery
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-3xl gap-6 px-4 py-8 sm:px-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
            <div className="flex gap-4">
              <img
                src={product.image || product.images?.[0]}
                alt=""
                className="h-24 w-24 rounded-xl border border-hm-border object-contain bg-hm-muted p-1"
              />
              <div className="min-w-0">
                <p className="font-display text-lg font-semibold text-hm-text">{product.name}</p>
                <p className="mt-1 font-sans text-sm text-hm-text-muted">Qty {qty}</p>
                <p className="mt-2 font-sans text-lg font-bold text-hm-primary">
                  {formatINR(product.price)}
                </p>
              </div>
            </div>
          </section>

          {step === 'identity' ? (
            <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
              <div className="mb-4 flex items-center gap-2 font-sans text-sm font-semibold text-hm-text">
                <ShieldCheck className="h-4 w-4 text-hm-accent" />
                Your details
              </div>
              <p className="mb-4 font-sans text-sm text-hm-text-muted">
                Enter your name and email. New customers get a one-time OTP to verify email. After
                that, sign in with email and password — we will not send another login OTP.
              </p>
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  const name = String(fd.get('name') || '').trim()
                  const email = String(fd.get('email') || '').trim()
                  setError('')
                  setInfo('')
                  setBusy(true)
                  try {
                    const data = await checkoutStart({ email, firstName: name })
                    setCheckoutEmail(data.email || email)
                    if (data.requiresPassword) {
                      setStep('password')
                      setInfo(data.message || 'Account already verified. Enter your password to continue.')
                      return
                    }
                    setOtpPurpose(data.purpose || 'email_verification')
                    setStep('otp')
                    setInfo(data.message || 'OTP sent to your email.')
                  } catch (err) {
                    setError(getErrorMessage(err))
                  } finally {
                    setBusy(false)
                  }
                }}
              >
                <Field label="Full name">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
                    <Input name="name" required placeholder="Your name" className="pl-10" />
                  </div>
                </Field>
                <Field label="Email">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="you@email.com"
                      className="pl-10"
                    />
                  </div>
                </Field>
                {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}
                {info ? <p className="font-sans text-sm text-hm-success">{info}</p> : null}
                <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                  {busy ? 'Continuing…' : 'Continue'}
                </Button>
              </form>
            </section>
          ) : null}

          {step === 'password' ? (
            <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
              <p className="font-sans text-sm font-semibold text-hm-text">Sign in</p>
              <p className="mt-1 font-sans text-sm text-hm-text-muted">
                {checkoutEmail} is already verified. Enter your password — no OTP email this time.
              </p>
              <form
                className="mt-4 space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setError('')
                  setBusy(true)
                  try {
                    const data = await login(checkoutEmail, password)
                    if (data?.requiresOtp) {
                      setOtpPurpose(data.purpose || 'email_verification')
                      setStep('otp')
                      setInfo(data.message || 'Verify your email with the OTP we sent.')
                      return
                    }
                    setStep('delivery')
                    setInfo('Signed in. Add delivery details to complete your order.')
                  } catch (err) {
                    setError(getErrorMessage(err, 'Invalid email or password'))
                  } finally {
                    setBusy(false)
                  }
                }}
              >
                <Field label="Password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-subtle" />
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Your password"
                      className="pl-10"
                    />
                  </div>
                </Field>
                {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}
                {info ? <p className="font-sans text-sm text-hm-success">{info}</p> : null}
                <Button type="submit" variant="primary" className="w-full" disabled={busy}>
                  {busy ? 'Signing in…' : 'Sign in & continue'}
                </Button>
                <p className="text-center font-sans text-sm">
                  <Link to="/forgot-password" className="text-hm-accent hover:underline">
                    Forgot password?
                  </Link>
                </p>
                <button
                  type="button"
                  className="font-sans text-sm text-hm-accent hover:underline"
                  onClick={() => setStep('identity')}
                >
                  Change email
                </button>
              </form>
            </section>
          ) : null}

          {step === 'otp' ? (
            <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
              <p className="font-sans text-sm font-semibold text-hm-text">Verify your email</p>
              <p className="mt-1 font-sans text-sm text-hm-text-muted">
                Enter the 6-digit code sent to {checkoutEmail}. Check your inbox for login password
                too if this is your first order.
              </p>
              <div className="mt-4 space-y-4">
                <Input
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="text-center tracking-[0.3em]"
                />
                {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}
                {info ? <p className="font-sans text-sm text-hm-success">{info}</p> : null}
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  disabled={busy}
                  onClick={verifyOtpAndContinue}
                >
                  {busy ? 'Verifying…' : 'Verify & continue'}
                </Button>
                <button
                  type="button"
                  className="font-sans text-sm text-hm-accent hover:underline"
                  onClick={() => setStep('identity')}
                >
                  Change email
                </button>
              </div>
            </section>
          ) : null}

          {step === 'delivery' ? (
            <form className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-5" onSubmit={placeOrder}>
              <p className="font-sans text-sm font-semibold text-hm-text">Delivery address</p>
              {isAuthenticated ? (
                <p className="font-sans text-xs text-hm-text-muted">
                  Signed in as {user?.email}. Edit your name anytime in{' '}
                  <Link to="/account/profile" className="text-hm-accent hover:underline">
                    Profile
                  </Link>
                  .
                </p>
              ) : null}
              <Field label="Full name">
                <Input
                  {...register('fullName', { required: true })}
                  defaultValue={user?.firstName || ''}
                  placeholder="Full name"
                />
              </Field>
              <Field label="Phone">
                <Input {...register('phone', { required: true })} type="tel" placeholder="+91" />
              </Field>
              <Field label="Address">
                <Input {...register('line1', { required: true })} placeholder="House no., street" />
              </Field>
              <Input {...register('line2')} placeholder="Landmark (optional)" />
              <div className="grid gap-3 sm:grid-cols-3">
                <Input {...register('city', { required: true })} placeholder="City" />
                <Input {...register('state', { required: true })} placeholder="State" />
                <Input {...register('postalCode', { required: true })} placeholder="Pincode" />
              </div>

              <Field label="Payment">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 font-sans text-sm"
                >
                  <option value="upi">UPI (Razorpay)</option>
                  <option value="card">Card (Razorpay)</option>
                  <option value="cod">Cash on delivery</option>
                </select>
              </Field>

              {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}

              <Button type="submit" variant="primary" size="lg" className="w-full" disabled={busy || isSubmitting}>
                {busy ? 'Processing…' : `Pay ${formatINR(billing.totalAmount)}`}
              </Button>
            </form>
          ) : null}
        </div>

        <aside className="h-fit rounded-2xl border border-hm-border bg-hm-elevated p-5 lg:sticky lg:top-[var(--hm-header-offset)]">
          <p className="font-sans text-sm font-semibold text-hm-text">Price details</p>
          <div className="mt-4">
            <BillingSummary {...billing} />
          </div>
        </aside>
      </div>
    </div>
  )
}
