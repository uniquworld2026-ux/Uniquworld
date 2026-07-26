const { query } = require('../config/database');

const toNotification = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    body: row.body,
    type: row.type,
    data: row.data || {},
    readAt: row.read_at,
    createdAt: row.created_at,
  };
};

const listByUser = async (userId, { limit = 50, offset = 0 } = {}) => {
  const result = await query(
    `SELECT * FROM notifications
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows.map(toNotification);
};

const unreadCount = async (userId) => {
  const result = await query(
    `SELECT COUNT(*)::int AS count FROM notifications
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
  return result.rows[0]?.count || 0;
};

const create = async ({ userId, title, body, type = 'system', data = {} }) => {
  const result = await query(
    `INSERT INTO notifications (user_id, title, body, type, data)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, title, body || null, type, JSON.stringify(data)]
  );
  return toNotification(result.rows[0]);
};

const markRead = async (id, userId) => {
  const result = await query(
    `UPDATE notifications SET read_at = NOW()
     WHERE id = $1 AND user_id = $2 AND read_at IS NULL
     RETURNING *`,
    [id, userId]
  );
  return toNotification(result.rows[0]);
};

const markAllRead = async (userId) => {
  await query(
    `UPDATE notifications SET read_at = NOW()
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId]
  );
};

module.exports = {
  listByUser,
  unreadCount,
  create,
  markRead,
  markAllRead,
};
