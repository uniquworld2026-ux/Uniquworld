/**
 * @typedef {Object} UserRecord
 * @property {string} id
 * @property {string} role_id
 * @property {string} email
 * @property {string|null} password_hash
 * @property {string} first_name
 * @property {string|null} last_name
 * @property {string|null} phone
 * @property {string|null} avatar_url
 * @property {string|null} google_id
 * @property {string} status
 * @property {string|null} email_verified_at
 * @property {string|null} phone_verified_at
 * @property {string|null} last_login_at
 * @property {string} created_at
 * @property {string} updated_at
 * @property {string|null} deleted_at
 * @property {string} [role_name]
 * @property {string} [role_slug]
 */

/**
 * Map DB user row to public API shape (never expose password_hash).
 * @param {UserRecord} row
 */
const toPublicUser = (row) => {
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    avatarUrl: row.avatar_url,
    status: row.status,
    emailVerifiedAt: row.email_verified_at,
    phoneVerifiedAt: row.phone_verified_at,
    lastLoginAt: row.last_login_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    role: row.role_id
      ? {
          id: row.role_id,
          name: row.role_name || undefined,
          slug: row.role_slug || undefined,
        }
      : undefined,
    permissions: row.permissions || undefined,
  };
};

module.exports = {
  toPublicUser,
};
