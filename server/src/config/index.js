const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const required = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

const missing = required.filter((key) => !process.env[key]);
if (missing.length && process.env.NODE_ENV === 'production') {
  throw new Error(`Missing required env vars: ${missing.join(', ')}`);
}

// Fail fast in all envs when DB URL is missing — otherwise `pg` throws a cryptic
// "SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string".
if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is missing. Copy server/.env.example to server/.env and set your Supabase pooler connection string.'
  );
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  appName: process.env.APP_NAME || 'Uniquworld',
  appUrl: process.env.APP_URL || 'http://localhost:5000',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  // Absolute URL required for email clients (Gmail blocks local/relative images)
  emailLogoUrl:
    process.env.EMAIL_LOGO_URL ||
    `${(process.env.SUPABASE_URL || '').replace(/\/$/, '')}/storage/v1/object/public/${process.env.SUPABASE_STORAGE_BUCKET || 'uniquworld-assets'}/brand/Uniquworld.jpg`,

  db: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    max: Number(process.env.DB_POOL_MAX) || 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    // Prefer new Supabase API keys; fall back to classic anon / service_role
    publishableKey:
      process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY,
    secretKey:
      process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwksUrl:
      process.env.SUPABASE_JWKS_URL ||
      (process.env.SUPABASE_URL
        ? `${process.env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`
        : null),
    bucket: process.env.SUPABASE_STORAGE_BUCKET || 'uniquworld-assets',
    // Aliases used by older call sites
    get anonKey() {
      return this.publishableKey;
    },
    get serviceRoleKey() {
      return this.secretKey;
    },
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me-32chars',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me-32chars',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  otp: {
    expiresInMinutes: Number(process.env.OTP_EXPIRES_IN_MINUTES) || 10,
    length: Number(process.env.OTP_LENGTH) || 6,
    maxAttempts: Number(process.env.OTP_MAX_ATTEMPTS) || 5,
  },

  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,

  /** JSON body limit — product forms may include images before upload processing */
  bodyParserLimit: process.env.BODY_PARSER_LIMIT || '15mb',

  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    authMax: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    // Gmail app passwords are often pasted with spaces — strip them
    pass: (process.env.SMTP_PASS || '').replace(/\s+/g, ''),
    fromName: process.env.SMTP_FROM_NAME || 'Uniquworld',
    fromEmail: process.env.SMTP_FROM_EMAIL || 'noreply@uniquworld.com',
  },

  // Prefer Resend when set — Gmail SMTP frequently lands in Spam without domain auth
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },

  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },

  shiprocket: {
    email: process.env.SHIPROCKET_EMAIL || '',
    password: process.env.SHIPROCKET_PASSWORD || '',
    baseUrl: process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external',
    channelId: process.env.SHIPROCKET_CHANNEL_ID || '',
    pickupLocation: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
    enabled: process.env.SHIPROCKET_ENABLED === 'true',
  },

  commerce: {
    currency: process.env.COMMERCE_CURRENCY || 'INR',
    defaultShippingAmount: Number(process.env.DEFAULT_SHIPPING_AMOUNT) || 49,
    freeShippingMin: Number(process.env.FREE_SHIPPING_MIN) || 999,
    codEnabled: process.env.COD_ENABLED !== 'false',
  },

  adminApiKey: process.env.ADMIN_API_KEY || 'uniquworld-admin-dev-key',

  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  logLevel: process.env.LOG_LEVEL || 'info',
};

module.exports = config;
