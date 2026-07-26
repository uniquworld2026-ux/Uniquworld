const { query } = require('../config/database');

const create = async ({ userId, tokenHash, expiresAt, userAgent, ipAddress }) => {
  const result = await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, user_agent, ip_address)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, expires_at, created_at`,
    [userId, tokenHash, expiresAt, userAgent || null, ipAddress || null]
  );
  return result.rows[0];
};

const findValidByHash = async (tokenHash) => {
  const result = await query(
    `SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
     FROM refresh_tokens
     WHERE token_hash = $1
       AND revoked_at IS NULL
       AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  );
  return result.rows[0] || null;
};

const revokeByHash = async (tokenHash) => {
  const result = await query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE token_hash = $1 AND revoked_at IS NULL
     RETURNING id`,
    [tokenHash]
  );
  return result.rows[0] || null;
};

const revokeAllForUser = async (userId) => {
  await query(
    `UPDATE refresh_tokens
     SET revoked_at = NOW()
     WHERE user_id = $1 AND revoked_at IS NULL`,
    [userId]
  );
};

const revokeById = async (id) => {
  await query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE id = $1 AND revoked_at IS NULL`,
    [id]
  );
};

module.exports = {
  create,
  findValidByHash,
  revokeByHash,
  revokeAllForUser,
  revokeById,
};
