const config = require('../config');

const COMPANY = {
  name: config.appName || 'Uniquworld',
  legalName: process.env.COMPANY_LEGAL_NAME || config.appName || 'Uniquworld',
  url: config.clientUrl || 'https://uniquworld.com',
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
};

function money(amount) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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
  const items = order.items || [];
  const payment = order.payment || {};
  const shipment = order.shipment || {};

  const customerName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() ||
    ship.fullName ||
    bill.fullName ||
    'Customer';

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
}

function buildInvoiceEmailSummary(order) {
  return `Product ${money(order.subtotal)} + Platform fee ${money(order.platformFeeAmount)} + Delivery ${
    Number(order.shippingAmount) === 0 ? 'FREE' : money(order.shippingAmount)
  } = Total ${money(order.totalAmount)}`;
}

module.exports = {
  buildOrderInvoiceHtml,
  buildInvoiceEmailSummary,
  COMPANY,
};
