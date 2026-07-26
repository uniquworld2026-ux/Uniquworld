-- =============================================================================
-- Uniquworld ERP — Purchase, Vendor, Inventory, Stores, Admin staff
-- =============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  code          VARCHAR(50) UNIQUE,
  contact_name  VARCHAR(150),
  email         VARCHAR(255),
  phone         VARCHAR(30),
  city          VARCHAR(100),
  state         VARCHAR(100),
  gstin         VARCHAR(30),
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS purchase_orders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number       VARCHAR(40) NOT NULL UNIQUE,
  supplier_id     UUID REFERENCES suppliers(id) ON DELETE SET NULL,
  supplier_name   VARCHAR(200),
  status          VARCHAR(30) NOT NULL DEFAULT 'draft',
  total_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  expected_date   DATE,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  code          VARCHAR(50) UNIQUE,
  service_type  VARCHAR(100),
  contact_name  VARCHAR(150),
  email         VARCHAR(255),
  phone         VARCHAR(30),
  city          VARCHAR(100),
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  rating        NUMERIC(3, 1) DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vendor_services (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id     UUID REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_name   VARCHAR(200),
  name          VARCHAR(200) NOT NULL,
  category      VARCHAR(100),
  unit_price    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  description   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS inventory_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku             VARCHAR(120) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  warehouse       VARCHAR(100) NOT NULL DEFAULT 'Main',
  quantity        INTEGER NOT NULL DEFAULT 0,
  reserved        INTEGER NOT NULL DEFAULT 0,
  reorder_level   INTEGER NOT NULL DEFAULT 10,
  unit_cost       NUMERIC(12, 2) DEFAULT 0,
  status          VARCHAR(30) NOT NULL DEFAULT 'in_stock',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fulfillment_tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_number     VARCHAR(40) NOT NULL UNIQUE,
  order_ref       VARCHAR(80),
  warehouse       VARCHAR(100) NOT NULL DEFAULT 'Main',
  assignee        VARCHAR(150),
  status          VARCHAR(30) NOT NULL DEFAULT 'pending',
  priority        VARCHAR(20) NOT NULL DEFAULT 'normal',
  notes           TEXT,
  due_at          TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stores (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  code          VARCHAR(50) UNIQUE,
  type          VARCHAR(50) NOT NULL DEFAULT 'retail',
  city          VARCHAR(100),
  state         VARCHAR(100),
  address       TEXT,
  manager_name  VARCHAR(150),
  phone         VARCHAR(30),
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Separate product catalog for /store channel (distinct from main catalog)
CREATE TABLE IF NOT EXISTS store_products (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID REFERENCES stores(id) ON DELETE SET NULL,
  name            VARCHAR(255) NOT NULL,
  slug            VARCHAR(280) NOT NULL UNIQUE,
  sku             VARCHAR(120),
  description     TEXT,
  price           NUMERIC(12, 2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(12, 2),
  stock           INTEGER NOT NULL DEFAULT 0,
  image_url       TEXT,
  gallery         JSONB NOT NULL DEFAULT '[]'::jsonb,
  category        VARCHAR(120),
  tags            TEXT[],
  status          VARCHAR(30) NOT NULL DEFAULT 'draft',
  featured        BOOLEAN NOT NULL DEFAULT FALSE,
  meta            JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_store_products_status ON store_products(status);
CREATE INDEX IF NOT EXISTS idx_store_products_store ON store_products(store_id);

CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  name          VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  phone         VARCHAR(30),
  role_slug     VARCHAR(50) NOT NULL DEFAULT 'admin',
  department    VARCHAR(100),
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'suppliers', 'purchase_orders', 'vendors', 'vendor_services',
    'inventory_items', 'fulfillment_tasks', 'stores', 'store_products', 'admin_users'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE PROCEDURE set_updated_at()',
      t, t
    );
  END LOOP;
END $$;
