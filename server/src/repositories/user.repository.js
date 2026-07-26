const { query } = require('../config/database');

const USER_COLUMNS = `
  u.id, u.role_id, u.email, u.password_hash, u.first_name, u.last_name,
  u.phone, u.avatar_url, u.google_id, u.status, u.email_verified_at,
  u.phone_verified_at, u.last_login_at, u.created_at, u.updated_at, u.deleted_at,
  r.name AS role_name, r.slug AS role_slug
`;

const findByEmail = async (email) => {
  const result = await query(
    `SELECT ${USER_COLUMNS}
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE LOWER(u.email) = LOWER($1) AND u.deleted_at IS NULL
     LIMIT 1`,
    [email]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query(
    `SELECT ${USER_COLUMNS}
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.id = $1 AND u.deleted_at IS NULL
     LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

const findByIdWithRole = findById;

const findByGoogleId = async (googleId) => {
  const result = await query(
    `SELECT ${USER_COLUMNS}
     FROM users u
     JOIN roles r ON r.id = u.role_id
     WHERE u.google_id = $1 AND u.deleted_at IS NULL
     LIMIT 1`,
    [googleId]
  );
  return result.rows[0] || null;
};

const create = async ({
  email,
  passwordHash,
  firstName,
  lastName,
  phone,
  roleId,
  status,
  googleId = null,
  emailVerifiedAt = null,
  avatarUrl = null,
}) => {
  const result = await query(
    `INSERT INTO users (
       email, password_hash, first_name, last_name, phone, role_id,
       status, google_id, email_verified_at, avatar_url
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, role_id, email, first_name, last_name, phone, avatar_url,
               google_id, status, email_verified_at, created_at, updated_at`,
    [
      email.toLowerCase(),
      passwordHash,
      firstName,
      lastName || null,
      phone || null,
      roleId,
      status,
      googleId,
      emailVerifiedAt,
      avatarUrl,
    ]
  );
  return result.rows[0];
};

const updateById = async (id, fields) => {
  const map = {
    firstName: 'first_name',
    lastName: 'last_name',
    phone: 'phone',
    avatarUrl: 'avatar_url',
    passwordHash: 'password_hash',
    status: 'status',
    emailVerifiedAt: 'email_verified_at',
    phoneVerifiedAt: 'phone_verified_at',
    lastLoginAt: 'last_login_at',
    googleId: 'google_id',
  };

  const sets = [];
  const values = [];
  let i = 1;

  Object.entries(fields).forEach(([key, value]) => {
    const column = map[key];
    if (!column || value === undefined) return;
    sets.push(`${column} = $${i}`);
    values.push(value);
    i += 1;
  });

  if (!sets.length) {
    return findById(id);
  }

  values.push(id);
  const result = await query(
    `UPDATE users SET ${sets.join(', ')}
     WHERE id = $${i} AND deleted_at IS NULL
     RETURNING id, role_id, email, first_name, last_name, phone, avatar_url,
               google_id, status, email_verified_at, phone_verified_at,
               last_login_at, created_at, updated_at`,
    values
  );
  return result.rows[0] || null;
};

const markEmailVerified = async (id) =>
  updateById(id, {
    emailVerifiedAt: new Date().toISOString(),
    status: 'active',
  });

const updatePassword = async (id, passwordHash) =>
  updateById(id, { passwordHash });

const touchLastLogin = async (id) =>
  updateById(id, { lastLoginAt: new Date().toISOString() });

module.exports = {
  findByEmail,
  findById,
  findByIdWithRole,
  findByGoogleId,
  create,
  updateById,
  markEmailVerified,
  updatePassword,
  touchLastLogin,
};
