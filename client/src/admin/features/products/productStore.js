import {
  calcCustomerProfit,
  calcOfferPercent,
  calcProfit,
  compactGalleryImages,
  generateSku,
  normalizeCategories,
  normalizeGalleryImages,
  productDefaults,
  slugify,
} from '@/admin/features/products/productSchema'
import {
  averageRating,
  createStaticReviewsForProduct,
} from '@/admin/features/reviews/reviewStore'

const STORAGE_KEY = 'hm_admin_products_v1'

function withComputedPricing(product) {
  const price = product.price
  const compareAtPrice = product.compareAtPrice
  const productCost = product.productCost ?? product.cost ?? ''
  const serviceCost = product.serviceCost ?? ''
  const productMargin = calcProfit(price, productCost, serviceCost)
  const customerMargin = calcCustomerProfit(price, compareAtPrice)
  return {
    ...product,
    productCost,
    serviceCost,
    cost: productCost === '' || productCost == null ? product.cost : productCost,
    offerPercent: calcOfferPercent(price, compareAtPrice),
    customizedOfferPercent: calcOfferPercent(
      product.customizedPrice,
      product.customizedMarketAtPrice,
    ),
    profitMarginCost: productMargin.marginCost,
    profitMarginPercent: productMargin.marginPercent,
    customerProfitMarginCost: customerMargin.marginCost,
    customerProfitMarginPercent: customerMargin.marginPercent,
  }
}

const seedProducts = [
  withComputedPricing({
    id: 'prd_1001',
    name: 'Walnut Serving Tray',
    slug: 'walnut-serving-tray',
    sku: 'WD-204',
    categories: ['Home Décor'],
    category: 'Home Décor',
    subcategory: 'Serveware',
    brand: 'Uniquworld Atelier',
    description:
      'Hand-finished walnut tray with brass handles — ideal for hosting and corporate gifting.',
    instruction: 'Wipe with a dry cloth. Avoid soaking.',
    rating: 4.7,
    reviewCount: 28,
    deliveryDaysProduct: 3,
    deliveryDaysCustomized: 7,
    price: 2890,
    compareAtPrice: 3290,
    customizationEnabled: false,
    productCost: 1450,
    serviceCost: 120,
    cost: 1450,
    gstPercent: 18,
    minOrderQty: 1,
    stock: 42,
    lowStockAt: 10,
    weightGrams: 850,
    status: 'published',
    featured: true,
    trending: true,
    seoTitle: 'Walnut Serving Tray | Uniquworld',
    seoDescription: 'Premium handcrafted walnut serving tray with brass accents.',
    seoKeywords: 'walnut tray, serving tray, brass handles, Uniquworld gifts',
    seoMetaTags: 'home decor, serveware, walnut, gifts',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    galleryImages: [],
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-07-01T10:00:00.000Z',
  }),
  withComputedPricing({
    id: 'prd_1002',
    name: 'Brass Candle Set',
    slug: 'brass-candle-set',
    sku: 'BC-091',
    categories: ['Home Décor'],
    category: 'Home Décor',
    subcategory: 'Lighting',
    brand: 'Uniquworld Atelier',
    description: 'Set of three brushed brass candle holders with soy wax votives.',
    instruction: 'Never leave burning candles unattended.',
    rating: 4.5,
    reviewCount: 19,
    deliveryDaysProduct: 2,
    deliveryDaysCustomized: 5,
    price: 1650,
    compareAtPrice: 1890,
    customizationEnabled: false,
    productCost: 720,
    serviceCost: 80,
    cost: 720,
    gstPercent: 18,
    minOrderQty: 1,
    stock: 3,
    lowStockAt: 8,
    weightGrams: 620,
    status: 'published',
    featured: false,
    trending: true,
    seoTitle: 'Brass Candle Set | Uniquworld',
    seoDescription: 'Warm brass candle set for intimate gifting moments.',
    seoKeywords: 'brass candles, candle holders, soy wax, home gifts',
    seoMetaTags: 'lighting, brass, candles, home',
    imageUrl: 'https://images.unsplash.com/photo-1602874801006-e0c3f490f3c7?w=800&q=80',
    galleryImages: [],
    createdAt: '2026-02-20T10:00:00.000Z',
    updatedAt: '2026-06-18T10:00:00.000Z',
  }),
  withComputedPricing({
    id: 'prd_1003',
    name: 'Linen Gift Wrap Kit',
    slug: 'linen-gift-wrap-kit',
    sku: 'LW-118',
    categories: ['Personalized Gifts'],
    category: 'Personalized Gifts',
    subcategory: 'Wrapping',
    brand: 'Uniquworld',
    description: 'Reusable linen wrap with dried botanical seal and custom monogram card.',
    instruction: 'Share monogram text after placing the order.',
    rating: 4.8,
    reviewCount: 41,
    deliveryDaysProduct: 3,
    deliveryDaysCustomized: 6,
    price: 890,
    compareAtPrice: '',
    customizationEnabled: true,
    customizedPrice: 1090,
    customizedMarketAtPrice: 1290,
    productCost: 310,
    serviceCost: 60,
    cost: 310,
    gstPercent: 12,
    minOrderQty: 1,
    stock: 120,
    lowStockAt: 20,
    weightGrams: 180,
    status: 'published',
    featured: true,
    trending: false,
    seoTitle: 'Linen Gift Wrap Kit',
    seoDescription: 'Sustainable linen wrapping kit with personalization.',
    seoKeywords: 'linen wrap, gift wrap kit, monogram, sustainable gifting',
    seoMetaTags: 'gifts, wrapping, linen, personalized',
    imageUrl: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80',
    galleryImages: [],
    createdAt: '2026-01-08T10:00:00.000Z',
    updatedAt: '2026-05-22T10:00:00.000Z',
  }),
  withComputedPricing({
    id: 'prd_1004',
    name: 'Corporate Welcome Hamper',
    slug: 'corporate-welcome-hamper',
    sku: 'CH-501',
    categories: ['Corporate Gifts', 'Hampers'],
    category: 'Corporate Gifts',
    subcategory: 'Hampers',
    brand: 'Uniquworld Corp',
    description: 'Curated welcome hamper with notebook, ceramic mug, and artisanal treats.',
    instruction: 'Bulk branding available on request.',
    rating: 4.9,
    reviewCount: 14,
    deliveryDaysProduct: 5,
    deliveryDaysCustomized: 10,
    price: 4590,
    compareAtPrice: 5200,
    customizationEnabled: true,
    customizedPrice: 4990,
    customizedMarketAtPrice: 5600,
    productCost: 2400,
    serviceCost: 350,
    cost: 2400,
    gstPercent: 18,
    minOrderQty: 5,
    stock: 28,
    lowStockAt: 12,
    weightGrams: 2100,
    status: 'published',
    featured: true,
    trending: true,
    seoTitle: 'Corporate Welcome Hamper | Uniquworld',
    seoDescription: 'Premium onboarding hamper for corporate gifting.',
    seoKeywords: 'corporate hamper, welcome kit, office gifts, onboarding',
    seoMetaTags: 'corporate, hampers, gifts, welcome',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
    galleryImages: [],
    createdAt: '2026-04-02T10:00:00.000Z',
    updatedAt: '2026-07-10T10:00:00.000Z',
  }),
  withComputedPricing({
    id: 'prd_1005',
    name: 'Handwoven Ceramic Mug',
    slug: 'handwoven-ceramic-mug',
    sku: 'CM-077',
    categories: ['Home Décor'],
    category: 'Home Décor',
    subcategory: 'Tableware',
    brand: 'Studio Clay',
    description: 'Speckled stoneware mug with soft glaze — dishwasher safe.',
    instruction: 'Microwave and dishwasher safe.',
    rating: 4.4,
    reviewCount: 9,
    deliveryDaysProduct: 4,
    deliveryDaysCustomized: 8,
    price: 780,
    compareAtPrice: 950,
    customizationEnabled: false,
    productCost: 280,
    serviceCost: 40,
    cost: 280,
    gstPercent: 12,
    minOrderQty: 1,
    stock: 0,
    lowStockAt: 15,
    weightGrams: 340,
    status: 'draft',
    featured: false,
    trending: false,
    seoTitle: 'Handwoven Ceramic Mug',
    seoDescription: 'Artisan ceramic mug for everyday rituals.',
    seoKeywords: 'ceramic mug, stoneware, Uniquworld mug, tableware',
    seoMetaTags: 'tableware, ceramic, mug, home',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80',
    galleryImages: [],
    createdAt: '2026-05-14T10:00:00.000Z',
    updatedAt: '2026-07-15T10:00:00.000Z',
  }),
  withComputedPricing({
    id: 'prd_1006',
    name: 'Gold-Tone Keepsake Box',
    slug: 'gold-tone-keepsake-box',
    sku: 'KB-332',
    categories: ['Jewellery'],
    category: 'Jewellery',
    subcategory: 'Accessories',
    brand: 'Uniquworld Atelier',
    description: 'Velvet-lined keepsake box with brushed gold finish and engraved lid option.',
    instruction: 'Share engraving text for customized orders.',
    rating: 4.6,
    reviewCount: 22,
    deliveryDaysProduct: 3,
    deliveryDaysCustomized: 9,
    price: 2190,
    compareAtPrice: 2490,
    customizationEnabled: true,
    customizedPrice: 2490,
    customizedMarketAtPrice: 2790,
    productCost: 980,
    serviceCost: 150,
    cost: 980,
    gstPercent: 18,
    minOrderQty: 1,
    stock: 16,
    lowStockAt: 6,
    weightGrams: 410,
    status: 'archived',
    featured: false,
    trending: false,
    seoTitle: 'Gold-Tone Keepsake Box',
    seoDescription: 'Elegant keepsake box for jewellery and letters.',
    seoKeywords: 'keepsake box, jewellery box, engraved gift, gold tone',
    seoMetaTags: 'jewellery, keepsake, gifts, engraved',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    galleryImages: [],
    createdAt: '2025-11-30T10:00:00.000Z',
    updatedAt: '2026-06-01T10:00:00.000Z',
  }),
]

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProducts))
      return [...seedProducts]
    }
    return JSON.parse(raw)
  } catch {
    return [...seedProducts]
  }
}

function writeStore(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return products
}

export function listProducts() {
  return readStore().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function getProductById(id) {
  return readStore().find((p) => p.id === id) ?? null
}

export function createProduct(payload) {
  const products = readStore()
  const now = new Date().toISOString()
  const product = withComputedPricing({
    ...productDefaults,
    ...payload,
    id: `prd_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  })
  writeStore([product, ...products])

  const seededReviews = createStaticReviewsForProduct(product)
  if (seededReviews.length > 0) {
    const autoRating = averageRating(seededReviews)
    const needsRating = product.rating === '' || product.rating == null
    const needsCount = !product.reviewCount
    if (needsRating || needsCount) {
      const patched = withComputedPricing({
        ...product,
        rating: needsRating ? autoRating : product.rating,
        reviewCount: needsCount ? seededReviews.length : product.reviewCount,
        updatedAt: new Date().toISOString(),
      })
      const next = readStore()
      const idx = next.findIndex((p) => p.id === product.id)
      if (idx !== -1) {
        next[idx] = patched
        writeStore(next)
        return patched
      }
    }
  }

  return product
}

export function updateProduct(id, payload) {
  const products = readStore()
  const index = products.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Product not found')
  const updated = withComputedPricing({
    ...products[index],
    ...payload,
    id,
    updatedAt: new Date().toISOString(),
  })
  products[index] = updated
  writeStore(products)
  return updated
}

export function deleteProduct(id) {
  const products = readStore().filter((p) => p.id !== id)
  writeStore(products)
  return true
}

export function resetProducts() {
  writeStore(seedProducts)
  return [...seedProducts]
}

export const productImportHeaders = [
  { key: 'id', label: 'id' },
  { key: 'name', label: 'name' },
  { key: 'slug', label: 'slug' },
  { key: 'sku', label: 'sku' },
  { key: 'categories', label: 'categories' },
  { key: 'brand', label: 'brand' },
  { key: 'description', label: 'description' },
  { key: 'instruction', label: 'instruction' },
  { key: 'rating', label: 'rating' },
  { key: 'reviewCount', label: 'reviewCount' },
  { key: 'deliveryDaysProduct', label: 'deliveryDaysProduct' },
  { key: 'deliveryDaysCustomized', label: 'deliveryDaysCustomized' },
  { key: 'price', label: 'price' },
  { key: 'compareAtPrice', label: 'compareAtPrice' },
  { key: 'customizationEnabled', label: 'customizationEnabled' },
  { key: 'customizedPrice', label: 'customizedPrice' },
  { key: 'customizedMarketAtPrice', label: 'customizedMarketAtPrice' },
  { key: 'minOrderQty', label: 'minOrderQty' },
  { key: 'stock', label: 'stock' },
  { key: 'weightGrams', label: 'weightGrams' },
  { key: 'productCost', label: 'productCost' },
  { key: 'serviceCost', label: 'serviceCost' },
  { key: 'status', label: 'status' },
  { key: 'featured', label: 'featured' },
  { key: 'trending', label: 'trending' },
  { key: 'seoTitle', label: 'seoTitle' },
  { key: 'seoDescription', label: 'seoDescription' },
  { key: 'seoKeywords', label: 'seoKeywords' },
  { key: 'seoMetaTags', label: 'seoMetaTags' },
  { key: 'imageUrl', label: 'imageUrl' },
  { key: 'galleryImages', label: 'galleryImages' },
]

export const productImportSampleRows = [
  {
    id: '',
    name: 'Engraved Keepsake Frame',
    slug: 'engraved-keepsake-frame',
    sku: 'EK-101',
    categories: 'Personalized Gifts|Home Décor',
    brand: 'Uniquworld Atelier',
    description: 'Wooden keepsake frame with custom engraving for gifting.',
    instruction: 'Share engraving text after placing the order.',
    rating: 4.8,
    reviewCount: 12,
    deliveryDaysProduct: 3,
    deliveryDaysCustomized: 7,
    price: 1490,
    compareAtPrice: 1790,
    customizationEnabled: 'true',
    customizedPrice: 1690,
    customizedMarketAtPrice: 1990,
    minOrderQty: 1,
    stock: 25,
    weightGrams: 520,
    productCost: 650,
    serviceCost: 140,
    status: 'published',
    featured: 'true',
    trending: 'false',
    seoTitle: 'Engraved Keepsake Frame | Uniquworld',
    seoDescription: 'Personalized engraved gift frame for memorable gifting.',
    seoKeywords: 'engraved frame, personalized gift, keepsake',
    seoMetaTags: 'gifts, engraved, frame, personalized',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80',
    galleryImages: '',
  },
]

function parseNumber(value, fallback = '') {
  if (value === '' || value == null) return fallback
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

function parseBool(value, fallback = false) {
  if (typeof value === 'boolean') return value
  const normalized = String(value || '')
    .trim()
    .toLowerCase()
  if (normalized === 'true' || normalized === 'yes' || normalized === '1') return true
  if (normalized === 'false' || normalized === 'no' || normalized === '0') return false
  return fallback
}

function parseGalleryImages(value) {
  if (Array.isArray(value)) return compactGalleryImages({ galleryImages: value })
  return String(value || '')
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3)
}

/** Flatten a product into CSV-friendly row values. */
export function productToCsvRow(product) {
  const cats = normalizeCategories(product)
  return {
    id: product.id || '',
    name: product.name || '',
    slug: product.slug || '',
    sku: product.sku || '',
    categories: cats.join('|'),
    brand: product.brand || '',
    description: product.description || '',
    instruction: product.instruction || '',
    rating: product.rating ?? '',
    reviewCount: product.reviewCount ?? 0,
    deliveryDaysProduct: product.deliveryDaysProduct ?? '',
    deliveryDaysCustomized: product.deliveryDaysCustomized ?? '',
    price: product.price ?? '',
    compareAtPrice: product.compareAtPrice ?? '',
    customizationEnabled: product.customizationEnabled ? 'true' : 'false',
    customizedPrice: product.customizedPrice ?? '',
    customizedMarketAtPrice: product.customizedMarketAtPrice ?? '',
    minOrderQty: product.minOrderQty ?? 1,
    stock: product.stock ?? 0,
    weightGrams: product.weightGrams ?? '',
    productCost: product.productCost ?? product.cost ?? '',
    serviceCost: product.serviceCost ?? '',
    status: product.status || 'published',
    featured: product.featured ? 'true' : 'false',
    trending: product.trending ? 'true' : 'false',
    seoTitle: product.seoTitle || '',
    seoDescription: product.seoDescription || '',
    seoKeywords: product.seoKeywords || '',
    seoMetaTags: product.seoMetaTags || '',
    imageUrl: product.imageUrl || '',
    galleryImages: normalizeGalleryImages(product).filter(Boolean).join('|'),
  }
}

export function productsToCsvRows(products = listProducts()) {
  return products.map(productToCsvRow)
}

function buildProductPayloadFromRow(row) {
  const categories = String(row.categories || '')
    .split('|')
    .map((value) => value.trim())
    .filter(Boolean)
  const normalizedCategories = normalizeCategories({
    categories,
    category: row.category,
  })
  const productCost = parseNumber(row.productCost ?? row.cost)
  const customizationEnabled = parseBool(
    row.customizationEnabled,
    Boolean(parseNumber(row.customizedPrice)),
  )

  return withComputedPricing({
    ...productDefaults,
    name: row.name,
    slug: row.slug || slugify(row.name),
    sku: row.sku || generateSku(row.name),
    categories: normalizedCategories,
    category: normalizedCategories[0] || '',
    brand: row.brand || '',
    description: row.description || '',
    instruction: row.instruction || '',
    rating: parseNumber(row.rating),
    reviewCount: parseNumber(row.reviewCount, 0),
    deliveryDaysProduct: parseNumber(row.deliveryDaysProduct, productDefaults.deliveryDaysProduct),
    deliveryDaysCustomized: parseNumber(
      row.deliveryDaysCustomized,
      productDefaults.deliveryDaysCustomized,
    ),
    price: parseNumber(row.price, 0),
    compareAtPrice: parseNumber(row.compareAtPrice),
    customizationEnabled,
    customizedPrice: customizationEnabled ? parseNumber(row.customizedPrice) : '',
    customizedMarketAtPrice: customizationEnabled
      ? parseNumber(row.customizedMarketAtPrice)
      : '',
    minOrderQty: parseNumber(row.minOrderQty, productDefaults.minOrderQty),
    stock: parseNumber(row.stock, productDefaults.stock),
    weightGrams: parseNumber(row.weightGrams),
    productCost,
    serviceCost: parseNumber(row.serviceCost),
    cost: productCost,
    status: row.status || productDefaults.status,
    featured: parseBool(row.featured),
    trending: parseBool(row.trending),
    seoTitle: row.seoTitle || '',
    seoDescription: row.seoDescription || '',
    seoKeywords: row.seoKeywords || '',
    seoMetaTags: row.seoMetaTags || '',
    imageUrl: row.imageUrl || '',
    galleryImages: parseGalleryImages(row.galleryImages),
  })
}

function findExistingProduct(row, products) {
  const id = String(row.id || '').trim()
  if (id) {
    const byId = products.find((p) => p.id === id)
    if (byId) return byId
  }
  const sku = String(row.sku || '')
    .trim()
    .toLowerCase()
  if (sku) {
    const bySku = products.find((p) => String(p.sku || '').trim().toLowerCase() === sku)
    if (bySku) return bySku
  }
  const slug = String(row.slug || '')
    .trim()
    .toLowerCase()
  if (slug) {
    return products.find((p) => String(p.slug || '').trim().toLowerCase() === slug) || null
  }
  return null
}

/**
 * Bulk create or update products from CSV rows.
 * Match order: id → sku → slug. Returns { created, updated, products }.
 */
export function bulkImportProducts(rows) {
  const created = []
  const updated = []

  for (const row of rows) {
    const products = readStore()
    const existing = findExistingProduct(row, products)
    const payload = buildProductPayloadFromRow(row)

    if (existing) {
      const next = updateProduct(existing.id, {
        ...payload,
        sku: payload.sku || existing.sku,
        slug: payload.slug || existing.slug,
      })
      updated.push(next)
    } else {
      created.push(createProduct(payload))
    }
  }

  return { created, updated, products: [...created, ...updated] }
}
