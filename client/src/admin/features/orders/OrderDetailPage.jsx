import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Mail, Truck, XCircle } from 'lucide-react'
import { erpApi } from '@/admin/lib/erpApi'
import { InvoiceGstTabs } from '@/admin/components/commerce/InvoiceGstTabs'
import { OrderInvoicePanel } from '@/admin/components/commerce/OrderInvoicePanel'
import { ShipmentTrackingPanel } from '@/admin/components/commerce/ShipmentTrackingPanel'
import { StatusBadge } from '@/admin/components/crud/AdminCrudPage'
import { Button } from '@/shared/components/ui/Button'
import { formatCurrency } from '@/shared/lib/utils'
import { displayPaymentStatus } from '@/storefront/lib/commerce'
import { getErrorMessage } from '@/shared/lib/axios'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'invoice', label: 'Invoice' },
  { id: 'shipment', label: 'Shipment & tracking' },
]

export function OrderDetailPage() {
  const { orderId } = useParams()
  const qc = useQueryClient()
  const [tab, setTab] = useState('overview')
  const [invoiceGstMode, setInvoiceGstMode] = useState('with')
  const [emailMsg, setEmailMsg] = useState('')
  const [flash, setFlash] = useState('')

  const orderQuery = useQuery({
    queryKey: ['erp', 'commerce', 'orders', orderId],
    queryFn: () => erpApi.getOrder(orderId),
    enabled: Boolean(orderId),
  })

  const invoiceQuery = useQuery({
    queryKey: ['erp', 'commerce', 'orders', orderId, 'invoice', invoiceGstMode],
    queryFn: () => erpApi.getOrderInvoice(orderId, invoiceGstMode),
    enabled: Boolean(orderId) && tab === 'invoice',
  })

  const trackingQuery = useQuery({
    queryKey: ['erp', 'commerce', 'orders', orderId, 'tracking'],
    queryFn: () => erpApi.getOrderTracking(orderId),
    enabled: Boolean(orderId) && tab === 'shipment',
  })

  const sendEmailMutation = useMutation({
    mutationFn: (body) => erpApi.sendOrderEmail(orderId, body),
    onSuccess: () => setFlash('Email sent to customer'),
  })

  const cancelShipmentMutation = useMutation({
    mutationFn: () => erpApi.cancelShipment(orderQuery.data.shipment.id, { reason: 'Cancelled from order admin' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'orders', orderId] })
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'orders', orderId, 'tracking'] })
      setFlash('Shipment cancelled')
    },
  })

  const createShipmentMutation = useMutation({
    mutationFn: () =>
      erpApi.createShipment({
        orderId,
        deliveryMode: 'auto',
        carrier: 'shiprocket',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'orders', orderId] })
      qc.invalidateQueries({ queryKey: ['erp', 'commerce', 'orders', orderId, 'tracking'] })
      setFlash('Shiprocket shipment created')
    },
  })

  const order = orderQuery.data
  const payment = order?.payment
  const shipment = order?.shipment

  if (orderQuery.isLoading) {
    return <p className="p-8 text-sm text-admin-text-muted">Loading order…</p>
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <p className="text-admin-text-muted">Order not found.</p>
        <Link to="/admin/orders" className="mt-4 inline-block text-admin-accent hover:underline">
          Back to orders
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-admin-accent hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Orders
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-admin-text">{order.orderNumber}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge value={order.status} />
            <StatusBadge value={displayPaymentStatus(order)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={sendEmailMutation.isPending}
            onClick={() => sendEmailMutation.mutate({ type: 'invoice' })}
          >
            <Mail className="h-4 w-4" />
            Email invoice
          </Button>
          {shipment?.id && shipment.status !== 'cancelled' ? (
            <Button
              size="sm"
              variant="outline"
              disabled={cancelShipmentMutation.isPending}
              onClick={() => cancelShipmentMutation.mutate()}
            >
              <XCircle className="h-4 w-4" />
              Cancel delivery
            </Button>
          ) : null}
          {!shipment ? (
            <Button
              size="sm"
              variant="accent"
              disabled={createShipmentMutation.isPending}
              onClick={() => createShipmentMutation.mutate()}
            >
              <Truck className="h-4 w-4" />
              Create Shiprocket shipment
            </Button>
          ) : null}
        </div>
      </div>

      {flash ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {flash}
        </p>
      ) : null}
      {sendEmailMutation.error || cancelShipmentMutation.error || createShipmentMutation.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {getErrorMessage(
            sendEmailMutation.error ||
              cancelShipmentMutation.error ||
              createShipmentMutation.error,
          )}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2 border-b border-admin-border pb-1">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === item.id
                ? 'bg-admin-accent text-white'
                : 'text-admin-text-muted hover:bg-admin-muted hover:text-admin-text'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'overview' ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5">
            <h3 className="text-sm font-semibold text-admin-text">Items</h3>
            <ul className="mt-4 divide-y divide-admin-border">
              {(order.items || []).map((item) => (
                <li key={item.id} className="flex justify-between gap-3 py-3 text-sm">
                  <div>
                    <p className="font-medium text-admin-text">{item.productName}</p>
                    <p className="text-admin-text-muted">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-admin-text">
                    {formatCurrency(item.totalPrice ?? item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 text-sm">
              <h3 className="font-semibold text-admin-text">Customer</h3>
              <p className="mt-2 text-admin-text">{order.customer?.firstName || order.shippingAddress?.fullName}</p>
              <p className="text-admin-text-muted">{order.customer?.email}</p>
              <p className="text-admin-text-muted">{order.customer?.phone || order.shippingAddress?.phone}</p>
            </div>
            <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 text-sm">
              <h3 className="font-semibold text-admin-text">Billing</h3>
              <dl className="mt-3 space-y-2">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatCurrency(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Platform fee</dt><dd>{formatCurrency(order.platformFeeAmount)}</dd></div>
                <div className="flex justify-between"><dt>Delivery</dt><dd>{order.shippingAmount === 0 ? 'FREE' : formatCurrency(order.shippingAmount)}</dd></div>
                <div className="flex justify-between border-t border-admin-border pt-2 font-semibold">
                  <dt>Total</dt><dd>{formatCurrency(order.totalAmount)}</dd>
                </div>
              </dl>
            </div>
            {payment ? (
              <div className="rounded-2xl border border-admin-border bg-admin-elevated p-5 text-sm">
                <h3 className="font-semibold text-admin-text">Razorpay</h3>
                <p className="mt-2 capitalize">
                  {payment.method} · {displayPaymentStatus(order)}
                </p>
                {payment.gatewayPaymentId ? (
                  <p className="mt-1 break-all text-xs text-admin-text-muted">{payment.gatewayPaymentId}</p>
                ) : null}
              </div>
            ) : null}
          </aside>
        </div>
      ) : null}

      {tab === 'invoice' ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-admin-text">Billing invoice</h3>
              <p className="text-sm text-admin-text-muted">
                Generate a tax invoice with GST breakdown or a simple bill without GST.
              </p>
            </div>
            <InvoiceGstTabs value={invoiceGstMode} onChange={setInvoiceGstMode} />
          </div>
          {invoiceQuery.isLoading ? (
            <p className="rounded-2xl border border-admin-border bg-admin-elevated p-8 text-center text-sm text-admin-text-muted">
              Loading invoice preview…
            </p>
          ) : (
            <OrderInvoicePanel
              html={invoiceQuery.data?.html}
              orderNumber={order.orderNumber}
              sending={sendEmailMutation.isPending}
              onSendEmail={(type) => sendEmailMutation.mutate({ type })}
            />
          )}
        </div>
      ) : null}

      {tab === 'shipment' ? (
        <div className="space-y-6">
          {shipment?.id ? (
            <Link to={`/admin/shipping/${shipment.id}`} className="text-sm text-admin-accent hover:underline">
              Open full shipment admin →
            </Link>
          ) : null}
          <ShipmentTrackingPanel
            orderStatus={order.status}
            timeline={order.timeline}
            shipment={shipment}
            tracking={trackingQuery.data?.tracking}
            mapQuery={trackingQuery.data?.mapQuery}
          />
        </div>
      ) : null}

      <section className="rounded-2xl border border-admin-border bg-admin-elevated p-5">
        <h3 className="text-sm font-semibold text-admin-text">Send custom email</h3>
        <textarea
          value={emailMsg}
          onChange={(e) => setEmailMsg(e.target.value)}
          rows={3}
          placeholder="Optional message to customer…"
          className="mt-3 w-full rounded-xl border border-admin-border bg-admin-bg px-3 py-2 text-sm outline-none focus:border-admin-accent"
        />
        <Button
          className="mt-3"
          size="sm"
          variant="outline"
          disabled={sendEmailMutation.isPending}
          onClick={() =>
            sendEmailMutation.mutate({
              type: 'custom',
              subject: `Update on order ${order.orderNumber}`,
              message: emailMsg || 'We have an update on your order.',
            })
          }
        >
          Send email
        </Button>
      </section>
    </div>
  )
}
