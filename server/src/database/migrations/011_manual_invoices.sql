-- Manual / generator invoices stored as their own pages for Invoice Management.

CREATE TABLE IF NOT EXISTS manual_invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number  VARCHAR(100) NOT NULL UNIQUE,
  gst_mode        VARCHAR(20) NOT NULL DEFAULT 'with'
                    CHECK (gst_mode IN ('with', 'without')),
  customer_name   VARCHAR(200) NOT NULL DEFAULT '',
  customer_email  VARCHAR(200),
  total_amount    NUMERIC(12, 2) NOT NULL DEFAULT 0,
  payload         JSONB NOT NULL DEFAULT '{}'::jsonb,
  html            TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_manual_invoices_updated
  ON manual_invoices(updated_at DESC);
