-- Digital Surprise: paid shareable pages (₹49), 30-day expiry
CREATE TABLE IF NOT EXISTS digital_surprises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(32) NOT NULL UNIQUE,
  occasion VARCHAR(40) NOT NULL,
  template_id VARCHAR(40) NOT NULL,
  recipient_name VARCHAR(120) NOT NULL,
  sender_name VARCHAR(120),
  message TEXT,
  media JSONB NOT NULL DEFAULT '{}'::jsonb,
  buyer_email VARCHAR(255) NOT NULL,
  buyer_phone VARCHAR(30),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  amount_paise INTEGER NOT NULL DEFAULT 4900,
  currency VARCHAR(8) NOT NULL DEFAULT 'INR',
  status VARCHAR(32) NOT NULL DEFAULT 'pending_payment',
  razorpay_order_id VARCHAR(80),
  razorpay_payment_id VARCHAR(80),
  preview_count INTEGER NOT NULL DEFAULT 0,
  share_path VARCHAR(120),
  expires_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT digital_surprises_occasion_check
    CHECK (occasion IN ('girlfriends_day', 'birthday', 'diwali')),
  CONSTRAINT digital_surprises_status_check
    CHECK (status IN ('pending_payment', 'active', 'expired', 'cancelled'))
);

CREATE INDEX IF NOT EXISTS idx_digital_surprises_slug ON digital_surprises (slug);
CREATE INDEX IF NOT EXISTS idx_digital_surprises_status ON digital_surprises (status);
CREATE INDEX IF NOT EXISTS idx_digital_surprises_buyer_email ON digital_surprises (LOWER(buyer_email));
CREATE INDEX IF NOT EXISTS idx_digital_surprises_expires_at ON digital_surprises (expires_at)
  WHERE status = 'active';
