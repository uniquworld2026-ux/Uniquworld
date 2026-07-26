const { createClient } = require('@supabase/supabase-js');
const { createAdminClient, createContextClient } = require('@supabase/server/core');
const config = require('./index');
const logger = require('../utils/logger');

let supabasePublic = null;
let supabaseAdmin = null;

const assertConfigured = () => {
  if (!config.supabase.url) {
    logger.warn('SUPABASE_URL is missing');
    return false;
  }
  return true;
};

const envOverride = () => ({
  url: config.supabase.url,
  publishableKeys: config.supabase.publishableKey
    ? { default: config.supabase.publishableKey }
    : {},
  secretKeys: config.supabase.secretKey
    ? { default: config.supabase.secretKey }
    : {},
  jwksUrl: config.supabase.jwksUrl || undefined,
});

/**
 * Public / publishable client (browser-safe key).
 * Built via @supabase/server so env keys match the new API key format.
 */
const getSupabaseClient = () => {
  if (supabasePublic) return supabasePublic;
  if (!assertConfigured() || !config.supabase.publishableKey) {
    logger.warn('Supabase publishable key missing — public client disabled');
    return null;
  }

  try {
    supabasePublic = createContextClient({ env: envOverride() });
  } catch (err) {
    logger.warn('createContextClient failed, falling back to supabase-js', {
      message: err.message,
    });
    supabasePublic = createClient(config.supabase.url, config.supabase.publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabasePublic;
};

/**
 * Secret / service client (server-only).
 * Uses @supabase/server createAdminClient (bypasses RLS).
 */
const getSupabaseAdmin = () => {
  if (supabaseAdmin) return supabaseAdmin;
  if (!assertConfigured() || !config.supabase.secretKey) {
    logger.warn('Supabase secret key missing — admin/storage client disabled');
    return null;
  }

  try {
    supabaseAdmin = createAdminClient({ env: envOverride() });
  } catch (err) {
    logger.warn('createAdminClient failed, falling back to supabase-js', {
      message: err.message,
    });
    supabaseAdmin = createClient(config.supabase.url, config.supabase.secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseAdmin;
};

/**
 * Upload a buffer to Supabase Storage (secret client).
 * @param {string} path
 * @param {Buffer} buffer
 * @param {string} contentType
 */
const uploadFile = async (path, buffer, contentType) => {
  const client = getSupabaseAdmin();
  if (!client) {
    throw new Error('Supabase Storage is not configured');
  }

  const { data, error } = await client.storage
    .from(config.supabase.bucket)
    .upload(path, buffer, { contentType, upsert: true });

  if (error) throw error;

  const { data: publicData } = client.storage
    .from(config.supabase.bucket)
    .getPublicUrl(data.path);

  return {
    path: data.path,
    publicUrl: publicData.publicUrl,
  };
};

/**
 * Remove a file from Supabase Storage.
 * @param {string} path
 */
const removeFile = async (path) => {
  const client = getSupabaseAdmin();
  if (!client) return;

  const { error } = await client.storage.from(config.supabase.bucket).remove([path]);
  if (error) throw error;
};

module.exports = {
  getSupabaseClient,
  getSupabaseAdmin,
  uploadFile,
  removeFile,
};
