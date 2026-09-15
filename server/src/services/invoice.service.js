const config = require('../config');

const COMPANY = {
  name: config.appName || 'Uniquworld',
  legalName: process.env.COMPANY_LEGAL_NAME || config.appName || 'Uniquworld',
  url: config.clientUrl || 'https://uniquworld.com',
<<<<<<< HEAD
  email: process.env.COMPANY_EMAIL || config.smtp?.fromEmail || 'admin@uniquworld.com',
  phone: process.env.COMPANY_PHONE || '',
  address: process.env.COMPANY_ADDRESS || '',
  city: process.env.COMPANY_CITY || '',
  state: process.env.COMPANY_STATE || '',
  postalCode: process.env.COMPANY_POSTAL_CODE || '',
  country: process.env.COMPANY_COUNTRY || 'India',
  gstin: process.env.COMPANY_GSTIN || '',
  pan: process.env.COMPANY_PAN || '',
  cin: process.env.COMPANY_CIN || '',
  logoUrl: config.emailLogoUrl || '',
  bank: {
    accountName: process.env.COMPANY_BANK_ACCOUNT_NAME || process.env.APP_NAME || 'Uniquworld',
    bankName: process.env.COMPANY_BANK_NAME || '',
    accountNumber: process.env.COMPANY_BANK_ACCOUNT_NUMBER || '',
    ifsc: process.env.COMPANY_BANK_IFSC || '',
    branch: process.env.COMPANY_BANK_BRANCH || '',
    accountType: process.env.COMPANY_BANK_ACCOUNT_TYPE || 'Current',
    upi: process.env.COMPANY_BANK_UPI || '',
  },
=======
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
>>>>>>> 1515989d89d93fd98f7d625e2291f263c60e710e
};

function companyLogoHtml() {
  if (!COMPANY.logoUrl) return '';
  return `<img src="${escapeHtml(COMPANY.logoUrl)}" alt="${escapeHtml(COMPANY.name)}" style="display:block;height:52px;width:auto;max-width:220px;object-fit:contain;margin-bottom:10px;" />`;
}

const DEFAULT_GST_PERCENT = Number(process.env.DEFAULT_GST_PERCENT || 18);

function money(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function round2(n) {
  return Math.round((Number(n) || 0) * 100) / 100;
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
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

<<<<<<< HEAD
function amountInWords(amount) {
  const n = Math.round(Number(amount || 0));
  if (!Number.isFinite(n)) return '';
  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const twoDigits = (num) => {
    if (num < 20) return ones[num];
    return `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ''}`.trim();
  };

  const threeDigits = (num) => {
    if (num < 100) return twoDigits(num);
    return `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ` ${twoDigits(num % 100)}` : ''}`.trim();
  };

  if (n === 0) return 'Zero Rupees Only';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = n % 1000;
  const parts = [];
  if (crore) parts.push(`${threeDigits(crore)} Crore`);
  if (lakh) parts.push(`${twoDigits(lakh)} Lakh`);
  if (thousand) parts.push(`${twoDigits(thousand)} Thousand`);
  if (hundred) parts.push(threeDigits(hundred));
  return `${parts.join(' ')} Rupees Only`;
}

function companyAddressLines() {
  const lines = [];
  if (COMPANY.address) lines.push(COMPANY.address);
  const cityLine = [COMPANY.city, COMPANY.state, COMPANY.postalCode].filter(Boolean).join(', ');
  if (cityLine) lines.push(cityLine);
  if (COMPANY.country) lines.push(COMPANY.country);
  return lines;
}

function hasBankDetails() {
  const b = COMPANY.bank;
  return Boolean(b.bankName || b.accountNumber || b.ifsc || b.upi);
}

/** Printable Flipkart / Amazon style tax invoice HTML. */
function buildOrderInvoiceHtml(order, customer = {}) {
  const ship = order.shippingAddress || {};
  const bill = order.billingAddress || order.shippingAddress || {};
=======
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
>>>>>>> 1515989d89d93fd98f7d625e2291f263c60e710e
  const items = order.items || [];
  const payment = order.payment || {};
  const shipment = order.shipment || {};

  const customerName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() ||
    ship.fullName ||
    bill.fullName ||
    'Customer';

<<<<<<< HEAD
  const paymentStatus = String(payment.status || 'pending').toLowerCase();
  const paymentLabel =
    paymentStatus === 'paid'
      ? 'PAID'
      : paymentStatus === 'failed'
        ? 'FAILED'
        : String(payment.method || '').toLowerCase() === 'cod'
          ? 'COD'
          : 'PENDING';

  const itemRows = items
    .map((item, index) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.unitPrice) || 0;
      const lineTotal = Number(item.totalPrice ?? rate * qty);
      return `
      <tr>
        <td class="c">${index + 1}</td>
        <td>
          <div class="item-name">${escapeHtml(item.productName)}</div>
          ${item.sku ? `<div class="muted tiny">SKU: ${escapeHtml(item.sku)}</div>` : ''}
        </td>
        <td class="c">${qty}</td>
        <td class="r">${money(rate)}</td>
        <td class="r">${money(lineTotal)}</td>
      </tr>`;
    })
    .join('');

  const soldByBlock = `
    <div class="box">
      <div class="box-title">Sold By</div>
      <div class="strong">${escapeHtml(COMPANY.legalName)}</div>
      ${companyAddressLines()
        .map((line) => `<div class="muted">${escapeHtml(line)}</div>`)
        .join('')}
      ${COMPANY.gstin ? `<div class="meta">GSTIN: <strong>${escapeHtml(COMPANY.gstin)}</strong></div>` : ''}
      ${COMPANY.pan ? `<div class="meta">PAN: <strong>${escapeHtml(COMPANY.pan)}</strong></div>` : ''}
      ${COMPANY.cin ? `<div class="meta">CIN: <strong>${escapeHtml(COMPANY.cin)}</strong></div>` : ''}
      ${COMPANY.email ? `<div class="meta">Email: ${escapeHtml(COMPANY.email)}</div>` : ''}
      ${COMPANY.phone ? `<div class="meta">Phone: ${escapeHtml(COMPANY.phone)}</div>` : ''}
    </div>`;

  const billToBlock = `
    <div class="box">
      <div class="box-title">Billing Address</div>
      <div class="strong">${escapeHtml(bill.fullName || customerName)}</div>
      <div class="muted">${escapeHtml([bill.line1, bill.line2].filter(Boolean).join(', '))}</div>
      <div class="muted">${escapeHtml([bill.city, bill.state, bill.postalCode].filter(Boolean).join(', '))}</div>
      <div class="muted">${escapeHtml(bill.country || 'India')}</div>
      <div class="meta">${escapeHtml(customer.email || bill.email || '')}</div>
      <div class="meta">${escapeHtml(bill.phone || customer.phone || ship.phone || '')}</div>
    </div>`;

  const shipToBlock = `
    <div class="box">
      <div class="box-title">Shipping Address</div>
      <div class="strong">${escapeHtml(ship.fullName || customerName)}</div>
      <div class="muted">${escapeHtml([ship.line1, ship.line2].filter(Boolean).join(', '))}</div>
      <div class="muted">${escapeHtml([ship.city, ship.state, ship.postalCode].filter(Boolean).join(', '))}</div>
      <div class="muted">${escapeHtml(ship.country || 'India')}</div>
      <div class="meta">${escapeHtml(ship.phone || customer.phone || '')}</div>
      ${
        shipment.awbCode
          ? `<div class="meta">AWB: <strong>${escapeHtml(shipment.awbCode)}</strong></div>`
          : ''
      }
      ${
        shipment.courierName
          ? `<div class="meta">Courier: ${escapeHtml(shipment.courierName)}</div>`
          : ''
      }
    </div>`;

  const bankBlock = hasBankDetails()
    ? `
    <div class="bank-box">
      <div class="box-title">Bank / Payment Details</div>
      <table class="bank-table">
        <tr><td>Account name</td><td>${escapeHtml(COMPANY.bank.accountName)}</td></tr>
        ${COMPANY.bank.bankName ? `<tr><td>Bank name</td><td>${escapeHtml(COMPANY.bank.bankName)}</td></tr>` : ''}
        ${COMPANY.bank.accountNumber ? `<tr><td>Account number</td><td>${escapeHtml(COMPANY.bank.accountNumber)}</td></tr>` : ''}
        ${COMPANY.bank.ifsc ? `<tr><td>IFSC</td><td>${escapeHtml(COMPANY.bank.ifsc)}</td></tr>` : ''}
        ${COMPANY.bank.branch ? `<tr><td>Branch</td><td>${escapeHtml(COMPANY.bank.branch)}</td></tr>` : ''}
        ${COMPANY.bank.accountType ? `<tr><td>Account type</td><td>${escapeHtml(COMPANY.bank.accountType)}</td></tr>` : ''}
        ${COMPANY.bank.upi ? `<tr><td>UPI ID</td><td>${escapeHtml(COMPANY.bank.upi)}</td></tr>` : ''}
      </table>
      <p class="tiny muted" style="margin:8px 0 0;">Use order number <strong>${escapeHtml(order.orderNumber)}</strong> as payment reference.</p>
    </div>`
    : `
    <div class="bank-box">
      <div class="box-title">Bank / Payment Details</div>
      <p class="muted tiny">Online payments are collected via Razorpay. For bank transfer / NEFT details, contact ${escapeHtml(COMPANY.email)}.</p>
    </div>`;

  const paymentRef = payment.gatewayPaymentId
    ? `<div class="meta">Txn / Razorpay ID: <strong>${escapeHtml(payment.gatewayPaymentId)}</strong></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Tax Invoice ${escapeHtml(order.orderNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    @media print {
      .no-print { display: none !important; }
      body { margin: 0; }
      .page { box-shadow: none; border: none; }
    }
    body {
      margin: 0;
      background: #f3f4f6;
      color: #111827;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 12px;
      line-height: 1.45;
    }
    .page {
      max-width: 900px;
      margin: 18px auto;
      background: #fff;
      border: 1px solid #d1d5db;
      padding: 22px 24px 28px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: flex-start;
      border-bottom: 2px solid #111827;
      padding-bottom: 14px;
    }
    .brand {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .brand img {
      width: 54px;
      height: 54px;
      object-fit: contain;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #fff;
    }
    .brand h1 {
      margin: 0;
      font-size: 22px;
      letter-spacing: 0.02em;
    }
    .doc-type {
      margin: 4px 0 0;
      font-size: 13px;
      font-weight: 700;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .invoice-meta {
      text-align: right;
      min-width: 220px;
    }
    .invoice-meta .label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      font-weight: 700;
    }
    .invoice-meta .value {
      font-size: 16px;
      font-weight: 700;
      margin-top: 2px;
    }
    .badge {
      display: inline-block;
      margin-top: 8px;
      padding: 3px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      border: 1px solid;
    }
    .badge-paid { color: #166534; background: #dcfce7; border-color: #86efac; }
    .badge-cod { color: #1e40af; background: #dbeafe; border-color: #93c5fd; }
    .badge-pending { color: #92400e; background: #fef3c7; border-color: #fcd34d; }
    .badge-failed { color: #991b1b; background: #fee2e2; border-color: #fca5a5; }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }
    .box {
      border: 1px solid #e5e7eb;
      background: #fafafa;
      padding: 12px;
      min-height: 138px;
    }
    .box-title {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .strong { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
    .muted { color: #4b5563; }
    .tiny { font-size: 11px; }
    .meta { margin-top: 4px; color: #374151; }
    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
      font-size: 12px;
    }
    table.items th {
      background: #111827;
      color: #fff;
      padding: 9px 10px;
      text-align: left;
      font-size: 11px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    table.items td {
      padding: 10px;
      border-bottom: 1px solid #e5e7eb;
      vertical-align: top;
    }
    table.items tr:nth-child(even) td { background: #f9fafb; }
    .item-name { font-weight: 600; }
    .c { text-align: center; }
    .r { text-align: right; white-space: nowrap; }
    .summary-wrap {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 16px;
      margin-top: 16px;
    }
    .amount-words {
      border: 1px dashed #d1d5db;
      padding: 12px;
      background: #fff;
    }
    .totals {
      border: 1px solid #e5e7eb;
      padding: 12px 14px;
      background: #fafafa;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 5px 0;
    }
    .totals-row.grand {
      margin-top: 8px;
      padding-top: 10px;
      border-top: 2px solid #111827;
      font-size: 15px;
      font-weight: 700;
    }
    .bank-box {
      margin-top: 16px;
      border: 1px solid #bfdbfe;
      background: #eff6ff;
      padding: 12px 14px;
    }
    .bank-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 4px;
    }
    .bank-table td {
      padding: 3px 0;
      vertical-align: top;
    }
    .bank-table td:first-child {
      width: 140px;
      color: #4b5563;
    }
    .bank-table td:last-child { font-weight: 600; }
    .sign-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 14px;
      margin-top: 28px;
    }
    .sign-box {
      border: 1px solid #d1d5db;
      min-height: 130px;
      padding: 10px 12px;
      position: relative;
    }
    .sign-box .box-title { margin-bottom: 6px; }
    .sign-space {
      height: 72px;
      border: 1px dashed #cbd5e1;
      margin: 8px 0;
      background: #fff;
    }
    .sign-caption {
      font-size: 11px;
      color: #6b7280;
      text-align: center;
    }
    .terms {
      margin-top: 18px;
      border-top: 1px solid #e5e7eb;
      padding-top: 12px;
      color: #6b7280;
      font-size: 11px;
    }
    .terms ul {
      margin: 6px 0 0;
      padding-left: 16px;
    }
    .footer {
      margin-top: 14px;
      text-align: center;
      color: #9ca3af;
      font-size: 11px;
    }
    @media (max-width: 720px) {
      .grid-3, .summary-wrap, .sign-row, .header { grid-template-columns: 1fr; display: grid; }
      .invoice-meta { text-align: left; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="brand">
        ${
          COMPANY.logoUrl
            ? `<img src="${escapeHtml(COMPANY.logoUrl)}" alt="${escapeHtml(COMPANY.name)}" />`
            : ''
        }
        <div>
          <h1>${escapeHtml(COMPANY.name)}</h1>
          <p class="doc-type">Tax Invoice</p>
          <div class="muted tiny" style="margin-top:4px;">${escapeHtml(COMPANY.url)}</div>
        </div>
      </div>
      <div class="invoice-meta">
        <div class="label">Invoice number</div>
        <div class="value">${escapeHtml(order.orderNumber)}</div>
        <div class="meta"><strong>Invoice date:</strong> ${formatDate(order.createdAt)}</div>
        <div class="meta"><strong>Order status:</strong> ${escapeHtml(String(order.status || '').replace(/_/g, ' '))}</div>
        <div class="meta"><strong>Payment:</strong> ${escapeHtml(String(payment.method || '—').toUpperCase())}</div>
        ${paymentRef}
        <span class="badge ${
          paymentLabel === 'PAID'
            ? 'badge-paid'
            : paymentLabel === 'COD'
              ? 'badge-cod'
              : paymentLabel === 'FAILED'
                ? 'badge-failed'
                : 'badge-pending'
        }">${escapeHtml(paymentLabel)}</span>
      </div>
    </div>

    <div class="grid-3">
      ${soldByBlock}
      ${billToBlock}
      ${shipToBlock}
    </div>

    <table class="items">
      <thead>
        <tr>
          <th style="width:48px;" class="c">S.No</th>
          <th>Description</th>
          <th style="width:70px;" class="c">Qty</th>
          <th style="width:110px;" class="r">Unit price</th>
          <th style="width:120px;" class="r">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemRows || '<tr><td colspan="5" style="padding:14px;">No items</td></tr>'}
      </tbody>
    </table>

    <div class="summary-wrap">
      <div class="amount-words">
        <div class="box-title">Amount in words</div>
        <div class="strong">${escapeHtml(amountInWords(order.totalAmount))}</div>
        <div class="muted tiny" style="margin-top:10px;">
          This is a computer-generated tax invoice${COMPANY.gstin ? ' under GST' : ''}.
          ${payment.paidAt ? ` Payment received on ${formatDate(payment.paidAt)}.` : ''}
        </div>
      </div>
      <div class="totals">
        <div class="totals-row"><span>Product total</span><span>${money(order.subtotal)}</span></div>
        <div class="totals-row"><span>Platform fee</span><span>${money(order.platformFeeAmount)}</span></div>
        <div class="totals-row"><span>Delivery charges</span><span>${
          Number(order.shippingAmount) === 0 ? 'FREE' : money(order.shippingAmount)
        }</span></div>
        ${
          Number(order.discountAmount)
            ? `<div class="totals-row" style="color:#166534;"><span>Discount</span><span>- ${money(order.discountAmount)}</span></div>`
            : ''
        }
        ${
          Number(order.taxAmount)
            ? `<div class="totals-row"><span>Tax</span><span>${money(order.taxAmount)}</span></div>`
            : ''
        }
        <div class="totals-row grand"><span>Grand total</span><span>${money(order.totalAmount)}</span></div>
      </div>
    </div>

    ${bankBlock}

    <div class="sign-row">
      <div class="sign-box">
        <div class="box-title">Customer acknowledgement</div>
        <div class="sign-space"></div>
        <div class="sign-caption">Signature of receiver</div>
      </div>
      <div class="sign-box">
        <div class="box-title">Company stamp</div>
        <div class="sign-space"></div>
        <div class="sign-caption">Official seal / stamp</div>
      </div>
      <div class="sign-box">
        <div class="box-title">Authorized signatory</div>
        <div class="sign-space"></div>
        <div class="sign-caption">For ${escapeHtml(COMPANY.legalName)}</div>
      </div>
    </div>

    <div class="terms">
      <strong>Terms &amp; conditions</strong>
      <ul>
        <li>Goods once sold will be exchanged/returned as per Uniquworld return policy.</li>
        <li>Please retain this invoice for warranty / return claims.</li>
        <li>Subject to jurisdiction of company registered office.</li>
        <li>For support write to ${escapeHtml(COMPANY.email)}${
          COMPANY.phone ? ` or call ${escapeHtml(COMPANY.phone)}` : ''
        }.</li>
      </ul>
    </div>

    <div class="footer">
      Thank you for shopping with ${escapeHtml(COMPANY.name)} · ${escapeHtml(COMPANY.url)}
    </div>
  </div>
</body>
</html>`;
=======
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
>>>>>>> 1515989d89d93fd98f7d625e2291f263c60e710e
}

function buildInvoiceEmailSummary(order) {
  return `Product ${money(order.subtotal)} + Platform fee ${money(order.platformFeeAmount)} + Delivery ${
    Number(order.shippingAmount) === 0 ? 'FREE' : money(order.shippingAmount)
  } = Total ${money(order.totalAmount)}`;
}

module.exports = {
  buildOrderInvoiceHtml,
  buildCustomInvoiceHtml,
  buildInvoiceEmailSummary,
  normalizeGstMode,
  COMPANY,
  DEFAULT_GST_PERCENT,
};
