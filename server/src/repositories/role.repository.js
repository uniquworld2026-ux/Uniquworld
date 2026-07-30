const { query } = require('../config/database');
const { ROLE_IDS, ROLES } = require('../types/enums');

const ROLE_DEFS = [
  {
    id: ROLE_IDS.SUPER_ADMIN,
    name: 'Super Admin',
    slug: ROLES.SUPER_ADMIN,
    description: 'Full system access',
  },
  {
    id: ROLE_IDS.ADMIN,
    name: 'Admin',
    slug: ROLES.ADMIN,
    description: 'Store administration',
  },
  {
    id: ROLE_IDS.CUSTOMER,
    name: 'Customer',
    slug: ROLES.CUSTOMER,
    description: 'Default storefront user',
  },
  {
    id: ROLE_IDS.CORPORATE,
    name: 'Corporate',
    slug: ROLES.CORPORATE,
    description: 'B2B corporate buyer',
  },
];

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

/** Ensure core roles exist (idempotent) — fixes empty DB after migrate without seed. */
const ensureDefaultRoles = async () => {
  for (const role of ROLE_DEFS) {
    await query(
      `INSERT INTO roles (id, name, slug, description, is_system)
       VALUES ($1, $2, $3, $4, TRUE)
       ON CONFLICT (slug) DO NOTHING`,
      [role.id, role.name, role.slug, role.description]
    );
  }
};

/**
 * Resolve a role UUID by slug, creating defaults if missing.
 * @param {string} slug
 */
const resolveRoleId = async (slug) => {
  let role = await findBySlug(slug);
  if (!role) {
    await ensureDefaultRoles();
    role = await findBySlug(slug);
  }
  if (!role) {
    throw new Error(`Role "${slug}" is not configured. Run npm run seed.`);
  }
  return role.id;
};

module.exports = {
  findBySlug,
  findById,
  getPermissionSlugsByRoleId,
  ensureDefaultRoles,
  resolveRoleId,
};
