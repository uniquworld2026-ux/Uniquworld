const config = require('../config');

const COMPANY = {
  name: config.appName || 'Uniquworld',
  url: config.clientUrl || 'https://uniquworld.com',
  email:
    process.env.COMPANY_EMAIL ||
    config.smtp?.fromEmail ||
    'admin@uniquworld.com',
  gstin: process.env.COMPANY_GSTIN || '',
  address: process.env.COMPANY_ADDRESS || 'India',
  state: process.env.COMPANY_STATE || '',
  logoUrl:
    config.emailLogoUrl ||
    `${String(config.clientUrl || 'https://uniquworld.com').replace(/\/$/, '')}/brand/uniquworld-logo.png`,
};

function companyLogoHtml() {
  if (!COMPANY.logoUrl) return '';
  return `<img src="${escapeHtml(COMPANY.logoUrl)}" alt="${escapeHtml(COMPANY.name)}" style="display:block;height:52px;width:auto;max-width:220px;object-fit:contain;margin-bottom:10px;" />`;
}

const DEFAULT_GST_PERCENT = Number(process.env.DEFAULT_GST_PERCENT || 18);

function money(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
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

const DEFAULT_INVOICE_NOTES =
  'Thank you for your business. Payment is due as per agreed terms. For queries, contact us at the email above.';

function companyBillFromHtml({ showGstin = false } = {}) {
  return `
    <p style="margin:0;font-size:16px;font-weight:700;">${escapeHtml(COMPANY.name)}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(COMPANY.email)}</p>
    ${showGstin && COMPANY.gstin ? `<p style="margin:6px 0 0;font-size:13px;color:#555;">GSTIN: ${escapeHtml(COMPANY.gstin)}</p>` : ''}
    ${COMPANY.address ? `<p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.5;">${escapeHtml(COMPANY.address)}</p>` : ''}`;
}

function normalizeGstMode(value) {
  const v = String(value || 'with').toLowerCase();
  return v === 'without' || v === 'no' || v === 'false' ? 'without' : 'with';
}

function calcGstBreakdown(taxableAmount, gstPercent = DEFAULT_GST_PERCENT) {
  const taxable = round2(taxableAmount);
  const rate = Number(gstPercent) || DEFAULT_GST_PERCENT;
  const totalTax = round2((taxable * rate) / 100);
  const half = round2(totalTax / 2);
  return {
    taxable,
    gstPercent: rate,
    cgst: half,
    sgst: half,
    igst: 0,
    totalTax,
    grandTotal: round2(taxable + totalTax),
  };
}

function buildInvoiceShell({
  documentTitle,
  documentSubtitle,
  invoiceNumber,
  invoiceDate,
  statusLine,
  billFromHtml,
  billToHtml,
  metaPanelHtml = '',
  tableHeadHtml,
  itemRowsHtml,
  totalsHtml,
  footerNote,
  showGstin = false,
}) {
  const fromHtml = billFromHtml || companyBillFromHtml({ showGstin });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(documentTitle)} ${escapeHtml(invoiceNumber)}</title>
  <style>
    @media print { .no-print { display: none !important; } body { margin: 0; } }
    body { font-family: Arial, Helvetica, sans-serif; color: #0a2d4d; background: #fff; margin: 24px; }
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  <div style="max-width:860px;margin:0 auto;">
    <div style="display:flex;justify-content:space-between;gap:24px;align-items:flex-start;border-bottom:2px solid #0a2d4d;padding-bottom:18px;">
      <div>
        ${companyLogoHtml()}
        <p style="margin:6px 0 0;color:#666;font-size:13px;">${escapeHtml(documentSubtitle)}</p>
      </div>
      <div style="text-align:right;font-size:13px;color:#444;">
        <p style="margin:0;"><strong>Invoice #</strong> ${escapeHtml(invoiceNumber)}</p>
        <p style="margin:4px 0 0;"><strong>Date</strong> ${escapeHtml(invoiceDate)}</p>
        ${statusLine ? `<p style="margin:4px 0 0;"><strong>Status</strong> ${escapeHtml(statusLine)}</p>` : ''}
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:24px;">
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Bill from</p>
        ${fromHtml}
      </div>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Bill to</p>
        ${billToHtml}
      </div>
    </div>

    ${metaPanelHtml ? `<div style="margin-top:16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;">${metaPanelHtml}</div>` : ''}

    <table style="margin-top:28px;font-size:13px;">
      <thead>
        <tr style="background:#0a2d4d;color:#fff;">${tableHeadHtml}</tr>
      </thead>
      <tbody>${itemRowsHtml || '<tr><td colspan="10" style="padding:12px;">No items</td></tr>'}</tbody>
    </table>

    <div style="margin-top:24px;margin-left:auto;max-width:360px;font-size:14px;">
      ${totalsHtml}
    </div>

    <p style="margin-top:32px;font-size:12px;color:#64748b;text-align:center;">
      ${footerNote || `Thank you for your business · ${escapeHtml(COMPANY.name)} · ${escapeHtml(COMPANY.url)}`}
    </p>
  </div>
</body>
</html>`;
}

function td(content, align = 'left', extra = '') {
  return `<td style="padding:10px 12px;border-bottom:1px solid #e8e8e8;text-align:${align};${extra}">${content}</td>`;
}

function totalRow(label, value, opts = {}) {
  const { bold, border, color } = opts;
  const style = [
    'display:flex',
    'justify-content:space-between',
    'padding:6px 0',
    bold ? 'font-size:18px;font-weight:700' : '',
    border ? 'padding:12px 0 0;margin-top:8px;border-top:2px solid #0a2d4d' : '',
    color ? `color:${color}` : '',
  ]
    .filter(Boolean)
    .join(';');
  return `<div style="${style}"><span>${label}</span><span>${value}</span></div>`;
}

/** Printable invoice HTML for storefront orders. */
function buildOrderInvoiceHtml(order, customer = {}, options = {}) {
  const gstMode = normalizeGstMode(options.gstMode);
  const addr = order.shippingAddress || {};
  const items = order.items || [];
  const payment = order.payment || {};
  const customerName =
    customer.firstName ||
    addr.fullName ||
    [customer.firstName, customer.lastName].filter(Boolean).join(' ') ||
    'Customer';

  const razorpayRef = payment.gatewayPaymentId
    ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">Razorpay payment ID: <strong>${escapeHtml(payment.gatewayPaymentId)}</strong></p>`
    : '';

  const paymentMetaHtml = `
    <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;font-weight:700;">Payment</p>
    <p style="margin:0;font-size:14px;"><strong>Method:</strong> ${escapeHtml(String(payment.method || '—').toUpperCase())}</p>
    <p style="margin:6px 0 0;font-size:14px;"><strong>Status:</strong> ${escapeHtml(payment.status || 'pending')}</p>
    ${razorpayRef}
    <p style="margin:10px 0 0;font-size:13px;color:#555;line-height:1.5;"><strong>Notes:</strong> ${escapeHtml(DEFAULT_INVOICE_NOTES)}</p>`;

  const billToHtml = `
    <p style="margin:0;font-size:16px;font-weight:700;">${escapeHtml(customerName)}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(customer.email || addr.email || '')}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(addr.phone || customer.phone || '')}</p>
    <p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.5;">
      ${escapeHtml([addr.line1, addr.line2, addr.city, addr.state, addr.postalCode].filter(Boolean).join(', '))}
    </p>`;

  if (gstMode === 'without') {
    const itemRows = items
      .map(
        (item, index) => `
      <tr>
        ${td(String(index + 1), 'center')}
        ${td(escapeHtml(item.productName))}
        ${td(String(item.quantity), 'center')}
        ${td(money(item.unitPrice), 'right')}
        ${td(money(item.totalPrice ?? item.unitPrice * item.quantity), 'right', 'font-weight:600;')}
      </tr>`,
      )
      .join('');

    const totalsHtml = [
      totalRow('Product total', money(order.subtotal)),
      totalRow('Platform fee', money(order.platformFeeAmount)),
      totalRow('Delivery charges', order.shippingAmount === 0 ? 'FREE' : money(order.shippingAmount)),
      order.discountAmount ? totalRow('Discount', `- ${money(order.discountAmount)}`, { color: '#059669' }) : '',
      totalRow('Total amount', money(order.totalAmount), { bold: true, border: true }),
    ].join('');

    return buildInvoiceShell({
      documentTitle: 'Invoice',
      documentSubtitle: 'Invoice / Bill (Without GST)',
      invoiceNumber: order.orderNumber,
      invoiceDate: formatDate(order.createdAt),
      statusLine: String(order.status).replace(/_/g, ' '),
      billToHtml,
      metaPanelHtml: paymentMetaHtml,
      tableHeadHtml: `
        <th style="padding:10px 12px;text-align:center;width:44px;">S.No</th>
        <th style="padding:10px 12px;text-align:left;">Product</th>
        <th style="padding:10px 12px;text-align:center;width:70px;">Qty</th>
        <th style="padding:10px 12px;text-align:right;width:100px;">Rate</th>
        <th style="padding:10px 12px;text-align:right;width:110px;">Amount</th>`,
      itemRowsHtml: itemRows,
      totalsHtml,
    });
  }

  const gstPercent = DEFAULT_GST_PERCENT;
  const orderTax = round2(order.taxAmount);
  const computed = calcGstBreakdown(order.subtotal, gstPercent);
  const cgst = orderTax > 0 ? round2(orderTax / 2) : computed.cgst;
  const sgst = orderTax > 0 ? round2(orderTax / 2) : computed.sgst;
  const totalTax = orderTax > 0 ? orderTax : computed.totalTax;
  const grandTotal = round2(
    order.subtotal +
      totalTax +
      Number(order.platformFeeAmount || 0) +
      Number(order.shippingAmount || 0) -
      Number(order.discountAmount || 0),
  );

  const itemRows = items
    .map((item, index) => {
      const lineTotal = round2(item.totalPrice ?? item.unitPrice * item.quantity);
      const lineTaxable = lineTotal;
      const lineCgst = round2((lineTaxable * (gstPercent / 2)) / 100);
      const lineSgst = lineCgst;
      return `
      <tr>
        ${td(String(index + 1), 'center')}
        ${td(escapeHtml(item.productName))}
        ${td(String(item.quantity), 'center')}
        ${td(money(item.unitPrice), 'right')}
        ${td(money(lineTaxable), 'right')}
        ${td(money(lineCgst), 'right')}
        ${td(money(lineSgst), 'right')}
        ${td(money(lineTotal + lineCgst + lineSgst), 'right', 'font-weight:600;')}
      </tr>`;
    })
    .join('');

  const totalsHtml = [
    totalRow('Taxable value', money(order.subtotal)),
    totalRow(`CGST @ ${gstPercent / 2}%`, money(cgst)),
    totalRow(`SGST @ ${gstPercent / 2}%`, money(sgst)),
    totalRow('Platform fee', money(order.platformFeeAmount)),
    totalRow('Delivery charges', order.shippingAmount === 0 ? 'FREE' : money(order.shippingAmount)),
    order.discountAmount ? totalRow('Discount', `- ${money(order.discountAmount)}`, { color: '#059669' }) : '',
    totalRow('Total tax', money(totalTax)),
    totalRow('Grand total', money(grandTotal), { bold: true, border: true }),
    `<p style="margin:12px 0 0;font-size:11px;color:#64748b;">Amount in words: ${escapeHtml(numberToWords(grandTotal))}</p>`,
  ].join('');

  return buildInvoiceShell({
    documentTitle: 'Tax Invoice',
    documentSubtitle: 'Tax Invoice (With GST)',
    invoiceNumber: order.orderNumber,
    invoiceDate: formatDate(order.createdAt),
    statusLine: String(order.status).replace(/_/g, ' '),
    billToHtml,
    metaPanelHtml: paymentMetaHtml,
    showGstin: true,
    tableHeadHtml: `
      <th style="padding:10px 12px;text-align:center;width:44px;">S.No</th>
      <th style="padding:10px 12px;text-align:left;">Product</th>
      <th style="padding:10px 12px;text-align:center;width:50px;">Qty</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Rate</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Taxable</th>
      <th style="padding:10px 12px;text-align:right;width:70px;">CGST</th>
      <th style="padding:10px 12px;text-align:right;width:70px;">SGST</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Total</th>`,
    itemRowsHtml: itemRows,
    totalsHtml,
  });
}

/** Manual invoice from admin Invoice Generator. */
function buildCustomInvoiceHtml(payload = {}, options = {}) {
  const gstMode = normalizeGstMode(options.gstMode ?? payload.gstMode);
  const gstPercent = Number(payload.gstPercent) || DEFAULT_GST_PERCENT;
  const items = (payload.items || []).filter((i) => i.description?.trim());
  const invoiceNumber = payload.invoiceNumber || `INV-${Date.now()}`;
  const invoiceDate = formatDate(payload.invoiceDate || new Date());
  const customer = payload.customer || {};
  const customerName = customer.name || 'Customer';
  const discount = round2(payload.discount || 0);
  const shipping = round2(payload.shipping || 0);
  const notes = String(payload.notes || '').trim() || DEFAULT_INVOICE_NOTES;

  const billToHtml = `
    <p style="margin:0;font-size:16px;font-weight:700;">${escapeHtml(customerName)}</p>
    ${customer.gstin ? `<p style="margin:6px 0 0;font-size:13px;color:#555;">GSTIN: ${escapeHtml(customer.gstin)}</p>` : ''}
    <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(customer.email || '')}</p>
    <p style="margin:6px 0 0;font-size:13px;color:#555;">${escapeHtml(customer.phone || '')}</p>
    <p style="margin:8px 0 0;font-size:13px;color:#555;line-height:1.5;">${escapeHtml(customer.address || '')}</p>`;

  const notesMetaHtml = notes
    ? `<p style="margin:0;font-size:13px;color:#555;line-height:1.5;"><strong>Notes:</strong> ${escapeHtml(notes)}</p>`
    : '';

  const lineTotals = items.map((item) => {
    const qty = Number(item.quantity) || 1;
    const rate = round2(item.rate);
    const taxable = round2(qty * rate);
    return { ...item, qty, rate, taxable };
  });

  const subtotal = round2(lineTotals.reduce((sum, l) => sum + l.taxable, 0));

  if (gstMode === 'without') {
    const itemRows = lineTotals
      .map(
        (line, index) => `
      <tr>
        ${td(String(index + 1), 'center')}
        ${td(escapeHtml(line.description))}
        ${td(String(line.qty), 'center')}
        ${td(money(line.rate), 'right')}
        ${td(money(line.taxable), 'right', 'font-weight:600;')}
      </tr>`,
      )
      .join('');

    const grandTotal = round2(subtotal + shipping - discount);

    const totalsHtml = [
      totalRow('Subtotal', money(subtotal)),
      shipping ? totalRow('Shipping', money(shipping)) : '',
      discount ? totalRow('Discount', `- ${money(discount)}`, { color: '#059669' }) : '',
      totalRow('Total amount', money(grandTotal), { bold: true, border: true }),
    ].join('');

    return buildInvoiceShell({
      documentTitle: 'Invoice',
      documentSubtitle: 'Invoice / Bill (Without GST)',
      invoiceNumber,
      invoiceDate,
      billToHtml,
      metaPanelHtml: notesMetaHtml,
      tableHeadHtml: `
        <th style="padding:10px 12px;text-align:center;width:44px;">S.No</th>
        <th style="padding:10px 12px;text-align:left;">Description</th>
        <th style="padding:10px 12px;text-align:center;width:70px;">Qty</th>
        <th style="padding:10px 12px;text-align:right;width:100px;">Rate</th>
        <th style="padding:10px 12px;text-align:right;width:110px;">Amount</th>`,
      itemRowsHtml: itemRows,
      totalsHtml,
    });
  }

  const gst = calcGstBreakdown(subtotal, gstPercent);
  const grandTotal = round2(gst.grandTotal + shipping - discount);

  const itemRows = lineTotals
    .map((line, index) => {
      const lineCgst = round2((line.taxable * (gstPercent / 2)) / 100);
      const lineSgst = lineCgst;
      return `
      <tr>
        ${td(String(index + 1), 'center')}
        ${td(escapeHtml(line.description))}
        ${td(String(line.qty), 'center')}
        ${td(money(line.rate), 'right')}
        ${td(money(line.taxable), 'right')}
        ${td(money(lineCgst), 'right')}
        ${td(money(lineSgst), 'right')}
        ${td(money(line.taxable + lineCgst + lineSgst), 'right', 'font-weight:600;')}
      </tr>`;
    })
    .join('');

  const totalsHtml = [
    totalRow('Taxable value', money(subtotal)),
    totalRow(`CGST @ ${gstPercent / 2}%`, money(gst.cgst)),
    totalRow(`SGST @ ${gstPercent / 2}%`, money(gst.sgst)),
    shipping ? totalRow('Shipping', money(shipping)) : '',
    discount ? totalRow('Discount', `- ${money(discount)}`, { color: '#059669' }) : '',
    totalRow('Total tax', money(gst.totalTax)),
    totalRow('Grand total', money(grandTotal), { bold: true, border: true }),
    `<p style="margin:12px 0 0;font-size:11px;color:#64748b;">Amount in words: ${escapeHtml(numberToWords(grandTotal))}</p>`,
  ].join('');

  return buildInvoiceShell({
    documentTitle: 'Tax Invoice',
    documentSubtitle: 'Tax Invoice (With GST)',
    invoiceNumber,
    invoiceDate,
    billToHtml,
    metaPanelHtml: notesMetaHtml,
    showGstin: true,
    tableHeadHtml: `
      <th style="padding:10px 12px;text-align:center;width:44px;">S.No</th>
      <th style="padding:10px 12px;text-align:left;">Description</th>
      <th style="padding:10px 12px;text-align:center;width:50px;">Qty</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Rate</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Taxable</th>
      <th style="padding:10px 12px;text-align:right;width:70px;">CGST</th>
      <th style="padding:10px 12px;text-align:right;width:70px;">SGST</th>
      <th style="padding:10px 12px;text-align:right;width:90px;">Total</th>`,
    itemRowsHtml: itemRows,
    totalsHtml,
  });
}

function numberToWords(amount) {
  const n = Math.round(Number(amount) || 0);
  if (n === 0) return 'Zero Rupees Only';
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function twoDigits(num) {
    if (num < 20) return ones[num];
    return `${tens[Math.floor(num / 10)]}${ones[num % 10] ? ` ${ones[num % 10]}` : ''}`.trim();
  }

  function threeDigits(num) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    return `${hundred ? `${ones[hundred]} Hundred` : ''}${hundred && rest ? ' ' : ''}${rest ? twoDigits(rest) : ''}`.trim();
  }

  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;
  const parts = [];
  if (crore) parts.push(`${twoDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return `${parts.join(' ')} Rupees Only`;
}

function buildInvoiceEmailSummary(order) {
  return `Product ${money(order.subtotal)} + Platform fee ${money(order.platformFeeAmount)} + Delivery ${order.shippingAmount === 0 ? 'FREE' : money(order.shippingAmount)} = Total ${money(order.totalAmount)}`;
}

module.exports = {
  buildOrderInvoiceHtml,
  buildCustomInvoiceHtml,
  buildInvoiceEmailSummary,
  normalizeGstMode,
  COMPANY,
  DEFAULT_GST_PERCENT,
};
