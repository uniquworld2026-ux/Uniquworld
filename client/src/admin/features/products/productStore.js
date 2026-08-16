import { erpApi } from '@/admin/lib/erpApi'
import {
  compactGalleryImages,
  generateSku,
  normalizeGalleryImages,
  slugify,
} from '@/admin/features/products/productSchema'

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
    rating: values.rating === '' || values.rating == null ? undefined : Number(values.rating),
    reviewCount: values.reviewCount === '' || values.reviewCount == null ? undefined : Number(values.reviewCount),
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
  { key: 'id', label: 'id' },
  { key: 'name', label: 'name' },
  { key: 'sku', label: 'sku' },
  { key: 'slug', label: 'slug' },
  { key: 'categories', label: 'categories' },
  { key: 'subcategory', label: 'subcategory' },
  { key: 'brand', label: 'brand' },
  { key: 'description', label: 'description' },
  { key: 'instruction', label: 'instruction' },
  { key: 'imageUrl', label: 'imageUrl' },
  { key: 'galleryImage1', label: 'galleryImage1' },
  { key: 'galleryImage2', label: 'galleryImage2' },
  { key: 'galleryImage3', label: 'galleryImage3' },
  { key: 'price', label: 'price' },
  { key: 'compareAtPrice', label: 'compareAtPrice' },
  { key: 'offerPercent', label: 'offerPercent' },
  { key: 'productCost', label: 'productCost' },
  { key: 'serviceCost', label: 'serviceCost' },
  { key: 'profitMarginCost', label: 'profitMarginCost' },
  { key: 'profitMarginPercent', label: 'profitMarginPercent' },
  { key: 'gstPercent', label: 'gstPercent' },
  { key: 'customizationEnabled', label: 'customizationEnabled' },
  { key: 'customizedPrice', label: 'customizedPrice' },
  { key: 'customizedMarketAtPrice', label: 'customizedMarketAtPrice' },
  { key: 'customizedOfferPercent', label: 'customizedOfferPercent' },
  { key: 'customizedProductCost', label: 'customizedProductCost' },
  { key: 'customizedProfitMarginCost', label: 'customizedProfitMarginCost' },
  { key: 'customizedProfitMarginPercent', label: 'customizedProfitMarginPercent' },
  { key: 'stock', label: 'stock' },
  { key: 'minOrderQty', label: 'minOrderQty' },
  { key: 'weightGrams', label: 'weightGrams' },
  { key: 'lowStockAt', label: 'lowStockAt' },
  { key: 'deliveryDaysProduct', label: 'deliveryDaysProduct' },
  { key: 'deliveryDaysCustomized', label: 'deliveryDaysCustomized' },
  { key: 'rating', label: 'rating' },
  { key: 'reviewCount', label: 'reviewCount' },
  { key: 'status', label: 'status' },
  { key: 'featured', label: 'featured' },
  { key: 'trending', label: 'trending' },
  { key: 'seoTitle', label: 'seoTitle' },
  { key: 'seoDescription', label: 'seoDescription' },
  { key: 'seoKeywords', label: 'seoKeywords' },
  { key: 'seoMetaTags', label: 'seoMetaTags' },
]

export const productImportFieldGuide = [
  ['Column', 'Required', 'Notes'],
  ['id', 'No', 'Leave blank to create. Fill to update that product.'],
  ['name', 'Yes', 'Product title (min 2 characters).'],
  ['sku', 'No', 'Unique SKU. Auto-generated if blank.'],
  ['slug', 'No', 'URL slug. Auto-generated from name if blank.'],
  ['categories', 'Yes', 'Pipe-separated category names, e.g. Personalized Gifts|Hampers'],
  ['subcategory', 'No', 'Optional subcategory name.'],
  ['brand', 'No', 'Brand name.'],
  ['description', 'Yes', 'At least 10 characters.'],
  ['instruction', 'No', 'Care / usage instructions shown on the product page.'],
  ['imageUrl', 'No', 'Main image URL (https://…).'],
  ['galleryImage1', 'No', 'Extra gallery image URL 1.'],
  ['galleryImage2', 'No', 'Extra gallery image URL 2.'],
  ['galleryImage3', 'No', 'Extra gallery image URL 3.'],
  ['price', 'Yes', 'Selling price in INR (must be > 0).'],
  ['compareAtPrice', 'No', 'Market / MRP price in INR.'],
  ['offerPercent', 'No', 'Discount % vs MRP. Can be left blank.'],
  ['productCost', 'No', 'Internal product cost.'],
  ['serviceCost', 'No', 'Internal service / customization cost.'],
  ['profitMarginCost', 'No', 'Profit amount (optional; can be calculated in admin).'],
  ['profitMarginPercent', 'No', 'Profit % (optional).'],
  ['gstPercent', 'No', 'GST % (0–28). Default 18.'],
  ['customizationEnabled', 'No', 'true / false. Enables customized pricing.'],
  ['customizedPrice', 'No', 'Customized selling price.'],
  ['customizedMarketAtPrice', 'No', 'Customized MRP.'],
  ['customizedOfferPercent', 'No', 'Customized offer %.'],
  ['customizedProductCost', 'No', 'Customized product cost.'],
  ['customizedProfitMarginCost', 'No', 'Customized profit amount.'],
  ['customizedProfitMarginPercent', 'No', 'Customized profit %.'],
  ['stock', 'No', 'Available quantity. Default 0.'],
  ['minOrderQty', 'No', 'Minimum order quantity. Default 1.'],
  ['weightGrams', 'No', 'Weight in grams.'],
  ['lowStockAt', 'No', 'Low-stock alert threshold. Default 10.'],
  ['deliveryDaysProduct', 'No', 'Ready-product delivery days.'],
  ['deliveryDaysCustomized', 'No', 'Customized delivery days.'],
  ['rating', 'No', 'Display rating 1–5.'],
  ['reviewCount', 'No', 'Display review count.'],
  ['status', 'No', 'draft | published | archived. Default published.'],
  ['featured', 'No', 'true / false.'],
  ['trending', 'No', 'true / false.'],
  ['seoTitle', 'No', 'SEO title (max 70).'],
  ['seoDescription', 'No', 'SEO description (max 160).'],
  ['seoKeywords', 'No', 'Comma-separated keywords.'],
  ['seoMetaTags', 'No', 'Extra meta tags.'],
]

export const productImportSampleRows = [
  {
    id: '',
    name: 'Handcrafted Gift Box',
    sku: 'UW-GIFT-001',
    slug: 'handcrafted-gift-box',
    categories: 'Personalized Gifts|Hampers',
    subcategory: 'Birthday',
    brand: 'Uniquworld',
    description: 'Premium handcrafted gift box with personalized extras for celebrations.',
    instruction: 'Keep dry. Personalization proof sent before dispatch.',
    imageUrl: 'https://www.uniquworld.com/gifts/hamper.jpg',
    galleryImage1: 'https://www.uniquworld.com/gifts/gift-red.jpg',
    galleryImage2: 'https://www.uniquworld.com/gifts/celebration.jpg',
    galleryImage3: '',
    price: 999,
    compareAtPrice: 1299,
    offerPercent: 23,
    productCost: 420,
    serviceCost: 0,
    profitMarginCost: 579,
    profitMarginPercent: 58,
    gstPercent: 18,
    customizationEnabled: false,
    customizedPrice: '',
    customizedMarketAtPrice: '',
    customizedOfferPercent: '',
    customizedProductCost: '',
    customizedProfitMarginCost: '',
    customizedProfitMarginPercent: '',
    stock: 40,
    minOrderQty: 1,
    weightGrams: 650,
    lowStockAt: 8,
    deliveryDaysProduct: 3,
    deliveryDaysCustomized: 7,
    rating: 4.8,
    reviewCount: 12,
    status: 'published',
    featured: true,
    trending: true,
    seoTitle: 'Handcrafted Gift Box | Uniquworld',
    seoDescription: 'Shop a premium personalized gift box with fast delivery across India.',
    seoKeywords: 'gift box, personalized gifts, hampers',
    seoMetaTags: 'gifts, handmade',
  },
  {
    id: '',
    name: 'Custom Name Mug',
    sku: 'UW-MUG-002',
    slug: 'custom-name-mug',
    categories: 'Personalized Gifts',
    subcategory: 'Mugs',
    brand: 'Uniquworld',
    description: 'Ceramic mug with custom name print. Upload a photo or add a short message.',
    instruction: 'Hand wash recommended. Print is heat-pressed.',
    imageUrl: 'https://www.uniquworld.com/gifts/mug.jpg',
    galleryImage1: '',
    galleryImage2: '',
    galleryImage3: '',
    price: 449,
    compareAtPrice: 599,
    offerPercent: 25,
    productCost: 160,
    serviceCost: 40,
    profitMarginCost: 249,
    profitMarginPercent: 55,
    gstPercent: 18,
    customizationEnabled: true,
    customizedPrice: 549,
    customizedMarketAtPrice: 749,
    customizedOfferPercent: 27,
    customizedProductCost: 180,
    customizedProfitMarginCost: 329,
    customizedProfitMarginPercent: 60,
    stock: 120,
    minOrderQty: 1,
    weightGrams: 320,
    lowStockAt: 15,
    deliveryDaysProduct: 2,
    deliveryDaysCustomized: 5,
    rating: 4.6,
    reviewCount: 34,
    status: 'published',
    featured: false,
    trending: true,
    seoTitle: 'Custom Name Mug | Uniquworld',
    seoDescription: 'Personalize a ceramic mug with name or photo. Fast dispatch.',
    seoKeywords: 'custom mug, name mug, personalized mug',
    seoMetaTags: 'mugs, custom print',
  },
]

function parseBool(value, fallback) {
  const text = String(value ?? '').trim().toLowerCase()
  if (['1', 'true', 'yes', 'y'].includes(text)) return true
  if (['0', 'false', 'no', 'n'].includes(text)) return false
  return fallback
}

function parseNumber(value, fallback) {
  if (value === '' || value == null) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function hasValue(value) {
  return value !== '' && value !== undefined && value !== null
}

function splitCategories(row) {
  const raw = row.categories || row.category || ''
  return String(raw)
    .split(/[|,]/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function galleryFromRow(row) {
  return compactGalleryImages({
    galleryImages: [row.galleryImage1, row.galleryImage2, row.galleryImage3, ...(Array.isArray(row.galleryImages) ? row.galleryImages : [])],
  })
}

function productToImportRow(p = {}) {
  const gallery = normalizeGalleryImages(p)
  return {
    id: p.id || '',
    name: p.name || '',
    sku: p.sku || '',
    slug: p.slug || '',
    categories: Array.isArray(p.categories) ? p.categories.join('|') : p.category || '',
    subcategory: p.subcategory || '',
    brand: p.brand || '',
    description: p.description || '',
    instruction: p.instruction || '',
    imageUrl: p.imageUrl || '',
    galleryImage1: gallery[0] || '',
    galleryImage2: gallery[1] || '',
    galleryImage3: gallery[2] || '',
    price: p.price ?? '',
    compareAtPrice: p.compareAtPrice ?? '',
    offerPercent: p.offerPercent ?? '',
    productCost: p.productCost ?? p.cost ?? '',
    serviceCost: p.serviceCost ?? '',
    profitMarginCost: p.profitMarginCost ?? '',
    profitMarginPercent: p.profitMarginPercent ?? '',
    gstPercent: p.gstPercent ?? '',
    customizationEnabled: Boolean(p.customizationEnabled),
    customizedPrice: p.customizedPrice ?? '',
    customizedMarketAtPrice: p.customizedMarketAtPrice ?? '',
    customizedOfferPercent: p.customizedOfferPercent ?? '',
    customizedProductCost: p.customizedProductCost ?? '',
    customizedProfitMarginCost: p.customizedProfitMarginCost ?? '',
    customizedProfitMarginPercent: p.customizedProfitMarginPercent ?? '',
    stock: p.stock ?? '',
    minOrderQty: p.minOrderQty ?? '',
    weightGrams: p.weightGrams ?? '',
    lowStockAt: p.lowStockAt ?? '',
    deliveryDaysProduct: p.deliveryDaysProduct ?? '',
    deliveryDaysCustomized: p.deliveryDaysCustomized ?? '',
    rating: p.rating ?? '',
    reviewCount: p.reviewCount ?? '',
    status: p.status === 'active' ? 'published' : p.status || '',
    featured: Boolean(p.featured),
    trending: Boolean(p.trending),
    seoTitle: p.seoTitle || '',
    seoDescription: p.seoDescription || '',
    seoKeywords: p.seoKeywords || '',
    seoMetaTags: p.seoMetaTags || '',
  }
}

export function productsToCsvRows(products = []) {
  return products.map(productToImportRow)
}

export function buildProductWorkbookSheets(rows) {
  const header = productImportHeaders.map((h) => h.label)
  const body = rows.map((row) => productImportHeaders.map((h) => row[h.key] ?? ''))
  const cols = productImportHeaders.map((h) => ({
    wch: Math.min(36, Math.max(14, String(h.label).length + 4)),
  }))
  return [
    {
      name: 'Products',
      cols,
      rows: [header, ...body],
    },
    {
      name: 'Field guide',
      cols: [{ wch: 28 }, { wch: 10 }, { wch: 72 }],
      rows: productImportFieldGuide,
    },
  ]
}

function rowToPayload(row, existing = null) {
  const categories = splitCategories(row)
  const gallery = galleryFromRow(row)
  const name = String(row.name || existing?.name || '').trim()
  const payload = {
    ...(existing || {}),
    name,
    sku: String(row.sku || existing?.sku || generateSku(name)).trim(),
    slug: slugify(row.slug || existing?.slug || name),
    categories: categories.length ? categories : existing?.categories || [],
    category: (categories[0] || existing?.category || ''),
    description: String(row.description || existing?.description || '').trim(),
    status: String(row.status || existing?.status || 'published').trim() || 'published',
  }

  const assign = (key, parser) => {
    if (!hasValue(row[key]) && existing) return
    payload[key] = parser(row[key], existing?.[key])
  }

  assign('subcategory', (v, fb) => String(v || fb || ''))
  assign('brand', (v, fb) => String(v || fb || ''))
  assign('instruction', (v, fb) => String(v || fb || ''))
  assign('imageUrl', (v, fb) => String(v || fb || ''))
  assign('price', (v, fb) => parseNumber(v, fb ?? 0))
  assign('compareAtPrice', (v, fb) => (hasValue(v) ? parseNumber(v, null) : fb ?? null))
  assign('offerPercent', (v, fb) => parseNumber(v, fb))
  assign('productCost', (v, fb) => parseNumber(v, fb))
  assign('serviceCost', (v, fb) => parseNumber(v, fb))
  assign('profitMarginCost', (v, fb) => parseNumber(v, fb))
  assign('profitMarginPercent', (v, fb) => parseNumber(v, fb))
  assign('gstPercent', (v, fb) => parseNumber(v, fb ?? 18))
  assign('customizationEnabled', (v, fb) => parseBool(v, Boolean(fb)))
  assign('customizedPrice', (v, fb) => parseNumber(v, fb))
  assign('customizedMarketAtPrice', (v, fb) => parseNumber(v, fb))
  assign('customizedOfferPercent', (v, fb) => parseNumber(v, fb))
  assign('customizedProductCost', (v, fb) => parseNumber(v, fb))
  assign('customizedProfitMarginCost', (v, fb) => parseNumber(v, fb))
  assign('customizedProfitMarginPercent', (v, fb) => parseNumber(v, fb))
  assign('stock', (v, fb) => parseNumber(v, fb ?? 0))
  assign('minOrderQty', (v, fb) => parseNumber(v, fb ?? 1))
  assign('weightGrams', (v, fb) => parseNumber(v, fb))
  assign('lowStockAt', (v, fb) => parseNumber(v, fb ?? 10))
  assign('deliveryDaysProduct', (v, fb) => parseNumber(v, fb ?? 0))
  assign('deliveryDaysCustomized', (v, fb) => parseNumber(v, fb ?? 0))
  assign('rating', (v, fb) => parseNumber(v, fb))
  assign('reviewCount', (v, fb) => parseNumber(v, fb ?? 0))
  assign('featured', (v, fb) => parseBool(v, Boolean(fb)))
  assign('trending', (v, fb) => parseBool(v, Boolean(fb)))
  assign('seoTitle', (v, fb) => String(v || fb || ''))
  assign('seoDescription', (v, fb) => String(v || fb || ''))
  assign('seoKeywords', (v, fb) => String(v || fb || ''))
  assign('seoMetaTags', (v, fb) => String(v || fb || ''))

  if (gallery.length) payload.galleryImages = gallery
  else if (existing?.galleryImages) payload.galleryImages = existing.galleryImages
  if (!payload.imageUrl && payload.galleryImages?.[0]) payload.imageUrl = payload.galleryImages[0]

  return payload
}

export async function bulkImportProducts(rows = []) {
  const created = []
  const updated = []
  const errors = []
  const existing = await listProducts()

  for (const [index, row] of rows.entries()) {
    try {
      const match =
        existing.find((p) => row.id && String(p.id) === String(row.id)) ||
        existing.find((p) => p.sku && row.sku && p.sku === row.sku) ||
        existing.find((p) => p.slug && row.slug && p.slug === row.slug)

      const payload = rowToPayload(row, match)
      if (!payload.name || !payload.description || !payload.price) {
        throw new Error('name, description, and price are required')
      }
      if (!payload.categories?.length) {
        throw new Error('at least one category is required (use categories column)')
      }

      if (match) {
        const item = await updateProduct(match.id, payload)
        updated.push(item)
      } else {
        const item = await createProduct(payload)
        created.push(item)
        existing.push(item)
      }
    } catch (err) {
      errors.push({
        row: index + 2,
        message: err?.response?.data?.message || err?.message || 'Failed',
      })
    }
  }

  return { created, updated, errors }
}
