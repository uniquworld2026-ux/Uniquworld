-- =============================================================================
-- Uniquworld — RBAC Seed (Roles & Permissions)
-- =============================================================================

INSERT INTO roles (id, name, slug, description, is_system)
VALUES
  ('11111111-1111-1111-1111-111111111001', 'Super Admin', 'super_admin', 'Full system access', TRUE),
  ('11111111-1111-1111-1111-111111111002', 'Admin', 'admin', 'Store administration', TRUE),
  ('11111111-1111-1111-1111-111111111003', 'Customer', 'customer', 'Default storefront user', TRUE),
  ('11111111-1111-1111-1111-111111111004', 'Corporate', 'corporate', 'B2B corporate buyer', TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO permissions (name, slug, module, description) VALUES
  ('View Users', 'users.read', 'users', 'List and view users'),
  ('Manage Users', 'users.manage', 'users', 'Create, update, ban users'),
  ('View Roles', 'roles.read', 'roles', 'View roles and permissions'),
  ('Manage Roles', 'roles.manage', 'roles', 'Assign roles and permissions'),
  ('View Products', 'products.read', 'products', 'View products'),
  ('Manage Products', 'products.manage', 'products', 'CRUD products'),
  ('View Inventory', 'inventory.read', 'inventory', 'View stock levels'),
  ('Manage Inventory', 'inventory.manage', 'inventory', 'Update stock'),
  ('View Orders', 'orders.read', 'orders', 'View orders'),
  ('Manage Orders', 'orders.manage', 'orders', 'Update order status'),
  ('View Payments', 'payments.read', 'payments', 'View payments'),
  ('Manage Payments', 'payments.manage', 'payments', 'Refunds and adjustments'),
  ('View Reviews', 'reviews.read', 'reviews', 'View reviews'),
  ('Manage Reviews', 'reviews.manage', 'reviews', 'Approve/reject reviews'),
  ('View Coupons', 'coupons.read', 'coupons', 'View coupons'),
  ('Manage Coupons', 'coupons.manage', 'coupons', 'CRUD coupons'),
  ('View CMS', 'cms.read', 'cms', 'View CMS content'),
  ('Manage CMS', 'cms.manage', 'cms', 'CRUD blogs, pages, FAQ, banners'),
  ('View Corporate', 'corporate.read', 'corporate', 'View enquiries'),
  ('Manage Corporate', 'corporate.manage', 'corporate', 'Handle enquiries & quotations'),
  ('View Analytics', 'analytics.read', 'analytics', 'Dashboard and reports'),
  ('Manage Settings', 'settings.manage', 'settings', 'Update system settings'),
  ('View Audit Logs', 'audit.read', 'audit', 'View audit trail')
ON CONFLICT (slug) DO NOTHING;

-- Super Admin: all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'super_admin'
ON CONFLICT DO NOTHING;

-- Admin: most permissions except roles.manage
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'admin'
  AND p.slug NOT IN ('roles.manage')
ON CONFLICT DO NOTHING;

-- Customer: storefront-facing (no admin perms seeded; enforced via public routes)
-- Corporate: corporate + products.read
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.slug IN ('products.read', 'corporate.read', 'orders.read')
WHERE r.slug = 'corporate'
ON CONFLICT DO NOTHING;

-- Default settings
INSERT INTO settings (key, value, group_name, description) VALUES
  ('store.name', '"Uniquworld"', 'general', 'Store display name'),
  ('store.currency', '"INR"', 'general', 'Default currency'),
  ('store.tax_rate', '0.18', 'general', 'Default tax rate'),
  ('auth.require_email_verification', 'true', 'auth', 'Require OTP email verification on register'),
  ('order.cod_enabled', 'true', 'orders', 'Cash on delivery enabled')
ON CONFLICT (key) DO NOTHING;
