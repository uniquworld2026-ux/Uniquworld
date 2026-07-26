import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { Button } from '@/shared/components/ui/Button'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { accountApi } from '@/storefront/api/account'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatDate, formatINR, statusLabel } from '@/storefront/lib/commerce'

function AccountNav() {
  const links = [
    { to: '/account', label: 'Overview', end: true },
    { to: '/account/orders', label: 'Orders' },
    { to: '/account/returns', label: 'Returns' },
    { to: '/account/profile', label: 'Profile' },
    { to: '/account/addresses', label: 'Addresses' },
    { to: '/account/notifications', label: 'Notifications' },
    { to: '/wishlist', label: 'Wishlist' },
  ]

  return (
    <nav className="flex flex-wrap gap-2 border-b border-hm-border pb-4">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              isActive
                ? 'border-hm-accent bg-hm-accent/10 text-hm-text'
                : 'border-hm-border text-hm-text-muted hover:border-hm-accent hover:text-hm-text'
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function AccountLayout() {
  const { user, logout } = useCustomerAuth()
  const navigate = useNavigate()

  const onSignOut = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div>
      <PageHero
        eyebrow="Account"
        title={`Hello, ${user?.firstName || 'there'}`}
        description="Manage orders, addresses, payments, returns, and notifications — Flipkart-style account hub."
        actions={
          <Button variant="outline" size="sm" onClick={onSignOut}>
            Sign out
          </Button>
        }
      />
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <AccountNav />
        <div className="mt-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export function AccountOverviewPage() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    accountApi
      .summary()
      .then(setSummary)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (error) return <p className="text-sm text-hm-danger">{error}</p>
  if (!summary) return <p className="text-sm text-hm-text-muted">Loading overview…</p>

  const cards = [
    { label: 'Orders', value: summary.ordersCount, to: '/account/orders' },
    { label: 'Addresses', value: summary.addressesCount, to: '/account/addresses' },
    { label: 'Wishlist', value: summary.wishlistCount, to: '/wishlist' },
    { label: 'Unread alerts', value: summary.unreadNotifications, to: '/account/notifications' },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Link
          key={card.label}
          to={card.to}
          className="rounded-2xl border border-hm-border bg-hm-elevated p-5 transition hover:border-hm-accent"
        >
          <p className="text-xs uppercase tracking-wider text-hm-text-subtle">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold text-hm-text">{card.value}</p>
        </Link>
      ))}
    </div>
  )
}

export function AccountOrdersPage() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    accountApi
      .listOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-sm text-hm-text-muted">Loading orders…</p>
  if (error) return <p className="text-sm text-hm-danger">{error}</p>

  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-hm-border bg-hm-elevated p-8 text-center">
        <p className="text-sm text-hm-text-muted">You haven’t placed any orders yet.</p>
        <Link to="/categories" className="mt-4 inline-block">
          <Button variant="primary">Start shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          key={order.id}
          to={`/account/orders/${order.id}`}
          className="block rounded-2xl border border-hm-border bg-hm-elevated p-5 transition hover:border-hm-accent"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-hm-text">{order.orderNumber}</p>
              <p className="mt-1 text-xs text-hm-text-muted">{formatDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-hm-text">{formatINR(order.totalAmount)}</p>
              <p className="mt-1 text-xs text-hm-accent">{statusLabel(order.status)}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-1 text-sm text-hm-text-muted">
            {(order.items || []).map((i) => i.productName).join(', ')}
          </p>
        </Link>
      ))}
    </div>
  )
}

export function AccountOrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [returnReason, setReturnReason] = useState('')

  const load = () =>
    accountApi
      .getOrder(orderId)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err)))

  useEffect(() => {
    load()
  }, [orderId])

  const cancel = async () => {
    if (!window.confirm('Cancel this order?')) return
    setBusy(true)
    try {
      const updated = await accountApi.cancelOrder(orderId, 'Cancelled by customer')
      setOrder(updated)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const requestReturn = async () => {
    if (!returnReason.trim()) return
    setBusy(true)
    try {
      await accountApi.requestReturn(orderId, { reason: returnReason.trim() })
      await load()
      setReturnReason('')
      alert('Return request submitted')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (error && !order) return <p className="text-sm text-hm-danger">{error}</p>
  if (!order) return <p className="text-sm text-hm-text-muted">Loading order…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link to="/account/orders" className="text-xs text-hm-accent">
            ← Back to orders
          </Link>
          <h2 className="mt-2 text-xl font-semibold text-hm-text">{order.orderNumber}</h2>
          <p className="text-sm text-hm-text-muted">
            {formatDate(order.createdAt)} · {statusLabel(order.status)}
          </p>
        </div>
        <p className="text-2xl font-semibold text-hm-text">{formatINR(order.totalAmount)}</p>
      </div>

      {error ? <p className="text-sm text-hm-danger">{error}</p> : null}

      <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
        <h3 className="text-sm font-semibold text-hm-text">Items</h3>
        <ul className="mt-3 space-y-3">
          {(order.items || []).map((item) => (
            <li key={item.id} className="flex gap-3 text-sm">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" />
              ) : (
                <div className="h-14 w-14 rounded-lg bg-hm-muted" />
              )}
              <div className="flex-1">
                <p className="font-medium text-hm-text">{item.productName}</p>
                <p className="text-hm-text-muted">
                  Qty {item.quantity} · {formatINR(item.unitPrice)}
                </p>
              </div>
              <p className="font-medium text-hm-text">{formatINR(item.totalPrice)}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5 text-sm">
          <h3 className="font-semibold text-hm-text">Shipping address</h3>
          {order.shippingAddress ? (
            <div className="mt-2 space-y-1 text-hm-text-muted">
              <p className="text-hm-text">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="mt-2 text-hm-text-muted">No address on file</p>
          )}
        </section>

        <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5 text-sm">
          <h3 className="font-semibold text-hm-text">Payment & delivery</h3>
          <div className="mt-2 space-y-1 text-hm-text-muted">
            <p>
              Payment: {statusLabel(order.payment?.method)} · {statusLabel(order.payment?.status)}
            </p>
            <p>Shipping: {formatINR(order.shippingAmount)}</p>
            {order.shipment ? (
              <>
                <p>Carrier: {order.shipment.courierName || order.shipment.carrier}</p>
                <p>AWB: {order.shipment.awbCode || 'Pending assignment'}</p>
                {order.shipment.trackingUrl ? (
                  <a
                    href={order.shipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-hm-accent"
                  >
                    Track shipment
                  </a>
                ) : null}
              </>
            ) : (
              <p>Shipment will appear after confirmation.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
        <h3 className="text-sm font-semibold text-hm-text">Order timeline</h3>
        <ol className="mt-4 space-y-3">
          {(order.timeline || []).map((event, idx) => (
            <li key={`${event.status}-${idx}`} className="flex gap-3 text-sm">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-hm-accent" />
              <div>
                <p className="font-medium text-hm-text">{statusLabel(event.status)}</p>
                <p className="text-hm-text-muted">{event.note}</p>
                <p className="text-xs text-hm-text-subtle">{formatDate(event.createdAt)}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="flex flex-wrap gap-3">
        {['pending', 'confirmed', 'processing'].includes(order.status) ? (
          <Button variant="outline" disabled={busy} onClick={cancel}>
            Cancel order
          </Button>
        ) : null}
      </div>

      {order.status === 'delivered' ? (
        <section className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
          <h3 className="text-sm font-semibold text-hm-text">Request a return</h3>
          <textarea
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            rows={3}
            placeholder="Reason for return"
            className="mt-3 w-full rounded-xl border border-hm-border bg-hm-bg px-3 py-2 text-sm outline-none focus:border-hm-accent"
          />
          <Button className="mt-3" variant="primary" disabled={busy} onClick={requestReturn}>
            Submit return request
          </Button>
        </section>
      ) : null}
    </div>
  )
}

export function AccountProfilePage() {
  const { user, refreshUser } = useCustomerAuth()
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    },
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
    })
  }, [user, reset])

  const onSubmit = async (values) => {
    setError('')
    setMessage('')
    try {
      await accountApi.updateProfile(values)
      await refreshUser()
      setMessage('Profile saved')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <form
      className="max-w-lg space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-sm font-semibold text-hm-text">Profile</h2>
      <input
        {...register('firstName', { required: true })}
        placeholder="First name"
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent"
      />
      <input
        {...register('lastName')}
        placeholder="Last name"
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent"
      />
      <input
        value={user?.email || ''}
        disabled
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-muted px-3 text-sm text-hm-text-muted"
      />
      <input
        {...register('phone')}
        placeholder="Phone"
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent"
      />
      {message ? <p className="text-sm text-hm-accent">{message}</p> : null}
      {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save profile'}
      </Button>
    </form>
  )
}

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      isDefault: true,
    },
  })

  const load = () =>
    accountApi
      .listAddresses()
      .then(setAddresses)
      .catch((err) => setError(getErrorMessage(err)))

  useEffect(() => {
    load()
  }, [])

  const onCreate = async (values) => {
    setError('')
    try {
      await accountApi.createAddress({
        ...values,
        type: 'shipping',
        country: 'India',
      })
      reset()
      setShowForm(false)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onDelete = async (id) => {
    if (!window.confirm('Delete this address?')) return
    try {
      await accountApi.deleteAddress(id)
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  const onSetDefault = async (id) => {
    try {
      await accountApi.updateAddress(id, { isDefault: true })
      await load()
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-hm-danger">{error}</p> : null}

      {addresses.map((a) => (
        <div key={a.id} className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-hm-text">
                {a.fullName}
                {a.isDefault ? (
                  <span className="ml-2 rounded-full bg-hm-accent/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-hm-accent">
                    Default
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-hm-text-muted">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ''}
              </p>
              <p className="text-sm text-hm-text-muted">
                {a.city}, {a.state} {a.postalCode}
              </p>
              <p className="text-sm text-hm-text-muted">{a.phone}</p>
            </div>
            <div className="flex gap-2">
              {!a.isDefault ? (
                <Button size="sm" variant="outline" onClick={() => onSetDefault(a.id)}>
                  Set default
                </Button>
              ) : null}
              <Button size="sm" variant="ghost" onClick={() => onDelete(a.id)}>
                Remove
              </Button>
            </div>
          </div>
        </div>
      ))}

      {showForm ? (
        <form
          onSubmit={handleSubmit(onCreate)}
          className="space-y-3 rounded-2xl border border-hm-border bg-hm-elevated p-5"
        >
          <h3 className="text-sm font-semibold text-hm-text">Add address</h3>
          <input {...register('fullName', { required: true })} placeholder="Full name" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <input {...register('phone', { required: true })} placeholder="Phone" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <input {...register('line1', { required: true })} placeholder="Address line 1" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <input {...register('line2')} placeholder="Address line 2" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <div className="grid gap-3 sm:grid-cols-3">
            <input {...register('city', { required: true })} placeholder="City" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
            <input {...register('state', { required: true })} placeholder="State" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
            <input {...register('postalCode', { required: true })} placeholder="Pincode" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          </div>
          <label className="flex items-center gap-2 text-sm text-hm-text-muted">
            <input type="checkbox" {...register('isDefault')} />
            Make this my default address
          </label>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              Save address
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Add address
        </Button>
      )}
    </div>
  )
}

export function AccountNotificationsPage() {
  const [data, setData] = useState({ items: [], unreadCount: 0 })
  const [error, setError] = useState('')

  const load = () =>
    accountApi
      .listNotifications()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))

  useEffect(() => {
    load()
  }, [])

  const markAll = async () => {
    await accountApi.markAllNotificationsRead()
    await load()
  }

  const markOne = async (id) => {
    await accountApi.markNotificationRead(id)
    await load()
  }

  if (error) return <p className="text-sm text-hm-danger">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-hm-text-muted">{data.unreadCount} unread</p>
        {data.unreadCount > 0 ? (
          <Button size="sm" variant="outline" onClick={markAll}>
            Mark all read
          </Button>
        ) : null}
      </div>
      {!data.items?.length ? (
        <p className="text-sm text-hm-text-muted">No notifications yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.items.map((n) => (
            <li
              key={n.id}
              className={`rounded-2xl border px-5 py-4 ${
                n.readAt ? 'border-hm-border bg-hm-elevated' : 'border-hm-accent/40 bg-hm-accent/5'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-hm-text">{n.title}</p>
                  {n.body ? <p className="mt-1 text-sm text-hm-text-muted">{n.body}</p> : null}
                  <p className="mt-1 text-xs text-hm-text-muted">{formatDate(n.createdAt)}</p>
                </div>
                {!n.readAt ? (
                  <Button size="sm" variant="ghost" onClick={() => markOne(n.id)}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function AccountReturnsPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    accountApi
      .listReturns()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (error) return <p className="text-sm text-hm-danger">{error}</p>
  if (!items.length) {
    return <p className="text-sm text-hm-text-muted">No return requests yet. You can request a return from a delivered order.</p>
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-hm-border bg-hm-elevated p-5 text-sm">
          <p className="font-semibold text-hm-text">{statusLabel(item.status)}</p>
          <p className="mt-1 text-hm-text-muted">{item.reason}</p>
          <p className="mt-2 text-xs text-hm-text-subtle">{formatDate(item.requestedAt)}</p>
        </li>
      ))}
    </ul>
  )
}
