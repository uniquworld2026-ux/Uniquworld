-- =============================================================================
-- Uniquworld — Shipments, returns, order timeline, wishlist flexibility
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE shipment_status AS ENUM (
    'pending', 'created', 'picked_up', 'in_transit', 'out_for_delivery',
    'delivered', 'cancelled', 'rto', 'failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE return_status AS ENUM (
    'requested', 'approved', 'rejected', 'pickup_scheduled',
    'picked_up', 'refunded', 'closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Timeline for Amazon-style order tracking
CREATE TABLE IF NOT EXISTS order_status_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      order_status NOT NULL,
  note        TEXT,
  created_by  UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_events_order
  ON order_status_events(order_id, created_at DESC);

-- Shiprocket / carrier shipments
CREATE TABLE IF NOT EXISTS shipments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  carrier             VARCHAR(50) NOT NULL DEFAULT 'shiprocket',
  shipment_status     shipment_status NOT NULL DEFAULT 'pending',
  awb_code            VARCHAR(100),
  courier_name        VARCHAR(150),
  tracking_url        TEXT,
  shiprocket_order_id VARCHAR(100),
  shiprocket_shipment_id VARCHAR(100),
  label_url           TEXT,
  estimated_delivery  DATE,
  metadata            JSONB NOT NULL DEFAULT '{}'::jsonb,
  shipped_at          TIMESTAMPTZ,
  delivered_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_awb ON shipments(awb_code);

-- Returns / RMA
CREATE TABLE IF NOT EXISTS order_returns (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status          return_status NOT NULL DEFAULT 'requested',
  reason          TEXT NOT NULL,
  notes           TEXT,
  refund_amount   NUMERIC(12, 2),
  shiprocket_return_id VARCHAR(100),
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_returns_order ON order_returns(order_id);
CREATE INDEX IF NOT EXISTS idx_order_returns_user ON order_returns(user_id);

-- Wishlist: support catalog items not yet synced to products table
ALTER TABLE wishlist ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS catalog_key VARCHAR(160);
ALTER TABLE wishlist ADD COLUMN IF NOT EXISTS product_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;

ALTER TABLE wishlist DROP CONSTRAINT IF EXISTS wishlist_user_id_product_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_product_uq
  ON wishlist (user_id, product_id) WHERE product_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS wishlist_user_catalog_uq
  ON wishlist (user_id, catalog_key) WHERE catalog_key IS NOT NULL;

-- Order item image snapshot for account UI
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS meta JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Payment gateway order id (Razorpay order)
ALTER TABLE payments ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(255);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order ON payments(gateway_order_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_shipments_updated_at'
  ) THEN
    CREATE TRIGGER trg_shipments_updated_at
      BEFORE UPDATE ON shipments
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_order_returns_updated_at'
  ) THEN
    CREATE TRIGGER trg_order_returns_updated_at
      BEFORE UPDATE ON order_returns
      FOR EACH ROW EXECUTE PROCEDURE set_updated_at();
  END IF;
END $$;
