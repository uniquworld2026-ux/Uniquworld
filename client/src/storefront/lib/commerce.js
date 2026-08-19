export function formatINR(amount) {
  const n = Number(amount) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function statusLabel(status) {
  if (!status) return '—'
  const key = String(status).toLowerCase()
  if (key === 'confirmed') return 'Confirmed'
  if (key === 'failed') return 'Failed'
  if (key === 'pending') return 'Pending payment'
  if (key === 'paid') return 'Paid'
  if (key === 'cod') return 'Cash on delivery'
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Customer-facing order badge: Failed if unpaid/cancelled payment; Confirmed (green) after paid. */
export function customerFacingOrderStatus(order) {
  const status = String(order?.status || '').toLowerCase()
  const pay = displayPaymentStatus(order)

  if (status === 'cancelled') return 'cancelled'
  if (status === 'refunded') return 'refunded'
  if (pay === 'failed' || status === 'failed') return 'failed'
  if (['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status)) return status
  if (pay === 'paid' || pay === 'cod' || ['confirmed', 'processing'].includes(status)) return 'confirmed'
  return 'pending'
}

/** Paid / failed / pending / COD from payment + order. */
export function displayPaymentStatus(orderOrPayment, paymentMaybe) {
  const payment = paymentMaybe || orderOrPayment?.payment || orderOrPayment
  const order = orderOrPayment?.payment ? orderOrPayment : null
  const method = String(payment?.method || '').toLowerCase()
  const pay = String(payment?.status || '').toLowerCase()
  const orderStatus = String(order?.status || '').toLowerCase()
  const gatewayId = payment?.gatewayPaymentId || payment?.gateway_payment_id

  if (method === 'cod') {
    if (orderStatus === 'failed' || pay === 'failed') return 'failed'
    if (pay === 'paid' || orderStatus === 'delivered') return 'paid'
    return 'cod'
  }
  if (pay === 'paid' || gatewayId) return 'paid'
  if (pay === 'failed' || orderStatus === 'failed') return 'failed'
  return pay || 'pending'
}

export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}
