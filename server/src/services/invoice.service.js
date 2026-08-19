const config = require('../config');

const COMPANY = {
  name: config.appName || 'Uniquworld',
  url: config.clientUrl || 'https://uniquworld.com',
  email: config.smtp?.fromEmail || 'admin@uniquworld.com',
  gstin: process.env.COMPANY_GSTIN || '',
};

function money(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Printable tax invoice HTML for admin + email. */
function buildOrderInvoiceHtml(order, customer = {}) {
  const addr = order.shippingAddress || {};
  const items = order.items || [];
  const payment = order.payment || {};
  const customerName =
    customer.firstName ||
    addr.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
    'Customer';

  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;">${escapeHtml(item.productName)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;">${money(item.unitPrice)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:right;font-weight:600;">${money(item.totalPrice ?? item.unitPrice * item.quantity)}</td>
      </tr>`,
    )
    .join('');

  const razorpayRef = payment.gatewayPaymentId
    ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">Razorpay payment ID: <strong>${escapeHtml(payment.gatewayPaymentId)}</strong></p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${escapeHtml(order.orderNumber)}</title>
  <style>
    @media print { .no-print { display: none !important; } body { margin: 0; } }
    body { font-family: Arial, Helvetica, sans-serif; color: #0a2d4d; background: #fff; margin: 24px; }
  </style>
</head>
<body>
  <div style="max-width:820px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;gap:24px;align-items:flex-start;border-bottom:2px solid #0a2d4d;padding-bottom:18px;">
      <div>
        <h1 style="margin:0;font-size:28px;">${escapeHtml(COMPANY.name)}</h1>
        <p style="margin:6px 0 0;color:#666;font-size:13px;">Tax Invoice / Order Receipt</p>
        ${COMPANY.gstin ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">GSTIN: ${escapeHtml(COMPANY.gstin)}</p>` : ''}
      </div>
      <div style="text-align:right;font-size:13px;color:#444;">
        <p style="margin:0;"><strong>Invoice #</strong> ${escapeHtml(order.orderNumber)}</p>
        <p style="margin:4px 0 0;"><strong>Date</strong> ${formatDate(order.createdAt)}</p>
        <p style="margin:4px 0 0;"><strong>Status</strong> ${escapeHtml(String(order.status).replace(/_/g, ' '))}</p>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;">
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Bill to</p>
        <p style="margin:0;font-size:16px;font-weight:700;">${escapeHtml(customerName)}</p>
        <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(customer.email || addr.email || '')}</p>
        <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(addr.phone || customer.phone || '')}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.5;">
          ${escapeHtml([addr.line1, addr.line2, addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '))}
        </p>
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Payment</p>
        <p style="margin:0;font-size:14px;"><strong>Method:</strong> ${escapeHtml(String(payment.method || '—').toUpperCase())}</p>
        <p style="margin:6px 0 0;font-size:14px;"><strong>Status:</strong> ${escapeHtml(payment.status || 'pending')}</p>
        ${razorpayRef}
      </div>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-top:28px;font-size:14px;">
      <thead>
        <tr style="background:#0a2d4d;color:#fff;">
          <th style="padding:10px 12px;text-align:left;">Product</th>
          <th style="padding:10px 12px;text-align:center;width:80px;">Qty</th>
          <th style="padding:10px 12px;text-align:right;width:110px;">Rate</th>
          <th style="padding:10px 12px;text-align:right;width:110px;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows || '<tr><td colspan="4" style="padding:12px;">No items</td></tr>'}</tbody>
    </table>

    <div style="margin-top:24px;margin-left:auto;max-width:320px;font-size:14px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Product total</span><span>${money(order.subtotal)}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Platform fee</span><span>${money(order.platformFeeAmount)}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Delivery charges</span><span>${order.shippingAmount === 0 ? 'FREE' : money(order.shippingAmount)}</span></div>
      ${order.discountAmount ? `<div style="display:flex;justify-content:space-between;padding:6px 0;color:#059669;"><span>Discount</span><span>- ${money(order.discountAmount)}</span></div>` : ''}
      ${order.taxAmount ? `<div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Tax</span><span>${money(order.taxAmount)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #0a2d4d;font-size:18px;font-weight:700;"><span>Total amount</span><span>${money(order.totalAmount)}</span></div>
    </div>

    <p style="margin-top:32px;font-size:12px;color:#64748b;text-align:center;">
      Thank you for shopping with ${escapeHtml(COMPANY.name)} · ${escapeHtml(COMPANY.url)}
    </p>
  </div>
</body>
</html>`;
}

function buildInvoiceEmailSummary(order) {
  return `Product ${money(order.subtotal)} + Platform fee ${money(order.platformFeeAmount)} + Delivery ${order.shippingAmount === 0 ? 'FREE' : money(order.shippingAmount)} = Total ${money(order.totalAmount)}`;
}

module.exports = {
  buildOrderInvoiceHtml,
  buildInvoiceEmailSummary,
  COMPANY,
};
