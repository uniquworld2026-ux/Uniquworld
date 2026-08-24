const crypto = require('crypto');
const { query } = require('../config/database');

const COLUMNS = `
  id, slug, occasion, template_id, recipient_name, sender_name, message, media,
  buyer_email, buyer_phone, user_id, amount_paise, currency, status,
  razorpay_order_id, razorpay_payment_id, preview_count, share_path,
  expires_at, paid_at, created_at, updated_at
`;

const create = async (row) => {
  const result = await query(
    `INSERT INTO digital_surprises (
       slug, occasion, template_id, recipient_name, sender_name, message, media,
       buyer_email, buyer_phone, user_id, amount_paise, currency, status, share_path
     ) VALUES (
       $1,$2,$3,$4,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,'pending_payment',$13
     )
     RETURNING ${COLUMNS}`,
    [
      row.slug,
      row.occasion,
      row.templateId,
      row.recipientName,
      row.senderName || null,
      row.message || null,
      JSON.stringify(row.media || {}),
      row.buyerEmail,
      row.buyerPhone || null,
      row.userId || null,
      row.amountPaise,
      row.currency || 'INR',
      row.sharePath,
    ]
  );
  return result.rows[0];
};

const findById = async (id) => {
  const result = await query(
    `SELECT ${COLUMNS} FROM digital_surprises WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

const findBySlug = async (slug) => {
  const result = await query(
    `SELECT ${COLUMNS} FROM digital_surprises WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return result.rows[0] || null;
};

const setRazorpayOrder = async (id, razorpayOrderId) => {
  const result = await query(
    `UPDATE digital_surprises
     SET razorpay_order_id = $2, updated_at = NOW()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, razorpayOrderId]
  );
  return result.rows[0] || null;
};

const activatePaid = async (id, { razorpayPaymentId, expiresAt }) => {
  const result = await query(
    `UPDATE digital_surprises
     SET status = 'active',
         razorpay_payment_id = $2,
         paid_at = NOW(),
         expires_at = $3,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id, razorpayPaymentId || null, expiresAt]
  );
  return result.rows[0] || null;
};

const reviveLifetime = async (id) => {
  const result = await query(
    `UPDATE digital_surprises
     SET status = 'active',
         expires_at = NULL,
         updated_at = NOW()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id]
  );
  return result.rows[0] || null;
};

const incrementPreview = async (id) => {
  const result = await query(
    `UPDATE digital_surprises
     SET preview_count = preview_count + 1, updated_at = NOW()
     WHERE id = $1
     RETURNING ${COLUMNS}`,
    [id]
  );
  return result.rows[0] || null;
};

const generateSlug = () => crypto.randomBytes(6).toString('hex');

module.exports = {
  create,
  findById,
  findBySlug,
  setRazorpayOrder,
  activatePaid,
  reviveLifetime,
  incrementPreview,
  generateSlug,
};
