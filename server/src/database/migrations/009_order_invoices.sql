-- =============================================================================
-- Uniquworld — Persisted order invoices (With GST / Without GST)
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  gst_mode        VARCHAR(20) NOT NULL DEFAULT 'with'
                    CHECK (gst_mode IN ('with', 'without')),
  invoice_number  VARCHAR(100) NOT NULL,
  html            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, gst_mode)
);

CREATE INDEX IF NOT EXISTS idx_order_invoices_order
  ON order_invoices(order_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_order_invoices_number
  ON order_invoices(invoice_number);
