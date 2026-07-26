-- =============================================================================
-- Dynamic admin modules — replace localStorage/static seeds
-- =============================================================================

CREATE TABLE IF NOT EXISTS catalog_categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  slug          VARCHAR(220) NOT NULL UNIQUE,
  description   TEXT,
  image_url     TEXT,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        VARCHAR(30) NOT NULL DEFAULT 'published',
  meta          JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_products (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(255) NOT NULL,
  slug                VARCHAR(280) NOT NULL UNIQUE,
  sku                 VARCHAR(120),
  description         TEXT,
  instruction         TEXT,
  category            VARCHAR(150),
  categories          JSONB NOT NULL DEFAULT '[]'::jsonb,
  brand               VARCHAR(150),
  price               NUMERIC(12, 2) NOT NULL DEFAULT 0,
  compare_at_price    NUMERIC(12, 2),
  stock               INTEGER NOT NULL DEFAULT 0,
  low_stock_at        INTEGER NOT NULL DEFAULT 5,
  image_url           TEXT,
  gallery             JSONB NOT NULL DEFAULT '[]'::jsonb,
  status              VARCHAR(30) NOT NULL DEFAULT 'draft',
  featured            BOOLEAN NOT NULL DEFAULT FALSE,
  trending            BOOLEAN NOT NULL DEFAULT FALSE,
  rating              NUMERIC(3, 1),
  review_count        INTEGER NOT NULL DEFAULT 0,
  meta                JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_catalog_products_status ON catalog_products(status);
CREATE INDEX IF NOT EXISTS idx_catalog_products_category ON catalog_products(category);

CREATE TABLE IF NOT EXISTS erp_coupons (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          VARCHAR(80) NOT NULL UNIQUE,
  type          VARCHAR(30) NOT NULL DEFAULT 'percent',
  value         NUMERIC(12, 2) NOT NULL DEFAULT 0,
  min_order     NUMERIC(12, 2) NOT NULL DEFAULT 0,
  usage_limit   INTEGER NOT NULL DEFAULT 0,
  used          INTEGER NOT NULL DEFAULT 0,
  expires_at    DATE,
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_reviews (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    VARCHAR(80),
  product_name  VARCHAR(255),
  author        VARCHAR(150),
  rating        NUMERIC(3, 1) NOT NULL DEFAULT 5,
  title         VARCHAR(255),
  body          TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_banners (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  subtitle      TEXT,
  image_url     TEXT,
  link_url      TEXT,
  placement     VARCHAR(80) NOT NULL DEFAULT 'home',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  status        VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_media (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255) NOT NULL,
  type          VARCHAR(40) NOT NULL DEFAULT 'image',
  url           TEXT NOT NULL,
  size_kb       INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_cms_pages (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(280) NOT NULL UNIQUE,
  excerpt       TEXT,
  body          TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_notifications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  channel       VARCHAR(40) NOT NULL DEFAULT 'in_app',
  audience      VARCHAR(80) NOT NULL DEFAULT 'all',
  body          TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'draft',
  scheduled_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_corporate_enquiries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company       VARCHAR(255) NOT NULL,
  contact       VARCHAR(150),
  email         VARCHAR(255),
  phone         VARCHAR(40),
  moq           VARCHAR(40),
  who           VARCHAR(80),
  message       TEXT,
  source        VARCHAR(80) NOT NULL DEFAULT 'admin',
  status        VARCHAR(30) NOT NULL DEFAULT 'new',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_quotations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number  VARCHAR(80) NOT NULL UNIQUE,
  company       VARCHAR(255),
  contact       VARCHAR(150),
  email         VARCHAR(255),
  amount        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status        VARCHAR(30) NOT NULL DEFAULT 'draft',
  notes         TEXT,
  valid_until   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_personalized_orders (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref     VARCHAR(80),
  customer_name VARCHAR(150),
  email         VARCHAR(255),
  product_name  VARCHAR(255),
  customization TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'pending',
  total_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_roles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(150) NOT NULL,
  slug          VARCHAR(80) NOT NULL UNIQUE,
  description   TEXT,
  permissions   JSONB NOT NULL DEFAULT '[]'::jsonb,
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor         VARCHAR(150),
  action        VARCHAR(120) NOT NULL,
  entity        VARCHAR(120),
  entity_id     VARCHAR(80),
  details       TEXT,
  status        VARCHAR(30) NOT NULL DEFAULT 'info',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_settings (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key           VARCHAR(120) NOT NULL UNIQUE,
  value         JSONB NOT NULL DEFAULT '{}'::jsonb,
  label         VARCHAR(150),
  status        VARCHAR(30) NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS erp_blog_posts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  slug          VARCHAR(280) NOT NULL UNIQUE,
  excerpt       TEXT,
  body          TEXT,
  cover_url     TEXT,
  author        VARCHAR(150),
  status        VARCHAR(30) NOT NULL DEFAULT 'draft',
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'catalog_categories', 'catalog_products', 'erp_coupons', 'erp_reviews',
    'erp_banners', 'erp_media', 'erp_cms_pages', 'erp_notifications',
    'erp_corporate_enquiries', 'erp_quotations', 'erp_personalized_orders',
    'erp_roles', 'erp_audit_logs', 'erp_settings', 'erp_blog_posts'
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
