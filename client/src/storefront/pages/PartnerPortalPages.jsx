import { useEffect, useState } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { Button } from '@/shared/components/ui/Button'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { storePartnerApi } from '@/storefront/api/storePartner'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatINR } from '@/storefront/lib/commerce'

function Shell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[80svh] max-w-md flex-col justify-center px-5 py-24 sm:px-8">
      <BrandLogo priority imgClassName="h-11 sm:h-12" />
      <h1 className="mt-8 font-display text-4xl text-hm-text">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm text-hm-text-muted">{subtitle}</p> : null}
      <div className="mt-8">{children}</div>
      {footer ? <div className="mt-6 text-sm text-hm-text-muted">{footer}</div> : null}
    </div>
  )
}

function Field({ label, type = 'text', register, error }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-hm-text-muted">{label}</span>
      <input
        type={type}
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm outline-none focus:border-hm-accent"
        {...register}
      />
      {error ? <span className="text-xs text-hm-danger">{error}</span> : null}
    </label>
  )
}

export function PartnerRegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(null)
  const [otpCode, setOtpCode] = useState('')
  const { completeLoginWithOtp } = useCustomerAuth()

  if (otpStep) {
    return (
      <Shell title="Verify email" subtitle={`We sent a code to ${otpStep.email}`}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            try {
              await completeLoginWithOtp({
                email: otpStep.email,
                code: otpCode,
                purpose: 'email_verification',
              })
              navigate('/store/partner', { replace: true })
            } catch (err) {
              setError(getErrorMessage(err))
            }
          }}
        >
          <input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            placeholder="6-digit OTP"
            className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm"
          />
          {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
          <Button type="submit" className="w-full">Verify & open dashboard</Button>
        </form>
      </Shell>
    )
  }

  return (
    <Shell
      title="Become a store partner"
      subtitle="Register your shop, verify email, then upload products and manage sales."
      footer={
        <>
          Already registered? <Link to="/store/partner/login" className="text-hm-accent">Sign in</Link>
        </>
      }
    >
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (values) => {
          setError('')
          try {
            const data = await storePartnerApi.register(values)
            setOtpStep({ email: values.email })
            if (data?.otp?.debugCode) {
              setOtpCode(data.otp.debugCode)
            }
          } catch (err) {
            setError(getErrorMessage(err))
          }
        })}
      >
        <Field label="First name" register={register('firstName', { required: true })} error={errors.firstName && 'Required'} />
        <Field label="Last name" register={register('lastName')} />
        <Field label="Email" type="email" register={register('email', { required: true })} error={errors.email && 'Required'} />
        <Field label="Password" type="password" register={register('password', { required: true, minLength: 8 })} error={errors.password && 'Min 8 chars'} />
        <Field label="Phone" register={register('phone')} />
        <Field label="Store name" register={register('storeName', { required: true })} error={errors.storeName && 'Required'} />
        <Field label="City" register={register('city')} />
        <Field label="State" register={register('state')} />
        <Field label="GSTIN" register={register('gstin')} />
        <Field label="Bank account name" register={register('bankAccountName')} />
        <Field label="Account number" register={register('bankAccountNumber')} />
        <Field label="IFSC" register={register('bankIfsc')} />
        <Field label="Bank name" register={register('bankName')} />
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Registering…' : 'Register store'}
        </Button>
        <p className="text-xs text-hm-text-muted">
          Fees: customer pays product + 10% platform fee + shipping. You receive the full product amount after delivery.
        </p>
      </form>
    </Shell>
  )
}

export function PartnerLoginPage() {
  const navigate = useNavigate()
  const { login, completeLoginWithOtp, isAuthenticated, user } = useCustomerAuth()
  const { register, handleSubmit, formState: { isSubmitting } } = useForm()
  const [error, setError] = useState('')
  const [otpStep, setOtpStep] = useState(null)
  const [otpCode, setOtpCode] = useState('')

  useEffect(() => {
    if (isAuthenticated && user?.role?.slug === 'store_owner') {
      navigate('/store/partner', { replace: true })
    }
  }, [isAuthenticated, user, navigate])

  if (otpStep) {
    return (
      <Shell title="Enter login code" subtitle={`Sent to ${otpStep.email}`}>
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              await completeLoginWithOtp({
                email: otpStep.email,
                code: otpCode,
                purpose: otpStep.purpose || 'login',
              })
              navigate('/store/partner', { replace: true })
            } catch (err) {
              setError(getErrorMessage(err))
            }
          }}
        >
          <input
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            className="h-11 w-full rounded-xl border border-hm-border bg-hm-elevated px-3 text-sm"
            placeholder="6-digit OTP"
          />
          {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
          <Button type="submit" className="w-full">Continue</Button>
        </form>
      </Shell>
    )
  }

  return (
    <Shell
      title="Store partner login"
      subtitle="Manage products, inventory, sales, and withdrawals."
      footer={
        <>
          New partner? <Link to="/store/vendor" className="text-hm-accent">Register your store</Link>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async ({ email, password }) => {
          setError('')
          try {
            const data = await login(email, password)
            if (data?.requiresOtp) {
              setOtpStep({ email, purpose: data.otp?.purpose || 'login' })
              return
            }
            navigate('/store/partner', { replace: true })
          } catch (err) {
            setError(getErrorMessage(err))
          }
        })}
      >
        <Field label="Email" type="email" register={register('email', { required: true })} />
        <Field label="Password" type="password" register={register('password', { required: true })} />
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Sign in
        </Button>
      </form>
    </Shell>
  )
}

function PartnerGuard({ children }) {
  const { isAuthenticated, user, loading } = useCustomerAuth()
  if (loading) return <p className="p-10 text-sm text-hm-text-muted">Loading…</p>
  if (!isAuthenticated) return <Navigate to="/store/partner/login" replace />
  if (user?.role?.slug !== 'store_owner') {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <p className="text-hm-text">This dashboard is for store partners only.</p>
        <Link to="/store/vendor" className="mt-4 inline-block text-hm-accent">Register as partner</Link>
      </div>
    )
  }
  return children
}

function PartnerLayout() {
  const { logout, user } = useCustomerAuth()
  const nav = [
    ['', 'Overview'],
    ['products', 'Products'],
    ['sales', 'Sales'],
    ['earnings', 'Earnings'],
    ['profile', 'Bank & profile'],
  ]
  return (
    <div className="min-h-svh bg-hm-bg">
      <header className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <BrandLogo imgClassName="h-8" />
            <p className="mt-1 text-xs text-hm-text-muted">Store partner · {user?.email}</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => logout()}>
            Sign out
          </Button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 pb-3 sm:px-8">
          {nav.map(([path, label]) => (
            <Link
              key={path}
              to={path ? `/store/partner/${path}` : '/store/partner'}
              className="rounded-full px-3 py-1.5 text-sm text-hm-text-muted hover:bg-hm-muted hover:text-hm-text"
            >
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Outlet />
      </main>
    </div>
  )
}

function OverviewPage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    storePartnerApi.dashboard().then(setData).catch((e) => setError(getErrorMessage(e)))
  }, [])
  if (error) return <p className="text-hm-danger">{error}</p>
  if (!data) return <p className="text-hm-text-muted">Loading dashboard…</p>
  const { store, balance, monthlyEarnings, feeInfo, productCount, publishedCount } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-hm-text">{store.name}</h1>
        <p className="text-sm text-hm-text-muted">
          Status · {store.status} · Code · {store.code} · Storefront{' '}
          <Link className="text-hm-accent" to={`/store?store=${store.code}`}>
            /store?store={store.code}
          </Link>
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['This month', formatINR(balance.monthEarnings)],
          ['Available to withdraw', formatINR(balance.availableBalance)],
          ['Products', `${publishedCount}/${productCount} live`],
          ['Lifetime', formatINR(balance.lifetimeEarnings)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-hm-border bg-hm-elevated p-4">
            <p className="text-xs text-hm-text-muted">{label}</p>
            <p className="mt-2 text-xl font-semibold text-hm-text">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-hm-text-muted">{feeInfo?.note}</p>
      <div>
        <h2 className="text-lg font-semibold">Monthly earnings</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {(monthlyEarnings || []).map((m) => (
            <li key={m.month} className="flex justify-between border-b border-hm-border py-2">
              <span>{m.month}</span>
              <span>{formatINR(m.netAmount)} · {m.ordersCount} lines</span>
            </li>
          ))}
          {!monthlyEarnings?.length ? <li className="text-hm-text-muted">No delivered earnings yet.</li> : null}
        </ul>
      </div>
    </div>
  )
}

function ProductsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState(null)
  const load = () => storePartnerApi.listProducts().then((d) => setItems(d.items || [])).catch((e) => setError(getErrorMessage(e)))
  useEffect(() => { load() }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Products & inventory</h1>
        <Button size="sm" onClick={() => setForm({ name: '', price: 500, stock: 10, status: 'published' })}>
          Add product
        </Button>
      </div>
      {error ? <p className="text-hm-danger text-sm">{error}</p> : null}
      {form ? (
        <form
          className="grid gap-3 rounded-2xl border border-hm-border bg-hm-elevated p-4 sm:grid-cols-2"
          onSubmit={async (e) => {
            e.preventDefault()
            try {
              const fd = new FormData(e.target)
              const body = Object.fromEntries(fd.entries())
              body.price = Number(body.price)
              body.stock = Number(body.stock)
              if (form.id) await storePartnerApi.updateProduct(form.id, body)
              else await storePartnerApi.createProduct(body)
              setForm(null)
              load()
            } catch (err) {
              setError(getErrorMessage(err))
            }
          }}
        >
          <input name="name" defaultValue={form.name} placeholder="Product name" required className="h-10 rounded-lg border border-hm-border px-3 sm:col-span-2" />
          <input name="price" type="number" step="0.01" defaultValue={form.price} placeholder="Price" required className="h-10 rounded-lg border border-hm-border px-3" />
          <input name="stock" type="number" defaultValue={form.stock} placeholder="Stock" className="h-10 rounded-lg border border-hm-border px-3" />
          <input name="category" defaultValue={form.category || ''} placeholder="Category" className="h-10 rounded-lg border border-hm-border px-3" />
          <select name="status" defaultValue={form.status || 'draft'} className="h-10 rounded-lg border border-hm-border px-3">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <textarea name="description" defaultValue={form.description || ''} placeholder="Description" rows={3} className="rounded-lg border border-hm-border px-3 py-2 sm:col-span-2" />
          <input name="imageUrl" defaultValue={form.imageUrl || ''} placeholder="Image URL" className="h-10 rounded-lg border border-hm-border px-3 sm:col-span-2" />
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setForm(null)}>Cancel</Button>
          </div>
        </form>
      ) : null}
      <div className="overflow-x-auto rounded-2xl border border-hm-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-hm-border text-xs uppercase text-hm-text-muted">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-hm-border/50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{formatINR(p.price)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    className="h-9 w-20 rounded-lg border border-hm-border px-2"
                    defaultValue={p.stock}
                    onBlur={async (e) => {
                      try {
                        await storePartnerApi.updateStock(p.id, Number(e.target.value))
                        load()
                      } catch (err) {
                        setError(getErrorMessage(err))
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button size="sm" variant="ghost" onClick={() => setForm(p)}>Edit</Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      await storePartnerApi.deleteProduct(p.id)
                      load()
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SalesPage() {
  const [items, setItems] = useState([])
  useEffect(() => {
    storePartnerApi.listSales().then((d) => setItems(d.items || []))
  }, [])
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Sales</h1>
      <div className="overflow-x-auto rounded-2xl border border-hm-border">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-hm-border text-xs uppercase text-hm-text-muted">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">You earn</th>
              <th className="px-4 py-3">Platform fee</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-hm-border/50">
                <td className="px-4 py-3">{s.orderNumber}</td>
                <td className="px-4 py-3">{s.productName} × {s.quantity}</td>
                <td className="px-4 py-3">{formatINR(s.storeEarning)}</td>
                <td className="px-4 py-3">{formatINR(s.platformFee)}</td>
                <td className="px-4 py-3">{s.orderStatus}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-hm-text-muted">No sales yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EarningsPage() {
  const [data, setData] = useState(null)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const load = () => storePartnerApi.earnings().then(setData).catch((e) => setError(getErrorMessage(e)))
  useEffect(() => { load() }, [])
  if (!data) return <p className="text-hm-text-muted">Loading…</p>
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl">Earnings & withdraw</h1>
      <p className="text-sm text-hm-text-muted">
        Available after orders are delivered. Withdraw anytime to your bank account.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-hm-border bg-hm-elevated p-4">
          <p className="text-xs text-hm-text-muted">Available</p>
          <p className="mt-2 text-2xl font-semibold">{formatINR(data.balance.availableBalance)}</p>
        </div>
        <div className="rounded-2xl border border-hm-border bg-hm-elevated p-4">
          <p className="text-xs text-hm-text-muted">This month</p>
          <p className="mt-2 text-2xl font-semibold">{formatINR(data.balance.monthEarnings)}</p>
        </div>
        <div className="rounded-2xl border border-hm-border bg-hm-elevated p-4">
          <p className="text-xs text-hm-text-muted">Paid out</p>
          <p className="mt-2 text-2xl font-semibold">{formatINR(data.balance.totalPaidOut)}</p>
        </div>
      </div>
      <form
        className="flex flex-wrap items-end gap-3 rounded-2xl border border-hm-border bg-hm-elevated p-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setError('')
          setInfo('')
          try {
            await storePartnerApi.withdraw({ amount: Number(amount) })
            setInfo('Withdrawal requested. Admin will process payout to your bank.')
            setAmount('')
            load()
          } catch (err) {
            setError(getErrorMessage(err))
          }
        }}
      >
        <label className="space-y-1 text-sm">
          <span className="text-hm-text-muted">Withdraw amount</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="block h-10 w-40 rounded-lg border border-hm-border px-3"
            required
          />
        </label>
        <Button type="submit" size="sm">Request withdrawal</Button>
      </form>
      {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
      {info ? <p className="text-sm text-hm-accent">{info}</p> : null}
      <div>
        <h2 className="font-semibold">Withdrawal history</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {(data.withdrawals || []).map((w) => (
            <li key={w.id} className="flex justify-between border-b border-hm-border py-2">
              <span>{formatINR(w.amount)} · {w.status}</span>
              <span className="text-hm-text-muted">{new Date(w.createdAt).toLocaleDateString('en-IN')}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function ProfilePage() {
  const [store, setStore] = useState(null)
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    storePartnerApi.dashboard().then((d) => setStore(d.store))
  }, [])
  if (!store) return null
  return (
    <div className="space-y-4 max-w-xl">
      <h1 className="font-display text-3xl">Bank & profile</h1>
      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault()
          const fd = new FormData(e.target)
          try {
            const data = await storePartnerApi.updateProfile(Object.fromEntries(fd.entries()))
            setStore(data.store)
            setInfo('Saved')
          } catch (err) {
            setError(getErrorMessage(err))
          }
        }}
      >
        {['name', 'phone', 'city', 'state', 'gstin', 'bankAccountName', 'bankAccountNumber', 'bankIfsc', 'bankName'].map((name) => (
          <label key={name} className="block space-y-1 text-sm">
            <span className="text-hm-text-muted">{name}</span>
            <input name={name} defaultValue={store[name] || ''} className="h-10 w-full rounded-lg border border-hm-border px-3" />
          </label>
        ))}
        <textarea name="address" defaultValue={store.address || ''} rows={2} className="w-full rounded-lg border border-hm-border px-3 py-2" />
        <Button type="submit" size="sm">Save</Button>
      </form>
      {info ? <p className="text-sm text-hm-accent">{info}</p> : null}
      {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
    </div>
  )
}

export {
  PartnerGuard,
  PartnerLayout,
  OverviewPage as PartnerOverviewPage,
  ProductsPage as PartnerProductsPage,
  SalesPage as PartnerSalesPage,
  EarningsPage as PartnerEarningsPage,
  ProfilePage as PartnerProfilePage,
}