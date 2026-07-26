const { createRemoteJWKSet, jwtVerify } = require('jose');
const config = require('../config');
const ApiError = require('./ApiError');
const logger = require('./logger');

let jwks = null;

const getJwks = () => {
  if (jwks) return jwks;

  if (!config.supabase.jwksUrl) {
    throw ApiError.internal('SUPABASE_JWKS_URL is not configured');
  }

  jwks = createRemoteJWKSet(new URL(config.supabase.jwksUrl));
  return jwks;
};

/**
 * Verify a Supabase Auth JWT against the project JWKS.
 * @param {string} token
 * @returns {Promise<import('jose').JWTPayload>}
 */
const verifySupabaseJwt = async (token) => {
  if (!token) {
    throw ApiError.unauthorized('Supabase token required');
  }

  try {
    const { payload } = await jwtVerify(token, getJwks(), {
      issuer: `${config.supabase.url.replace(/\/$/, '')}/auth/v1`,
      audience: 'authenticated',
    });
    return payload;
  } catch (error) {
    logger.warn('Supabase JWT verification failed', { message: error.message });
    throw ApiError.unauthorized('Invalid or expired Supabase token');
  }
};

/**
 * Quick connectivity check for JWKS endpoint.
 */
const pingJwks = async () => {
  if (!config.supabase.jwksUrl) {
    return { ok: false, reason: 'SUPABASE_JWKS_URL missing' };
  }

  const response = await fetch(config.supabase.jwksUrl);
  if (!response.ok) {
    return { ok: false, reason: `HTTP ${response.status}` };
  }

  const body = await response.json();
  return {
    ok: true,
    keys: Array.isArray(body.keys) ? body.keys.length : 0,
  };
};

module.exports = {
  verifySupabaseJwt,
  pingJwks,
};
