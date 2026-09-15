const { query } = require('../config/database');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    gstMode: row.gst_mode,
    invoiceNumber: row.invoice_number,
    html: row.html,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function findByOrderAndGstMode(orderId, gstMode) {
  const result = await query(
    `SELECT * FROM order_invoices
     WHERE order_id = $1 AND gst_mode = $2
     LIMIT 1`,
    [orderId, gstMode],
  );
  return mapRow(result.rows[0]);
}

async function listByOrderId(orderId) {
  const result = await query(
    `SELECT id, order_id, gst_mode, invoice_number, created_at, updated_at
     FROM order_invoices
     WHERE order_id = $1
     ORDER BY gst_mode ASC`,
    [orderId],
  );
  return result.rows.map(mapRow);
}

async function upsert({ orderId, gstMode, invoiceNumber, html }) {
  const result = await query(
    `INSERT INTO order_invoices (order_id, gst_mode, invoice_number, html)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (order_id, gst_mode)
     DO UPDATE SET
       invoice_number = EXCLUDED.invoice_number,
       html = EXCLUDED.html,
       updated_at = NOW()
     RETURNING *`,
    [orderId, gstMode, invoiceNumber, html],
  );
  return mapRow(result.rows[0]);
}

module.exports = {
  findByOrderAndGstMode,
  listByOrderId,
  upsert,
};
