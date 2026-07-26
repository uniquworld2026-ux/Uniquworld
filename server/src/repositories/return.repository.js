const { query } = require('../config/database');

const toReturn = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    orderId: row.order_id,
    userId: row.user_id,
    status: row.status,
    reason: row.reason,
    notes: row.notes,
    refundAmount: row.refund_amount != null ? Number(row.refund_amount) : null,
    shiprocketReturnId: row.shiprocket_return_id,
    requestedAt: row.requested_at,
    resolvedAt: row.resolved_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const create = async ({ userId, orderId, reason, notes, refundAmount }) => {
  const result = await query(
    `INSERT INTO order_returns (user_id, order_id, reason, notes, refund_amount)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, orderId, reason, notes || null, refundAmount ?? null]
  );
  return toReturn(result.rows[0]);
};

const listByUser = async (userId) => {
  const result = await query(
    `SELECT * FROM order_returns WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(toReturn);
};

const findByOrderForUser = async (orderId, userId) => {
  const result = await query(
    `SELECT * FROM order_returns WHERE order_id = $1 AND user_id = $2
     ORDER BY created_at DESC LIMIT 1`,
    [orderId, userId]
  );
  return toReturn(result.rows[0]);
};

const updateStatus = async (id, status, extras = {}) => {
  const result = await query(
    `UPDATE order_returns SET
       status = $2,
       notes = COALESCE($3, notes),
       refund_amount = COALESCE($4, refund_amount),
       resolved_at = CASE WHEN $2 IN ('refunded', 'closed', 'rejected') THEN NOW() ELSE resolved_at END
     WHERE id = $1
     RETURNING *`,
    [id, status, extras.notes ?? null, extras.refundAmount ?? null]
  );
  return toReturn(result.rows[0]);
};

module.exports = {
  create,
  listByUser,
  findByOrderForUser,
  updateStatus,
};
