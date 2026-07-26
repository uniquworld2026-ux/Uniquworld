const { query } = require('../config/database');

const toAddress = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    fullName: row.full_name,
    phone: row.phone,
    line1: row.line1,
    line2: row.line2,
    city: row.city,
    state: row.state,
    postalCode: row.postal_code,
    country: row.country,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

const listByUser = async (userId) => {
  const result = await query(
    `SELECT * FROM addresses
     WHERE user_id = $1
     ORDER BY is_default DESC, updated_at DESC`,
    [userId]
  );
  return result.rows.map(toAddress);
};

const findByIdForUser = async (id, userId) => {
  const result = await query(
    `SELECT * FROM addresses WHERE id = $1 AND user_id = $2 LIMIT 1`,
    [id, userId]
  );
  return toAddress(result.rows[0]);
};

const clearDefault = async (userId) => {
  await query(`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, [userId]);
};

const create = async (userId, data) => {
  if (data.isDefault) await clearDefault(userId);

  const result = await query(
    `INSERT INTO addresses (
       user_id, type, full_name, phone, line1, line2, city, state, postal_code, country, is_default
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      userId,
      data.type || 'shipping',
      data.fullName,
      data.phone,
      data.line1,
      data.line2 || null,
      data.city,
      data.state,
      data.postalCode,
      data.country || 'India',
      Boolean(data.isDefault),
    ]
  );
  return toAddress(result.rows[0]);
};

const update = async (id, userId, data) => {
  const existing = await findByIdForUser(id, userId);
  if (!existing) return null;

  if (data.isDefault) await clearDefault(userId);

  const result = await query(
    `UPDATE addresses SET
       type = COALESCE($3, type),
       full_name = COALESCE($4, full_name),
       phone = COALESCE($5, phone),
       line1 = COALESCE($6, line1),
       line2 = COALESCE($7, line2),
       city = COALESCE($8, city),
       state = COALESCE($9, state),
       postal_code = COALESCE($10, postal_code),
       country = COALESCE($11, country),
       is_default = COALESCE($12, is_default)
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [
      id,
      userId,
      data.type ?? null,
      data.fullName ?? null,
      data.phone ?? null,
      data.line1 ?? null,
      data.line2 === undefined ? null : data.line2,
      data.city ?? null,
      data.state ?? null,
      data.postalCode ?? null,
      data.country ?? null,
      data.isDefault === undefined ? null : Boolean(data.isDefault),
    ]
  );
  return toAddress(result.rows[0]);
};

const remove = async (id, userId) => {
  const result = await query(
    `DELETE FROM addresses WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  return Boolean(result.rows[0]);
};

module.exports = {
  toAddress,
  listByUser,
  findByIdForUser,
  create,
  update,
  remove,
};
