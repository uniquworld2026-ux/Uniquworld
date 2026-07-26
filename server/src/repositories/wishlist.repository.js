const { query } = require('../config/database');

const toItem = (row) => ({
  id: row.id,
  userId: row.user_id,
  productId: row.product_id,
  catalogKey: row.catalog_key,
  product: row.product_snapshot || {},
  createdAt: row.created_at,
});

const listByUser = async (userId) => {
  const result = await query(
    `SELECT * FROM wishlist WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows.map(toItem);
};

const countByUser = async (userId) => {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM wishlist WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0]?.count || 0;
};

const findByKey = async (userId, catalogKey) => {
  const result = await query(
    `SELECT * FROM wishlist WHERE user_id = $1 AND catalog_key = $2 LIMIT 1`,
    [userId, catalogKey]
  );
  return result.rows[0] ? toItem(result.rows[0]) : null;
};

const add = async (userId, { catalogKey, productId = null, productSnapshot = {} }) => {
  const existing = await findByKey(userId, catalogKey);
  if (existing) return existing;

  const result = await query(
    `INSERT INTO wishlist (user_id, product_id, catalog_key, product_snapshot)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, productId, catalogKey, JSON.stringify(productSnapshot)]
  );
  return toItem(result.rows[0]);
};

const removeByKey = async (userId, catalogKey) => {
  const result = await query(
    `DELETE FROM wishlist WHERE user_id = $1 AND catalog_key = $2 RETURNING id`,
    [userId, catalogKey]
  );
  return Boolean(result.rows[0]);
};

const removeById = async (userId, id) => {
  const result = await query(
    `DELETE FROM wishlist WHERE user_id = $1 AND id = $2 RETURNING id`,
    [userId, id]
  );
  return Boolean(result.rows[0]);
};

module.exports = {
  listByUser,
  countByUser,
  add,
  removeByKey,
  removeById,
  findByKey,
};
