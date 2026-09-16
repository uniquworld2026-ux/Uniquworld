const config = require('../config');

const COMPANY = {
  name: config.appName || 'Uniquworld',
  legalName: process.env.COMPANY_LEGAL_NAME || config.appName || 'Uniquworld',
  url: config.clientUrl || 'https://uniquworld.com',
  email: process.env.COMPANY_EMAIL || 'uniquworld2026@gmail.com',
  phone: process.env.COMPANY_PHONE || '6383528117',
  address: process.env.COMPANY_ADDRESS || 'No 8, Subagiri Nagar 2nd Street, Chettiyar Agarm, Thundalam',
  city: process.env.COMPANY_CITY || 'Chennai',
  state: process.env.COMPANY_STATE || 'Tamil Nadu',
  postalCode: process.env.COMPANY_POSTAL_CODE || '600077',
  country: process.env.COMPANY_COUNTRY || 'India',
  gstin: process.env.COMPANY_GSTIN || '',
  pan: process.env.COMPANY_PAN || '',
  sacCode: process.env.COMPANY_SAC_CODE || '',
  logoUrl:
    process.env.COMPANY_LOGO_URL ||
    config.emailLogoUrl ||
    `${String(config.clientUrl || 'https://uniquworld.com').replace(/\/$/, '')}/brand/uniquworld-logo.png`,
  bank: {
    accountName: process.env.COMPANY_BANK_ACCOUNT_NAME || process.env.APP_NAME || 'Uniquworld',
    bankName: process.env.COMPANY_BANK_NAME || '',
    accountNumber: process.env.COMPANY_BANK_ACCOUNT_NUMBER || '',
    ifsc: process.env.COMPANY_BANK_IFSC || '',
    branch: process.env.COMPANY_BANK_BRANCH || '',
    swift: process.env.COMPANY_BANK_SWIFT || '',
    upi: process.env.COMPANY_BANK_UPI || '',
  },
  signatoryName: process.env.COMPANY_SIGNATORY_NAME || '',
  signatoryTitle: process.env.COMPANY_SIGNATORY_TITLE || 'Authorized Signatory',
  signatureUrl: process.env.COMPANY_SIGNATURE_URL || '',
};

const DEFAULT_GST_PERCENT = Number(process.env.DEFAULT_GST_PERCENT || 18);
const PAYMENT_TERMS =
  process.env.COMPANY_PAYMENT_TERMS ||
  'Payment is due as per the order. Prepaid amounts are marked paid.';
const DECLARATION =
  process.env.COMPANY_INVOICE_DECLARATION ||
  'We confirm that this invoice shows the actual price of the goods described and that the particulars are true.';

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

function normalizeGstMode(value) {
  const v = String(value || 'with').toLowerCase();
  return v === 'without' || v === 'no' || v === 'false' ? 'without' : 'with';
}

function joinParts(parts) {
  return parts.filter(Boolean).join(', ');
}

function companyAddressText() {
  return joinParts([
    COMPANY.address,
    joinParts([COMPANY.city, COMPANY.state, COMPANY.postalCode]),
    COMPANY.country,
  ]);
}

function amountInWords(amount) {
  const n = Math.round(Number(amount || 0));
  if (!Number.isFinite(n) || n === 0) return 'Zero Rupees Only';
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const twoDigits = (num) =>
    num < 20 ? ones[num] : `${tens[Math.floor(num / 10)]}${num % 10 ? ` ${ones[num % 10]}` : ''}`.trim();
  const threeDigits = (num) =>
    num < 100
      ? twoDigits(num)
      : `${ones[Math.floor(num / 100)]} Hundred${num % 100 ? ` ${twoDigits(num % 100)}` : ''}`.trim();

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

const CSS = `
  * { box-sizing: border-box; }
  @page { size: A4; margin: 12mm; }
  @media print { body { margin: 0; background: #fff; } .sheet { box-shadow: none; margin: 0; } }
  body { margin: 0; background: #f7f5f2; color: #1f2937; font-family: "Segoe UI", Arial, Helvetica, sans-serif; font-size: 12px; }
  .sheet { width: 820px; max-width: 100%; margin: 16px auto; background: #fff; padding: 26px 28px 22px; border-top: 4px solid #8b3a2f; }
  .top { display: grid; grid-template-columns: 1fr auto 1fr; align-items: start; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid #ece7e2; }
  .logo { height: 46px; width: auto; max-width: 170px; object-fit: contain; }
  .title { margin: 10px 0 0; text-align: center; font-size: 20px; letter-spacing: 0.18em; font-weight: 700; color: #3d2a22; }
  .meta { text-align: right; }
  .meta-row { display: grid; grid-template-columns: 108px auto; gap: 8px; justify-content: end; margin: 3px 0; }
  .meta-label { color: #9ca3af; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; text-align: right; padding-top: 2px; }
  .meta-value { font-weight: 600; min-width: 108px; }
  .chip { display: inline-block; margin-top: 8px; padding: 3px 8px; border-radius: 999px; font-size: 10px; font-weight: 700; letter-spacing: 0.06em; background: #f6efe6; color: #8b3a2f; }
  .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 16px 0 14px; }
  .card { border: 1px solid #ece7e2; border-radius: 8px; background: #fcfaf8; min-height: 142px; padding: 12px 14px; }
  .card-title { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #9ca3af; font-weight: 700; margin-bottom: 8px; }
  .name { margin: 0 0 6px; font-weight: 700; }
  .muted { margin: 0 0 3px; color: #4b5563; }
  table.items { width: 100%; border-collapse: collapse; border: 1px solid #d9d3cd; margin-top: 4px; }
  table.items th, table.items td { border: 1px solid #e4dfda; padding: 8px 10px; vertical-align: middle; }
  table.items th { text-align: left; font-size: 11px; color: #5c534c; font-weight: 700; background: #f7f4f1; }
  table.items th.c, table.items td.c { text-align: center; }
  table.items th.r, table.items td.r { text-align: right; }
  table.items tfoot td { background: #fcfaf8; }
  table.items tr.grand td { font-weight: 700; color: #3d2a22; background: #f6efe6; }
  .sac { margin-top: 8px; font-size: 11px; color: #6b7280; }
  .words { margin-top: 8px; font-size: 11px; color: #6b7280; }
  .bottom { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; }
  .bank-line { display: grid; grid-template-columns: 108px 1fr; gap: 8px; margin: 3px 0; }
  .bank-line span { color: #9ca3af; font-size: 10px; letter-spacing: 0.06em; text-transform: uppercase; padding-top: 2px; }
  .bank-line strong { font-weight: 600; }
  .sign-block { margin-top: 22px; text-align: right; min-height: 86px; }
  .sign-space { height: 52px; margin-left: auto; width: 170px; display: flex; align-items: flex-end; justify-content: flex-end; }
  .sign-space img { max-height: 48px; max-width: 150px; object-fit: contain; }
  .sign-name { font-weight: 700; }
  .sign-meta { color: #6b7280; font-size: 11px; }
`;

const BANK_FIELDS = ['accountName', 'bankName', 'accountNumber', 'ifsc', 'branch', 'swift', 'upi'];

async function loadCompany() {
  try {
    const { query } = require('../config/database');
    const result = await query(`SELECT value FROM settings WHERE key = $1 LIMIT 1`, ['invoice_company']);
    const saved = result.rows[0]?.value || {};
    return {
      ...COMPANY,
      bank: { ...COMPANY.bank, ...(saved.bank || {}) },
    };
  } catch {
    return COMPANY;
  }
}

function bankPayload(body = {}) {
  const bank = {};
  for (const key of BANK_FIELDS) bank[key] = String(body[key] ?? '').trim();
  return bank;
}

async function getInvoiceBank() {
  const company = await loadCompany();
  return bankPayload(company.bank);
}

async function saveInvoiceBank(body) {
  const { query } = require('../config/database');
  const bank = bankPayload(body);
  await query(
    `INSERT INTO settings (key, value, group_name, description)
     VALUES ('invoice_company', $1::jsonb, 'invoice', 'Bank details printed on invoices')
     ON CONFLICT (key) DO UPDATE
       SET value = jsonb_set(COALESCE(settings.value, '{}'::jsonb), '{bank}', $2::jsonb, true),
           updated_at = NOW()`,
    [JSON.stringify({ bank }), JSON.stringify(bank)],
  );
  await refreshStoredInvoices();
  return bank;
}

async function refreshStoredInvoices() {
  const { query } = require('../config/database');
  const orderRepository = require('../repositories/order.repository');
  const stored = await query(`SELECT id, order_id, gst_mode FROM order_invoices`);
  for (const row of stored.rows) {
    const order = await orderRepository.findById(row.order_id);
    if (!order) continue;
    const userResult = await query(
      `SELECT email, first_name, last_name, phone FROM users WHERE id = $1 LIMIT 1`,
      [order.userId],
    );
    const user = userResult.rows[0];
    const customer = user
      ? {
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
        }
      : {};
    const html = await buildOrderInvoiceHtml(order, customer, { gstMode: row.gst_mode });
    await query(`UPDATE order_invoices SET html = $1, updated_at = NOW() WHERE id = $2`, [html, row.id]);
  }

  const manuals = await query(`SELECT id, invoice_number, gst_mode, payload FROM manual_invoices`);
  for (const row of manuals.rows) {
    const payload = row.payload && typeof row.payload === 'object' ? row.payload : {};
    const html = await buildCustomInvoiceHtml(
      { ...payload, invoiceNumber: row.invoice_number },
      { gstMode: row.gst_mode },
    );
    await query(`UPDATE manual_invoices SET html = $1, updated_at = NOW() WHERE id = $2`, [html, row.id]);
  }
}

function page(title, body) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><title>${escapeHtml(title)}</title><style>${CSS}</style></head><body><div class="sheet">${body}</div></body></html>`;
}

function header({ title, invoiceNumber, invoiceDate, dueDate, status }, co = COMPANY) {
  return `
  <div class="top">
    <div>${co.logoUrl ? `<img class="logo" src="${escapeHtml(co.logoUrl)}" alt="${escapeHtml(co.name)}" />` : `<strong>${escapeHtml(co.name)}</strong>`}</div>
    <h1 class="title">${escapeHtml(title)}</h1>
    <div class="meta">
      <div class="meta-row"><div class="meta-label">Invoice no.</div><div class="meta-value">${escapeHtml(invoiceNumber)}</div></div>
      <div class="meta-row"><div class="meta-label">Invoice date</div><div class="meta-value">${escapeHtml(invoiceDate)}</div></div>
      <div class="meta-row"><div class="meta-label">Due date</div><div class="meta-value">${escapeHtml(dueDate || '—')}</div></div>
      ${status ? `<span class="chip">${escapeHtml(status)}</span>` : ''}
    </div>
  </div>`;
}

function fromCard(showGst, co = COMPANY) {
  const address = [co.address, [co.city, co.state, co.postalCode].filter(Boolean).join(', '), co.country]
    .filter(Boolean)
    .join(', ');
  return `
  <div class="card">
    <div class="card-title">From</div>
    <p class="name">${escapeHtml(co.legalName)}</p>
    <p class="muted">Address: ${escapeHtml(address || '—')}</p>
    ${showGst && co.gstin ? `<p class="muted">GSTIN: ${escapeHtml(co.gstin)}</p>` : ''}
    ${co.email ? `<p class="muted">Email: ${escapeHtml(co.email)}</p>` : ''}
    ${co.phone ? `<p class="muted">Phone: ${escapeHtml(co.phone)}</p>` : ''}
  </div>`;
}

function toCard({ name, address, extra = '' }) {
  return `
  <div class="card">
    <div class="card-title">To</div>
    <p class="name">${escapeHtml(name || '—')}</p>
    <p class="muted">Address: ${escapeHtml(address || '—')}</p>
    ${extra}
  </div>`;
}

function bankCard(co = COMPANY) {
  const b = co.bank || {};
  const row = (label, value) =>
    value ? `<div class="bank-line"><span>${label}</span><strong>${escapeHtml(value)}</strong></div>` : '';
  return `
  <div class="card">
    <div class="card-title">Bank &amp; remittance details</div>
    <p class="muted" style="margin-bottom:8px;">Please pay to the account below and quote the invoice number.</p>
    ${row('Account name', b.accountName)}
    ${row('Bank name', b.bankName)}
    ${row('Account no.', b.accountNumber)}
    ${row('Branch', b.branch)}
    ${row('IFSC code', b.ifsc)}
    ${row('SWIFT code', b.swift)}
    ${row('UPI', b.upi)}
  </div>`;
}

function declarationCard(placeDate, co = COMPANY) {
  return `
  <div class="card">
    <div class="card-title">Declaration &amp; payment terms</div>
    <p class="muted">${escapeHtml(DECLARATION)} ${escapeHtml(PAYMENT_TERMS)}</p>
    <div class="sign-block">
      <div class="sign-space">${co.signatureUrl ? `<img src="${escapeHtml(co.signatureUrl)}" alt="Signature" />` : ''}</div>
      <div class="sign-name">${escapeHtml(co.signatoryName || co.legalName)}</div>
      <div class="sign-meta">${escapeHtml(co.signatoryTitle)}${placeDate ? ` · ${escapeHtml(placeDate)}` : ''}</div>
    </div>
  </div>`;
}

function totalRow(label, value, grand = false) {
  return `<tr class="${grand ? 'grand' : 'sum'}"><td colspan="4" class="r">${escapeHtml(label)}</td><td class="r">${value}</td></tr>`;
}

function itemsTable(rows, { sacCode, totals = [], grand }) {
  const foot = totals.map((row) => totalRow(row.label, row.value, row.grand)).join('');
  return `
  <table class="items">
    <thead>
      <tr>
        <th class="c" style="width:56px;">S.No</th>
        <th>Description</th>
        <th class="c" style="width:72px;">QTY</th>
        <th class="r" style="width:120px;">Rate (INR)</th>
        <th class="r" style="width:130px;">Amount (INR)</th>
      </tr>
    </thead>
    <tbody>${rows || '<tr><td colspan="5">No items</td></tr>'}</tbody>
    <tfoot>${foot}</tfoot>
  </table>
  ${sacCode ? `<div class="sac">(SAC CODE: ${escapeHtml(sacCode)})</div>` : ''}
  <div class="words">Amount in words: ${escapeHtml(amountInWords(grand))}</div>`;
}

async function buildOrderInvoiceHtml(order, customer = {}, options = {}) {
  const co = await loadCompany();
  const showGst = normalizeGstMode(options.gstMode) === 'with';
  const ship = order.shippingAddress || {};
  const bill = order.billingAddress || ship || {};
  const payment = order.payment || {};
  const customerName =
    [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() ||
    bill.fullName ||
    ship.fullName ||
    'Customer';
  const toAddress = joinParts([
    bill.line1 || ship.line1,
    bill.line2 || ship.line2,
    joinParts([bill.city || ship.city, bill.state || ship.state, bill.postalCode || ship.postalCode]),
    bill.country || ship.country || 'India',
  ]);
  const extraTo = [
    customer.email || bill.email ? `<p class="muted">Email: ${escapeHtml(customer.email || bill.email)}</p>` : '',
    bill.phone || ship.phone || customer.phone
      ? `<p class="muted">Phone: ${escapeHtml(bill.phone || ship.phone || customer.phone)}</p>`
      : '',
  ].join('');
  const rows = (order.items || [])
    .map((item, index) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.unitPrice) || 0;
      const lineTotal = Number(item.totalPrice ?? rate * qty);
      return `<tr><td class="c">${index + 1}</td><td>${escapeHtml(item.productName)}</td><td class="c">${qty}</td><td class="r">${money(rate)}</td><td class="r">${money(lineTotal)}</td></tr>`;
    })
    .join('');
  const grand = round2(order.totalAmount);
  const totals = [
    { label: 'Subtotal', value: money(order.subtotal) },
    Number(order.platformFeeAmount) ? { label: 'Platform fee', value: money(order.platformFeeAmount) } : null,
    { label: 'Delivery', value: Number(order.shippingAmount) === 0 ? 'FREE' : money(order.shippingAmount) },
    Number(order.discountAmount) ? { label: 'Discount', value: `- ${money(order.discountAmount)}` } : null,
    { label: 'Grand Total', value: money(grand), grand: true },
  ].filter(Boolean);
  const status = String(payment.status || '').toLowerCase() === 'paid' ? 'PAID' : String(payment.method || 'PENDING').toUpperCase();
  const body = `
    ${header({
      title: showGst ? 'TAX INVOICE' : 'INVOICE',
      invoiceNumber: order.orderNumber,
      invoiceDate: formatDate(order.createdAt),
      dueDate: status === 'PAID' ? 'Paid' : '—',
      status,
    }, co)}
    <div class="parties">
      ${fromCard(showGst, co)}
      ${toCard({ name: customerName, address: toAddress, extra: extraTo })}
    </div>
    ${itemsTable(rows, { sacCode: showGst ? co.sacCode : '', totals, grand })}
    <div class="bottom">
      ${bankCard(co)}
      ${declarationCard([co.city, formatDate(order.createdAt)].filter(Boolean).join(' · '), co)}
    </div>`;
  return page(`Tax Invoice ${order.orderNumber}`, body);
}

async function buildCustomInvoiceHtml(payload = {}, options = {}) {
  const co = await loadCompany();
  const showGst = normalizeGstMode(options.gstMode ?? payload.gstMode) === 'with';
  const items = (payload.items || []).filter((i) => i.description?.trim());
  const invoiceNumber = payload.invoiceNumber || `INV-${Date.now()}`;
  const invoiceDate = formatDate(payload.invoiceDate || new Date());
  const customer = payload.customer || {};
  const discount = round2(payload.discount || 0);
  const shipping = round2(payload.shipping || 0);
  const lines = items.map((item) => {
    const qty = Number(item.quantity) || 1;
    const rate = round2(item.rate);
    return { qty, description: item.description, rate, amount: round2(qty * rate) };
  });
  const subtotal = round2(lines.reduce((sum, line) => sum + line.amount, 0));
  const grand = round2(subtotal + shipping - discount);
  const rows = lines
    .map(
      (line, index) =>
        `<tr><td class="c">${index + 1}</td><td>${escapeHtml(line.description)}</td><td class="c">${line.qty}</td><td class="r">${money(line.rate)}</td><td class="r">${money(line.amount)}</td></tr>`,
    )
    .join('');
  const totals = [
    { label: 'Subtotal', value: money(subtotal) },
    { label: 'Delivery', value: shipping ? money(shipping) : 'FREE' },
    discount ? { label: 'Discount', value: `- ${money(discount)}` } : null,
    { label: 'Grand Total', value: money(grand), grand: true },
  ].filter(Boolean);
  const extraTo = [
    customer.email ? `<p class="muted">Email: ${escapeHtml(customer.email)}</p>` : '',
    customer.phone ? `<p class="muted">Phone: ${escapeHtml(customer.phone)}</p>` : '',
  ].join('');
  const body = `
    ${header({ title: showGst ? 'TAX INVOICE' : 'INVOICE', invoiceNumber, invoiceDate, dueDate: payload.dueDate ? formatDate(payload.dueDate) : '—' }, co)}
    <div class="parties">${fromCard(showGst, co)}${toCard({ name: customer.name || 'Customer', address: customer.address || '—', extra: extraTo })}</div>
    ${itemsTable(rows, { sacCode: showGst ? co.sacCode : '', totals, grand })}
    <div class="bottom">${bankCard(co)}${declarationCard([co.city, invoiceDate].filter(Boolean).join(' · '), co)}</div>`;
  return page(`Invoice ${invoiceNumber}`, body);
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
  getInvoiceBank,
  saveInvoiceBank,
  normalizeGstMode,
  COMPANY,
  DEFAULT_GST_PERCENT,
};
