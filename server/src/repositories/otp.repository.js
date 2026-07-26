const { query } = require('../config/database');

const invalidateActive = async (email, purpose) => {
  await query(
    `UPDATE otps
     SET verified_at = NOW()
     WHERE LOWER(email) = LOWER($1)
       AND purpose = $2
       AND verified_at IS NULL
       AND expires_at > NOW()`,
    [email, purpose]
  );
};

const create = async ({ userId, email, codeHash, purpose, expiresAt, maxAttempts }) => {
  await invalidateActive(email, purpose);

  const result = await query(
    `INSERT INTO otps (user_id, email, code_hash, purpose, expires_at, max_attempts)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, purpose, expires_at, attempts, max_attempts, created_at`,
    [userId || null, email.toLowerCase(), codeHash, purpose, expiresAt, maxAttempts]
  );
  return result.rows[0];
};

const findLatestActive = async (email, purpose) => {
  const result = await query(
    `SELECT id, user_id, email, code_hash, purpose, attempts, max_attempts,
            expires_at, verified_at, created_at
     FROM otps
     WHERE LOWER(email) = LOWER($1)
       AND purpose = $2
       AND verified_at IS NULL
       AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 1`,
    [email, purpose]
  );
  return result.rows[0] || null;
};

const incrementAttempts = async (id) => {
  const result = await query(
    `UPDATE otps SET attempts = attempts + 1
     WHERE id = $1
     RETURNING id, attempts, max_attempts`,
    [id]
  );
  return result.rows[0];
};

const markVerified = async (id) => {
  const result = await query(
    `UPDATE otps SET verified_at = NOW()
     WHERE id = $1
     RETURNING id, user_id, email, purpose, verified_at`,
    [id]
  );
  return result.rows[0];
};

module.exports = {
  create,
  findLatestActive,
  incrementAttempts,
  markVerified,
  invalidateActive,
};
