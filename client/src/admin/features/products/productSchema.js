import { z } from 'zod'

export const PRODUCT_STATUSES = ['draft', 'published', 'archived']

export const PRODUCT_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
  active: 'Published',
}

export const PRODUCT_CATEGORIES = [
  'Personalized Gifts',
  'Corporate Gifts',
  'Home Décor',
  'Hampers',
  'Jewellery',
  'Stationery',
]

const optionalNumber = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined
  const n = Number(val)
  return Number.isFinite(n) ? n : undefined
}, z.number().nonnegative().optional())

/** Offer % from sell price vs market (MRP) price. */
export function calcOfferPercent(price, marketAtPrice) {
  const sell = Number(price)
  const market = Number(marketAtPrice)
  if (!Number.isFinite(sell) || !Number.isFinite(market) || market <= 0 || sell < 0) return ''
  if (sell >= market) return 0
  return Math.round(((market - sell) / market) * 1000) / 10
}

/** Product profit from sell price minus product + service cost. */
export function calcProfit(sellPrice, productCost, serviceCost) {
  const sell = Number(sellPrice)
  const pCost = Number(productCost) || 0
  const sCost = Number(serviceCost) || 0
  if (!Number.isFinite(sell) || sell <= 0) {
    return { marginCost: '', marginPercent: '' }
  }
  const marginCost = Math.round((sell - pCost - sCost) * 100) / 100
  const marginPercent = Math.round((marginCost / sell) * 1000) / 10
  return { marginCost, marginPercent }
}

/** Customer profit (savings) from market price vs sell price. */
export function calcCustomerProfit(sellPrice, marketAtPrice) {
  const sell = Number(sellPrice)
  const market = Number(marketAtPrice)
  if (!Number.isFinite(sell) || !Number.isFinite(market) || market <= 0 || sell < 0) {
    return { marginCost: '', marginPercent: '' }
  }
  if (sell >= market) return { marginCost: 0, marginPercent: 0 }
  const marginCost = Math.round((market - sell) * 100) / 100
  const marginPercent = Math.round((marginCost / market) * 1000) / 10
  return { marginCost, marginPercent }
}

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required').max(120),
  slug: z
    .string()
    .min(2, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens'),
  sku: z.string().min(2, 'SKU is required').max(40),
  categories: z.array(z.string().min(1)).min(1, 'Select at least one category'),
  /** Primary category (first of `categories`) — kept for storefront / older rows */
  category: z.string().optional().default(''),
  subcategory: z.string().optional().default(''),
  brand: z.string().optional().default(''),
  description: z.string().min(10, 'Add at least 10 characters').max(2000),
  instruction: z.string().optional().default(''),
  rating: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined
    const n = Number(val)
    return Number.isFinite(n) ? n : undefined
  }, z.number().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5').optional()),
  reviewCount: z.coerce.number().int().min(0, 'Reviews cannot be negative').default(0),
  deliveryDaysProduct: z.coerce.number().int().min(0, 'Days cannot be negative').default(0),
  deliveryDaysCustomized: z.coerce.number().int().min(0, 'Days cannot be negative').default(0),
  // Product pricing
  price: z.coerce.number().positive('Price must be greater than 0'),
  compareAtPrice: optionalNumber,
  offerPercent: optionalNumber,
  /** When false, product is sell-only (no customized option on shop). */
  customizationEnabled: z.boolean().default(false),
  // Customized product pricing
  customizedPrice: optionalNumber,
  customizedMarketAtPrice: optionalNumber,
  customizedOfferPercent: optionalNumber,
  // Inventory
  minOrderQty: z.coerce.number().int().min(1, 'Min order must be at least 1').default(1),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  weightGrams: optionalNumber,
  lowStockAt: z.coerce.number().int().min(0).default(10),
  // Internal purpose
  productCost: optionalNumber,
  serviceCost: optionalNumber,
  /** Product-side profit (sell − costs) */
  profitMarginCost: optionalNumber,
  profitMarginPercent: optionalNumber,
  /** Customer-side profit / savings (market − sell) */
  customerProfitMarginCost: optionalNumber,
  customerProfitMarginPercent: optionalNumber,
  // Legacy aliases kept for older saved rows / storefront
  cost: optionalNumber,
  gstPercent: z.coerce.number().min(0).max(28).default(18),
  status: z.enum(PRODUCT_STATUSES),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  seoTitle: z.string().max(70).optional().default(''),
  seoDescription: z.string().max(160).optional().default(''),
  seoKeywords: z.string().max(300).optional().default(''),
  seoMetaTags: z.string().max(300).optional().default(''),
  imageUrl: z
    .string()
    .optional()
    .default('')
    .refine(
      (v) => !v || /^https?:\/\//.test(v) || /^data:image\//.test(v),
      'Upload an image or enter a valid image URL',
    ),
  /** Up to 3 extra gallery images (in addition to main `imageUrl`). */
  galleryImages: z
    .array(
      z
        .string()
        .refine(
          (v) => !v || /^https?:\/\//.test(v) || /^data:image\//.test(v),
          'Upload an image or enter a valid image URL',
        ),
    )
    .max(3)
    .optional()
    .default([]),
})

/** Pad/trim gallery to exactly 3 slots for the form UI. */
export function normalizeGalleryImages(values = {}) {
  const raw = Array.isArray(values.galleryImages) ? values.galleryImages : []
  const cleaned = raw.filter((v) => typeof v === 'string').slice(0, 3)
  while (cleaned.length < 3) cleaned.push('')
  return cleaned
}

/** Non-empty gallery URLs only (for save / catalog). */
export function compactGalleryImages(values = {}) {
  return normalizeGalleryImages(values).filter(Boolean)
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/** Normalize legacy single `category` into a `categories` array. */
export function normalizeCategories(values = {}) {
  if (Array.isArray(values.categories) && values.categories.length > 0) {
    return values.categories.filter(Boolean)
  }
  if (values.category) return [values.category]
  return []
}

/** Auto-generate a SKU like HM-A3F9K2 */
export function generateSku(name = '') {
  const letters = String(name)
    .replace(/[^a-zA-Z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
  const prefix = letters.length >= 2 ? letters : 'HM'
  const suffix = Date.now().toString(36).toUpperCase().slice(-4)
  return `${prefix}-${suffix}`
}

export const productDefaults = {
  name: '',
  slug: '',
  sku: '',
  categories: [],
  category: '',
  subcategory: '',
  brand: '',
  description: '',
  instruction: '',
  rating: '',
  reviewCount: 0,
  deliveryDaysProduct: 3,
  deliveryDaysCustomized: 7,
  price: '',
  compareAtPrice: '',
  offerPercent: '',
  customizationEnabled: false,
  customizedPrice: '',
  customizedMarketAtPrice: '',
  customizedOfferPercent: '',
  minOrderQty: 1,
  stock: 0,
  weightGrams: '',
  lowStockAt: 10,
  productCost: '',
  serviceCost: '',
  profitMarginCost: '',
  profitMarginPercent: '',
  customerProfitMarginCost: '',
  customerProfitMarginPercent: '',
  cost: '',
  gstPercent: 18,
  status: 'published',
  featured: false,
  trending: false,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  seoMetaTags: '',
  imageUrl: '',
  galleryImages: ['', '', ''],
}
