const crypto = require('crypto');
const logger = require('./logger');
const { optimizeImage } = require('./image');
const { uploadFile } = require('../config/supabase');

const DATA_URL_RE = /^data:(image\/[\w+.-]+);base64,(.+)$/;

/**
 * Upload a data-URL image to Supabase Storage; pass through http(s) URLs unchanged.
 * @param {string} value
 * @param {string} [slug]
 */
async function persistCatalogImage(value, slug = 'product') {
  if (!value || typeof value !== 'string') return value || '';
  if (!value.startsWith('data:image')) return value;

  const match = value.match(DATA_URL_RE);
  if (!match) return value;

  try {
    const buffer = Buffer.from(match[2], 'base64');
    const optimized = await optimizeImage(buffer, {
      width: 1600,
      format: 'webp',
      quality: 82,
    });
    const safeSlug = String(slug || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .slice(0, 40);
    const fileName = `${safeSlug}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}.${optimized.extension}`;
    const storagePath = `catalog/products/${fileName}`;
    const { publicUrl } = await uploadFile(storagePath, optimized.buffer, optimized.contentType);
    return publicUrl;
  } catch (err) {
    logger.error('Catalog image upload failed', { message: err.message });
    throw err;
  }
}

/** Strip empty meta values so JSONB stays valid & small. */
function sanitizeProductMeta(meta = {}) {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return {};
  const out = {};
  Object.entries(meta).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) return;
    out[key] = value;
  });
  return out;
}

/**
 * Replace inline data-URL images with Supabase public URLs before DB insert/update.
 * @param {Record<string, unknown>} payload
 */
async function prepareProductImages(payload = {}) {
  const next = { ...payload };
  const slug = String(next.slug || next.sku || 'product');

  if (next.imageUrl) {
    next.imageUrl = await persistCatalogImage(next.imageUrl, slug);
  }

  if (Array.isArray(next.gallery)) {
    next.gallery = await Promise.all(
      next.gallery.map((url, index) => persistCatalogImage(url, `${slug}-g${index + 1}`)),
    );
  }

  if (next.meta) {
    next.meta = sanitizeProductMeta(next.meta);
  }

  return next;
}

module.exports = {
  persistCatalogImage,
  sanitizeProductMeta,
  prepareProductImages,
};
