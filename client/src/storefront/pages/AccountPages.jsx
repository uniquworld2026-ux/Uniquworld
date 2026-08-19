import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import {
  AccountEmptyState,
  AccountSection,
} from '@/storefront/components/account/AccountShell'
import { DeliveryTimeline } from '@/storefront/components/account/DeliveryTimeline'
import { OrderCard } from '@/storefront/components/account/OrderCard'
import { OrderStatusBadge } from '@/storefront/components/account/OrderStatusBadge'
import { Button } from '@/shared/components/ui/Button'
import { Input, TextArea } from '@/storefront/components/ui/Input'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { useCustomerAuth } from '@/storefront/auth/CustomerAuthContext'
import { accountApi } from '@/storefront/api/account'
import { getErrorMessage } from '@/shared/lib/axios'
import { formatDate, formatINR, statusLabel } from '@/storefront/lib/commerce'

export { AccountShell as AccountLayout } from '@/storefront/components/account/AccountShell'

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-sans text-xs font-medium text-hm-text-muted">{label}</span>
      {children}
    </label>
  )
}

function LoadingBlock({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-xl" />
      ))}
    </div>
  )
}

export function AccountOverviewPage() {
  const [summary, setSummary] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([accountApi.summary(), accountApi.listOrders({ limit: 3 })])
      .then(([sum, orders]) => {
        setSummary(sum)
        setRecentOrders((orders || []).slice(0, 3))
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingBlock lines={4} />
  if (error) return <p className="font-sans text-sm text-hm-danger">{error}</p>

  const cards = [
    { label: 'Orders', value: summary.ordersCount, to: '/account/orders', hint: 'Track & manage' },
    { label: 'Addresses', value: summary.addressesCount, to: '/account/addresses', hint: 'Delivery locations' },
    { label: 'Wishlist', value: summary.wishlistCount, to: '/wishlist', hint: 'Saved gifts' },
    { label: 'Alerts', value: summary.unreadNotifications, to: '/account/notifications', hint: 'Unread updates' },
  ]

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-hm-border bg-hm-elevated p-4 transition hover:border-hm-accent/40 hover:shadow-hm-soft sm:p-5"
          >
            <p className="font-sans text-[10px] font-semibold uppercase tracking-wide text-hm-text-subtle sm:text-xs">
              {card.label}
            </p>
            <p className="mt-1.5 font-display text-2xl font-semibold text-hm-text sm:mt-2 sm:text-3xl">{card.value}</p>
            <p className="mt-0.5 font-sans text-[10px] text-hm-text-muted sm:mt-1 sm:text-xs">{card.hint}</p>
          </Link>
        ))}
      </div>

      <AccountSection
        title="Recent orders"
        description="Quick access to your latest purchases."
        action={
          <Link to="/account/orders" className="font-sans text-sm font-medium text-hm-accent hover:underline">
            View all
          </Link>
        }
      >
        {!recentOrders.length ? (
          <AccountEmptyState
            title="No orders yet"
            description="When you place an order, it will show up here with delivery updates."
            actionLabel="Browse gifts"
            actionTo="/categories"
          />
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </AccountSection>
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

  if (loading) return <LoadingBlock lines={5} />
  if (error) return <p className="font-sans text-sm text-hm-danger">{error}</p>

  if (!orders.length) {
    return (
      <AccountEmptyState
        title="No orders yet"
        description="Your order history and delivery timeline will appear here after checkout."
        actionLabel="Start shopping"
        actionTo="/categories"
      />
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-hm-text sm:text-2xl">My orders</h2>
        <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">
          {orders.length} order{orders.length === 1 ? '' : 's'} · tap any order for details
        </p>
      </div>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}

export function AccountOrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState(null)
  const [tracking, setTracking] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [returnReason, setReturnReason] = useState('')

  const load = () =>
    Promise.all([
      accountApi.getOrder(orderId),
      accountApi.trackOrder(orderId).catch(() => null),
    ]).then(([ord, track]) => {
      setOrder(ord)
      setTracking(track)
    })

  useEffect(() => {
    load().catch((err) => setError(getErrorMessage(err)))
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
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  if (error && !order) return <p className="font-sans text-sm text-hm-danger">{error}</p>
  if (!order) return <LoadingBlock lines={6} />

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <Link
            to="/account/orders"
            className="inline-flex items-center gap-1 font-sans text-xs text-hm-accent hover:underline sm:text-sm"
          >
            <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Back to orders
          </Link>
          <h2 className="mt-2 truncate font-display text-xl font-semibold text-hm-text sm:mt-3 sm:text-3xl">
            {order.orderNumber}
          </h2>
          <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <OrderStatusBadge order={order} className="text-xs" />
          <p className="mt-2 font-display text-xl font-semibold text-hm-primary sm:mt-3 sm:text-2xl">
            {formatINR(order.totalAmount)}
          </p>
        </div>
      </div>

      {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}

      <DeliveryTimeline
        status={order.status}
        timeline={order.timeline}
        estimatedDelivery={order.shipment?.estimatedDelivery}
      />

      <AccountSection title="Products in this order" description="Items included in your purchase.">
        <ul className="divide-y divide-hm-border">
          {(order.items || []).map((item) => (
            <li key={item.id} className="flex gap-3 py-3 first:pt-0 last:pb-0 sm:gap-4 sm:py-4">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="h-16 w-16 shrink-0 rounded-lg border border-hm-border bg-hm-muted object-contain p-1 sm:h-20 sm:w-20 sm:rounded-xl"
                />
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-lg bg-hm-muted sm:h-20 sm:w-20 sm:rounded-xl" />
              )}
              <div className="min-w-0 flex-1">
                {item.productId ? (
                  <Link
                    to={`/products/${item.productId}`}
                    className="line-clamp-2 font-sans text-xs font-semibold text-hm-text hover:text-hm-accent sm:text-sm"
                  >
                    {item.productName}
                  </Link>
                ) : (
                  <p className="line-clamp-2 font-sans text-xs font-semibold text-hm-text sm:text-sm">{item.productName}</p>
                )}
                <p className="mt-0.5 font-sans text-[11px] text-hm-text-muted sm:mt-1 sm:text-sm">
                  Qty {item.quantity} · {formatINR(item.unitPrice)} each
                </p>
                <p className="mt-0.5 font-sans text-xs font-semibold text-hm-text sm:hidden">
                  {formatINR(item.totalPrice)}
                </p>
              </div>
              <p className="hidden shrink-0 font-sans text-sm font-semibold text-hm-text sm:block">
                {formatINR(item.totalPrice)}
              </p>
            </li>
          ))}
        </ul>
      </AccountSection>

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <AccountSection title="Shipping address">
          {order.shippingAddress ? (
            <div className="space-y-1 font-sans text-sm text-hm-text-muted">
              <p className="font-semibold text-hm-text">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 ? <p>{order.shippingAddress.line2}</p> : null}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          ) : (
            <p className="font-sans text-sm text-hm-text-muted">No address on file</p>
          )}
        </AccountSection>

        <AccountSection title="Payment & shipment">
          <div className="space-y-2 font-sans text-sm text-hm-text-muted">
            <p>
              <span className="text-hm-text">Payment:</span>{' '}
              {statusLabel(order.payment?.method)} · {statusLabel(order.payment?.status)}
            </p>
            <p>
              <span className="text-hm-text">Shipping fee:</span> {formatINR(order.shippingAmount)}
            </p>
            {order.shipment ? (
              <>
                <p>
                  <span className="text-hm-text">Carrier:</span>{' '}
                  {order.shipment.courierName || order.shipment.carrier || 'Assigned soon'}
                </p>
                <p>
                  <span className="text-hm-text">AWB:</span>{' '}
                  {order.shipment.awbCode || 'Pending assignment'}
                </p>
                {order.shipment.trackingUrl ? (
                  <a
                    href={order.shipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-medium text-hm-accent hover:underline"
                  >
                    Track on courier site
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </>
            ) : (
              <p>Shipment details appear after order confirmation.</p>
            )}
            {tracking?.tracking?.tracking_data?.shipment_track?.[0]?.current_status ? (
              <p className="rounded-lg bg-hm-muted px-3 py-2 text-hm-text">
                Live status: {tracking.tracking.tracking_data.shipment_track[0].current_status}
              </p>
            ) : null}
          </div>
        </AccountSection>
      </div>

      {['pending', 'confirmed', 'processing'].includes(order.status) ? (
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" disabled={busy} onClick={cancel}>
            Cancel order
          </Button>
        </div>
      ) : null}

      {order.status === 'delivered' ? (
        <AccountSection title="Request a return" description="Tell us why you'd like to return this order.">
          <TextArea
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            rows={4}
            placeholder="Reason for return"
          />
          <Button className="mt-4" variant="primary" disabled={busy} onClick={requestReturn}>
            Submit return request
          </Button>
        </AccountSection>
      ) : null}
    </div>
  )
}

export function AccountProfilePage() {
  const { user, refreshUser } = useCustomerAuth()
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
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
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-hm-text sm:text-2xl">Profile</h2>
        <p className="mt-1 font-sans text-xs text-hm-text-muted sm:text-sm">
          Update your name and phone for orders and delivery updates.
        </p>
      </div>

      <form
        className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-4 sm:max-w-lg sm:p-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <Input {...register('firstName', { required: true })} placeholder="First name" />
          </Field>
          <Field label="Last name">
            <Input {...register('lastName')} placeholder="Last name" />
          </Field>
        </div>
        <Field label="Email">
          <Input value={user?.email || ''} disabled className="bg-hm-muted text-hm-text-muted" />
        </Field>
        <Field label="Phone">
          <Input {...register('phone')} placeholder="+91 98765 43210" type="tel" />
        </Field>
        {message ? <p className="font-sans text-sm text-hm-success">{message}</p> : null}
        {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save profile'}
        </Button>
      </form>
    </div>
  )
}

export function AccountAddressesPage() {
  const [addresses, setAddresses] = useState([])
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
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
      await accountApi.createAddress({ ...values, type: 'shipping', country: 'India' })
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-hm-text sm:text-2xl">Addresses</h2>
          <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">Saved delivery addresses for faster checkout.</p>
        </div>
        {!showForm ? (
          <Button variant="outline" onClick={() => setShowForm(true)}>
            Add address
          </Button>
        ) : null}
      </div>

      {error ? <p className="font-sans text-sm text-hm-danger">{error}</p> : null}

      {!addresses.length && !showForm ? (
        <div className="rounded-2xl border border-dashed border-hm-border bg-hm-elevated/80 p-8 text-center">
          <p className="font-display text-xl font-semibold text-hm-text">No addresses saved</p>
          <p className="mt-2 font-sans text-sm text-hm-text-muted">Add a delivery address to speed up checkout.</p>
        </div>
      ) : null}

      {addresses.map((a) => (
        <div key={a.id} className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-sans text-sm font-semibold text-hm-text">
                {a.fullName}
                {a.isDefault ? (
                  <span className="ml-2 rounded-full bg-hm-accent-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-hm-accent">
                    Default
                  </span>
                ) : null}
              </p>
              <p className="mt-1 font-sans text-sm text-hm-text-muted">
                {a.line1}
                {a.line2 ? `, ${a.line2}` : ''}
              </p>
              <p className="font-sans text-sm text-hm-text-muted">
                {a.city}, {a.state} {a.postalCode}
              </p>
              <p className="font-sans text-sm text-hm-text-muted">{a.phone}</p>
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
          className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-5 sm:p-6"
        >
          <h3 className="font-sans text-base font-semibold text-hm-text">Add new address</h3>
          <Field label="Full name">
            <Input {...register('fullName', { required: true })} placeholder="Full name" />
          </Field>
          <Field label="Phone">
            <Input {...register('phone', { required: true })} placeholder="Phone" type="tel" />
          </Field>
          <Field label="Address line 1">
            <Input {...register('line1', { required: true })} placeholder="House no., street" />
          </Field>
          <Field label="Address line 2">
            <Input {...register('line2')} placeholder="Landmark (optional)" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="City">
              <Input {...register('city', { required: true })} placeholder="City" />
            </Field>
            <Field label="State">
              <Input {...register('state', { required: true })} placeholder="State" />
            </Field>
            <Field label="Pincode">
              <Input {...register('postalCode', { required: true })} placeholder="Pincode" />
            </Field>
          </div>
          <label className="flex items-center gap-2 font-sans text-sm text-hm-text-muted">
            <input type="checkbox" {...register('isDefault')} className="h-4 w-4 rounded border-hm-border" />
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
      ) : addresses.length ? (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          Add another address
        </Button>
      ) : (
        <Button variant="primary" onClick={() => setShowForm(true)}>
          Add address
        </Button>
      )}
    </div>
  )
}

export function AccountNotificationsPage() {
  const [data, setData] = useState({ items: [], unreadCount: 0 })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () =>
    accountApi
      .listNotifications()
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))

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

  if (loading) return <LoadingBlock lines={4} />
  if (error) return <p className="font-sans text-sm text-hm-danger">{error}</p>

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-semibold text-hm-text sm:text-2xl">Notifications</h2>
          <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">{data.unreadCount} unread</p>
        </div>
        {data.unreadCount > 0 ? (
          <Button size="sm" variant="outline" onClick={markAll}>
            Mark all read
          </Button>
        ) : null}
      </div>

      {!data.items?.length ? (
        <AccountEmptyState
          title="All caught up"
          description="Order updates and alerts will appear here."
        />
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
                  <p className="font-sans text-sm font-medium text-hm-text">{n.title}</p>
                  {n.body ? <p className="mt-1 font-sans text-sm text-hm-text-muted">{n.body}</p> : null}
                  <p className="mt-1 font-sans text-xs text-hm-text-muted">{formatDate(n.createdAt)}</p>
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    accountApi
      .listReturns()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingBlock lines={3} />
  if (error) return <p className="font-sans text-sm text-hm-danger">{error}</p>

  if (!items.length) {
    return (
      <AccountEmptyState
        title="No return requests"
        description="You can request a return from any delivered order."
        actionLabel="View orders"
        actionTo="/account/orders"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-semibold text-hm-text sm:text-2xl">Returns</h2>
        <p className="mt-0.5 font-sans text-xs text-hm-text-muted sm:mt-1 sm:text-sm">Status of your return requests.</p>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
            <OrderStatusBadge status={item.status} />
            <p className="mt-2 font-sans text-sm text-hm-text-muted">{item.reason}</p>
            <p className="mt-2 font-sans text-xs text-hm-text-subtle">{formatDate(item.requestedAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
