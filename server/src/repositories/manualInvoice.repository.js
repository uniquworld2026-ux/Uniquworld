const { query } = require('../config/database');

function mapList(row) {
  if (!row) return null;
  return {
    id: row.id,
    source: row.source,
    invoiceNumber: row.invoice_number,
    gstMode: row.gst_mode,
    customerName: row.customer_name || 'Customer',
    orderNumber: row.order_number || null,
    orderId: row.order_id || null,
    totalAmount: Number(row.total_amount || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDocument(row, source) {
  if (!row) return null;
  return {
    id: row.id,
    source,
    invoiceNumber: row.invoice_number,
    gstMode: row.gst_mode,
    customerName: row.customer_name || 'Customer',
    orderNumber: row.order_number || null,
    orderId: row.order_id || null,
    totalAmount: Number(row.total_amount || 0),
    html: row.html,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listAll() {
  const result = await query(
    `SELECT * FROM (
       SELECT
         oi.id::text AS id,
         'order'::text AS source,
         oi.invoice_number,
         oi.gst_mode,
         COALESCE(
           NULLIF(o.shipping_address_snap->>'fullName', ''),
           NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
           'Customer'
         ) AS customer_name,
         o.order_number,
         o.id::text AS order_id,
         o.total_amount,
         oi.created_at,
         oi.updated_at
       FROM order_invoices oi
       JOIN orders o ON o.id = oi.order_id
       LEFT JOIN users u ON u.id = o.user_id
       UNION ALL
       SELECT
         mi.id::text,
         'manual'::text,
         mi.invoice_number,
         mi.gst_mode,
         mi.customer_name,
         NULL::varchar,
         NULL::text,
         mi.total_amount,
         mi.created_at,
         mi.updated_at
       FROM manual_invoices mi
     ) invoices
     ORDER BY updated_at DESC`,
  );
  return result.rows.map(mapList);
}

async function findOrderInvoice(id) {
  const result = await query(
    `SELECT
       oi.id,
       oi.invoice_number,
       oi.gst_mode,
       oi.html,
       oi.created_at,
       oi.updated_at,
       o.order_number,
       o.id AS order_id,
       o.total_amount,
       COALESCE(
         NULLIF(o.shipping_address_snap->>'fullName', ''),
         NULLIF(TRIM(CONCAT(u.first_name, ' ', u.last_name)), ''),
         'Customer'
       ) AS customer_name
     FROM order_invoices oi
     JOIN orders o ON o.id = oi.order_id
     LEFT JOIN users u ON u.id = o.user_id
     WHERE oi.id = $1
     LIMIT 1`,
    [id],
  );
  return mapDocument(result.rows[0], 'order');
}

async function findManual(id) {
  const result = await query(
    `SELECT id, invoice_number, gst_mode, customer_name, total_amount, html, created_at, updated_at
     FROM manual_invoices
     WHERE id = $1
     LIMIT 1`,
    [id],
  );
  return mapDocument(result.rows[0], 'manual');
}

async function upsertManual({
  invoiceNumber,
  gstMode,
  customerName,
  customerEmail,
  totalAmount,
  payload,
  html,
}) {
  const result = await query(
    `INSERT INTO manual_invoices (
       invoice_number, gst_mode, customer_name, customer_email, total_amount, payload, html
     )
     VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7)
     ON CONFLICT (invoice_number)
     DO UPDATE SET
       gst_mode = EXCLUDED.gst_mode,
       customer_name = EXCLUDED.customer_name,
       customer_email = EXCLUDED.customer_email,
       total_amount = EXCLUDED.total_amount,
       payload = EXCLUDED.payload,
       html = EXCLUDED.html,
       updated_at = NOW()
     RETURNING id, invoice_number, gst_mode, customer_name, total_amount, html, created_at, updated_at`,
    [
      invoiceNumber,
      gstMode,
      customerName || 'Customer',
      customerEmail || null,
      totalAmount,
      JSON.stringify(payload || {}),
      html,
    ],
  );
  return mapDocument(result.rows[0], 'manual');
}

module.exports = {
  listAll,
  findOrderInvoice,
  findManual,
  upsertManual,
};
