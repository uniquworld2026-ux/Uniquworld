export const STORE_PRODUCT_STATUSES = ['draft', 'published', 'archived']

export const STORE_PRODUCT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function generateStoreSku(name = '') {
  const base = String(name || 'STORE')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 6) || 'STORE'
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `STP-${base}-${rand}`
}

export function normalizeGallery(values = {}) {
  const rawGallery = values.gallery
  const fromGallery = Array.isArray(rawGallery)
    ? rawGallery
    : typeof rawGallery === 'string' && rawGallery
      ? [rawGallery]
      : []
  const fromImages = Array.isArray(values.galleryImages) ? values.galleryImages : []
  const merged = [...fromImages, ...fromGallery].map((v) => String(v || '').trim()).filter(Boolean)
  while (merged.length < 3) merged.push('')
  return merged.slice(0, 3)
}

export function compactGallery(values = {}) {
  return normalizeGallery(values).filter(Boolean)
}

export const storeProductDefaults = {
  name: '',
  slug: '',
  sku: '',
  storeId: '',
  category: 'Wholesale',
  description: '',
  price: '',
  compareAtPrice: '',
  stock: 0,
  imageUrl: '',
  galleryImages: ['', '', ''],
  tags: '',
  status: 'draft',
  featured: false,
}

/**
 * Map API row → form values
 */
export function toFormValues(item) {
  if (!item) return { ...storeProductDefaults }
  return {
    ...storeProductDefaults,
    ...item,
    storeId: item.storeId || '',
    price: item.price ?? '',
    compareAtPrice: item.compareAtPrice ?? '',
    stock: item.stock ?? 0,
    tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
    galleryImages: normalizeGallery(item),
    featured: Boolean(item.featured),
  }
}

/**
 * Map form values → API payload
 */
export function toApiPayload(values) {
  const gallery = compactGallery(values)
  return {
    name: String(values.name || '').trim(),
    slug: values.slug || slugify(values.name),
    sku: values.sku || generateStoreSku(values.name),
    storeId: values.storeId || null,
    category: String(values.category || '').trim() || 'Wholesale',
    description: String(values.description || '').trim(),
    price: Number(values.price) || 0,
    compareAtPrice:
      values.compareAtPrice === '' || values.compareAtPrice == null
        ? null
        : Number(values.compareAtPrice),
    stock: Number(values.stock) || 0,
    imageUrl: values.imageUrl || gallery[0] || '',
    gallery,
    tags: String(values.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    status: values.status || 'draft',
    featured: Boolean(values.featured),
  }
}
