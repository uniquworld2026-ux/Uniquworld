-- =============================================================================
-- Store partners marketplace — owners, fees, earnings, withdrawals
-- =============================================================================

-- Role: store_owner
INSERT INTO roles (id, name, slug, description, is_system)
VALUES (
  '11111111-1111-1111-1111-111111111005',
  'Store Owner',
  'store_owner',
  'Marketplace store partner — manage products, sales, and withdrawals',
  TRUE
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO permissions (name, slug, module, description) VALUES
  ('View Own Store', 'store.own.read', 'stores', 'View own store profile and sales'),
  ('Manage Own Store Products', 'store.own.products', 'stores', 'CRUD own store products'),
  ('Manage Own Store Inventory', 'store.own.inventory', 'stores', 'Update own store stock'),
  ('Request Store Withdrawal', 'store.own.withdraw', 'stores', 'Request payout to bank')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.slug = 'store_owner'
  AND p.slug IN (
    'store.own.read',
    'store.own.products',
    'store.own.inventory',
    'store.own.withdraw',
    'orders.read',
    'products.read'
  )
ON CONFLICT DO NOTHING;

-- Extend stores for partner onboarding + bank payouts
ALTER TABLE stores
  ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS gstin VARCHAR(30),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(150),
  ADD COLUMN IF NOT EXISTS bank_account_number VARCHAR(40),
  ADD COLUMN IF NOT EXISTS bank_ifsc VARCHAR(20),
  ADD COLUMN IF NOT EXISTS bank_name VARCHAR(120),
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_stores_email ON stores(email);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

-- Platform fee on orders (10% of store product subtotal; shop owner still receives product amount)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS platform_fee_amount NUMERIC(12, 2) NOT NULL DEFAULT 0;

-- Link order lines to store / store product for earnings split
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS store_product_id UUID REFERENCES store_products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS platform_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS store_earning NUMERIC(12, 2) NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_order_items_store ON order_items(store_id);

-- Earnings ledger (credited when order is delivered)
CREATE TABLE IF NOT EXISTS store_earnings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id          UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id     UUID REFERENCES order_items(id) ON DELETE SET NULL,
  order_number      VARCHAR(40),
  product_name      VARCHAR(255),
  gross_amount      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  platform_fee      NUMERIC(12, 2) NOT NULL DEFAULT 0,
  net_amount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status            VARCHAR(30) NOT NULL DEFAULT 'available',
  earned_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_item_id)
);

CREATE INDEX IF NOT EXISTS idx_store_earnings_store ON store_earnings(store_id);
CREATE INDEX IF NOT EXISTS idx_store_earnings_earned ON store_earnings(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_earnings_status ON store_earnings(status);

-- Withdrawal requests to store owner bank account
CREATE TABLE IF NOT EXISTS store_withdrawals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id          UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  amount            NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  status            VARCHAR(30) NOT NULL DEFAULT 'pending',
  bank_account_name VARCHAR(150),
  bank_account_number VARCHAR(40),
  bank_ifsc         VARCHAR(20),
  bank_name         VARCHAR(120),
  note              TEXT,
  admin_note        TEXT,
  requested_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  processed_by      UUID REFERENCES users(id) ON DELETE SET NULL,
  processed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_withdrawals_store ON store_withdrawals(store_id);
CREATE INDEX IF NOT EXISTS idx_store_withdrawals_status ON store_withdrawals(status);

DROP TRIGGER IF EXISTS trg_store_withdrawals_updated_at ON store_withdrawals;
CREATE TRIGGER trg_store_withdrawals_updated_at
  BEFORE UPDATE ON store_withdrawals
  FOR EACH ROW EXECUTE PROCEDURE set_updated_at();

INSERT INTO settings (key, value, group_name, description) VALUES
  ('store.platform_fee_percent', '0.10', 'stores', 'Platform fee % on store product subtotal (charged to customer; owner receives full product amount)'),
  ('store.auto_activate_on_verify', 'true', 'stores', 'Activate store after owner email verification')
ON CONFLICT (key) DO NOTHING;
