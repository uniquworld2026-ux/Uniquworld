const { query } = require('../config/database');

const findBySlug = async (slug) => {
  const result = await query(
    `SELECT id, name, slug, description, is_system, created_at, updated_at
     FROM roles WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await query(
    `SELECT id, name, slug, description, is_system, created_at, updated_at
     FROM roles WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
};

const getPermissionSlugsByRoleId = async (roleId) => {
  const result = await query(
    `SELECT p.slug
     FROM permissions p
     JOIN role_permissions rp ON rp.permission_id = p.id
     WHERE rp.role_id = $1
     ORDER BY p.slug`,
    [roleId]
  );
  return result.rows.map((row) => row.slug);
};

module.exports = {
  findBySlug,
  findById,
  getPermissionSlugsByRoleId,
};
