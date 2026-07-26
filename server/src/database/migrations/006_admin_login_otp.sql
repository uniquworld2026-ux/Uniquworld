-- Allow dedicated admin portal login OTP purpose
DO $$ BEGIN
  ALTER TYPE otp_purpose ADD VALUE 'admin_login';
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN others THEN NULL;
END $$;
