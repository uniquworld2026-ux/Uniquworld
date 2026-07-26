const { createClient } = require('@supabase/supabase-js');
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

/**
 * Public / publishable client (browser-safe key).
 * Use for Storage public reads and Auth helpers.
 */
const getSupabaseClient = () => {
  if (supabasePublic) return supabasePublic;
  if (!assertConfigured() || !config.supabase.publishableKey) {
    logger.warn('Supabase publishable key missing — public client disabled');
    return null;
  }

  supabasePublic = createClient(config.supabase.url, config.supabase.publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return supabasePublic;
};

/**
 * Secret / service client (server-only).
 * Use for Storage uploads, admin Auth, and privileged operations.
 */
const getSupabaseAdmin = () => {
  if (supabaseAdmin) return supabaseAdmin;
  if (!assertConfigured() || !config.supabase.secretKey) {
    logger.warn('Supabase secret key missing — admin/storage client disabled');
    return null;
  }

  supabaseAdmin = createClient(config.supabase.url, config.supabase.secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

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
