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
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Customer-facing order badge: Failed if unpaid/cancelled payment; Confirmed (green) after paid. */
export function customerFacingOrderStatus(order) {
  const status = String(order?.status || '').toLowerCase()
  const pay = String(order?.payment?.status || '').toLowerCase()

  if (['cancelled', 'refunded', 'failed'].includes(status)) return status
  if (pay === 'failed') return 'failed'
  if (['shipped', 'in_transit', 'out_for_delivery', 'delivered'].includes(status)) return status
  if (pay === 'paid' || ['confirmed', 'processing'].includes(status)) return 'confirmed'
  return 'pending'
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
