import { erpApi } from '@/admin/lib/erpApi'
import { compactGalleryImages, normalizeGalleryImages } from '@/admin/features/products/productSchema'

const META_KEYS = [
  'productCost',
  'serviceCost',
  'cost',
  'profitMarginCost',
  'profitMarginPercent',
  'offerPercent',
  'customizationEnabled',
  'customizedPrice',
  'customizedMarketAtPrice',
  'customizedOfferPercent',
  'customizedProductCost',
  'customizedProfitMarginCost',
  'customizedProfitMarginPercent',
  'deliveryDaysProduct',
  'deliveryDaysCustomized',
  'subcategory',
  'seoTitle',
  'seoDescription',
  'seoKeywords',
  'seoMetaTags',
  'weightGrams',
  'minOrderQty',
  'gstPercent',
]

function stripEmptyMeta(meta = {}) {
  const out = {}
  Object.entries(meta).forEach(([key, value]) => {
    if (value === '' || value === null || value === undefined) return
    out[key] = value
  })
  return out
}

function toErpPayload(values = {}) {
  const meta = stripEmptyMeta({
    ...(values.meta && typeof values.meta === 'object' ? values.meta : {}),
  })
  META_KEYS.forEach((key) => {
    if (values[key] !== undefined) meta[key] = values[key]
  })

  const categories = Array.isArray(values.categories)
    ? values.categories.filter(Boolean)
    : values.category
      ? [values.category]
      : []

  const gallery = compactGalleryImages({
    galleryImages: values.galleryImages ?? values.gallery,
  })

  return {
    name: String(values.name || '').trim(),
    slug: values.slug || '',
    sku: values.sku || '',
    description: values.description || '',
    instruction: values.instruction || '',
    category: categories[0] || values.category || '',
    categories,
    brand: values.brand || '',
    price: Number(values.price) || 0,
    compareAtPrice:
      values.compareAtPrice === '' || values.compareAtPrice == null
        ? null
        : Number(values.compareAtPrice),
    stock: Number(values.stock) || 0,
    lowStockAt: Number(values.lowStockAt) || 5,
    imageUrl: values.imageUrl || gallery[0] || '',
    gallery,
    status: values.status === 'active' ? 'published' : values.status || 'draft',
    featured: Boolean(values.featured),
    trending: Boolean(values.trending),
    meta,
  }
}

function fromErpItem(item) {
  if (!item) return null
  const meta = item.meta && typeof item.meta === 'object' ? item.meta : {}
  return {
    ...meta,
    ...item,
    galleryImages: normalizeGalleryImages({
      galleryImages: item.galleryImages,
      gallery: item.gallery,
    }),
    categories: Array.isArray(item.categories)
      ? item.categories
      : item.category
        ? [item.category]
        : [],
  }
}

export async function listProducts() {
  const items = await erpApi.list('products')
  return items.map(fromErpItem)
}

export async function getProductById(id) {
  const item = await erpApi.get('products', id)
  return fromErpItem(item)
}

export async function createProduct(values) {
  const item = await erpApi.create('products', toErpPayload(values))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return fromErpItem(item)
}

export async function updateProduct(id, values) {
  const item = await erpApi.update('products', id, toErpPayload(values))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return fromErpItem(item)
}

export async function deleteProduct(id) {
  await erpApi.remove('products', id)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return true
}

/** Delete many products sequentially; returns counts. */
export async function deleteProducts(ids = []) {
  const list = [...new Set((ids || []).filter(Boolean))]
  let deleted = 0
  const errors = []
  for (const id of list) {
    try {
      await erpApi.remove('products', id)
      deleted += 1
    } catch (err) {
      errors.push({ id, message: err?.message || 'Failed' })
    }
  }
  if (typeof window !== 'undefined' && deleted > 0) {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return { deleted, errors, total: list.length }
}

export const productImportHeaders = [
  { key: 'name', label: 'name' },
  { key: 'sku', label: 'sku' },
  { key: 'slug', label: 'slug' },
  { key: 'category', label: 'category' },
  { key: 'price', label: 'price' },
  { key: 'compareAtPrice', label: 'compareAtPrice' },
  { key: 'stock', label: 'stock' },
  { key: 'status', label: 'status' },
  { key: 'description', label: 'description' },
]

export const productImportSampleRows = [
  {
    name: 'Sample Gift Box',
    sku: 'UW-SAMPLE-001',
    slug: 'sample-gift-box',
    category: 'Gifts',
    price: 999,
    compareAtPrice: 1299,
    stock: 25,
    status: 'draft',
    description: 'Sample row for CSV import',
  },
]

export function productsToCsvRows(products = []) {
  return products.map((p) => ({
    name: p.name || '',
    sku: p.sku || '',
    slug: p.slug || '',
    category: Array.isArray(p.categories) ? p.categories.join('|') : p.category || '',
    price: p.price ?? '',
    compareAtPrice: p.compareAtPrice ?? '',
    stock: p.stock ?? '',
    status: p.status || '',
    description: p.description || '',
  }))
}

export async function bulkImportProducts(rows = []) {
  const created = []
  const updated = []
  const existing = await listProducts()

  for (const row of rows) {
    const match =
      existing.find((p) => p.sku && row.sku && p.sku === row.sku) ||
      existing.find((p) => p.slug && row.slug && p.slug === row.slug)

    const payload = {
      ...row,
      categories: String(row.category || '')
        .split('|')
        .map((s) => s.trim())
        .filter(Boolean),
      price: Number(row.price) || 0,
      compareAtPrice: row.compareAtPrice === '' ? null : Number(row.compareAtPrice),
      stock: Number(row.stock) || 0,
    }

    if (match) {
      updated.push(await updateProduct(match.id, { ...match, ...payload }))
    } else {
      created.push(await createProduct(payload))
    }
  }

  return { created, updated }
}
