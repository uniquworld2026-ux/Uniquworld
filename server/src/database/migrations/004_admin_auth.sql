-- Admin ERP auth: profile image + password for panel login
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE INDEX IF NOT EXISTS idx_admin_users_email_lower
  ON admin_users (LOWER(email));
