const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80'

function norm(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
}

/** Stable pseudo-random rating (4.5–5.0) and review count (125+) per product. */
export function getProductSocialProof(productKey) {
  const key = String(productKey || 'product')
  let hash = 0
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0
  }
  const seed = Math.abs(hash)
  const rating = Math.round((4.5 + (seed % 6) / 10) * 10) / 10
  const reviewCount = 125 + (seed % 1876)
  return { rating, reviewCount }
}

/** Products customers can see — keep Admin Items + storefront filters in sync. */
export function isLiveProduct(p) {
  const status = p?.status
  return !status || status === 'active' || status === 'published'
}

export function productMatchesCategory(product, categoryValue, categories = []) {
  const key = norm(categoryValue)
  if (!key || key === 'all') return true

  const productCats = [
    ...(Array.isArray(product.categories) ? product.categories : []),
    product.category,
  ]
    .filter(Boolean)
    .map(norm)

  if (productCats.includes(key)) return true

  const cat = categories.find(
    (c) => norm(c.name) === key || norm(c.slug) === key || norm(c.id) === key,
  )
  if (!cat) return false

  const aliases = [norm(cat.name), norm(cat.slug), norm(cat.id)]
  return productCats.some((pc) => aliases.includes(pc))
}

/** Live (storefront-visible) product count for a category — same number in Admin + shop. */
export function countLiveProductsInCategory(products, categoryValue, categories = []) {
  return (products || []).filter(
    (p) => isLiveProduct(p) && productMatchesCategory(p, categoryValue, categories),
  ).length
}

export function countAllProductsInCategory(products, categoryValue, categories = []) {
  return (products || []).filter((p) => productMatchesCategory(p, categoryValue, categories))
    .length
}

/**
 * Map an admin product record into the storefront product shape.
 */
export function mapAdminProduct(p) {
  const gallery = Array.isArray(p.galleryImages)
    ? p.galleryImages.filter((src) => typeof src === 'string' && src.trim())
    : []
  const main = p.imageUrl || gallery[0] || FALLBACK_IMAGE
  const images = [main, ...gallery.filter((src) => src !== main)].slice(0, 4)
  const categories = Array.isArray(p.categories) && p.categories.length
    ? p.categories
    : p.category
      ? [p.category]
      : []
  const { rating, reviewCount } = getProductSocialProof(p.id || p.slug || p.name)
  return {
    id: p.id,
    slug: p.slug || p.id,
    name: p.name,
    tag: p.featured ? 'Featured' : p.trending ? 'Trending' : '',
    category: categories[0] || p.category || 'Uncategorized',
    categories,
    subcategory: p.subcategory || '',
    brand: p.brand || 'Uniquworld',
    occasion: [],
    price: Number(p.price) || 0,
    compareAt: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
    offerPercent: (() => {
      const stored = Number(p.offerPercent)
      if (Number.isFinite(stored) && stored > 0) return stored
      const price = Number(p.price) || 0
      const market = Number(p.compareAtPrice) || 0
      if (market > price && price > 0) {
        return Math.round(((market - price) / market) * 1000) / 10
      }
      return undefined
    })(),
    customizedPrice: p.customizedPrice != null && p.customizedPrice !== ''
      ? Number(p.customizedPrice)
      : undefined,
    customizedCompareAt:
      p.customizedMarketAtPrice != null && p.customizedMarketAtPrice !== ''
        ? Number(p.customizedMarketAtPrice)
        : undefined,
    customizedOfferPercent: (() => {
      const stored = Number(p.customizedOfferPercent)
      if (Number.isFinite(stored) && stored > 0) return stored
      const price = Number(p.customizedPrice) || 0
      const market = Number(p.customizedMarketAtPrice) || 0
      if (market > price && price > 0) {
        return Math.round(((market - price) / market) * 1000) / 10
      }
      return undefined
    })(),
    customizationEnabled:
      typeof p.customizationEnabled === 'boolean'
        ? p.customizationEnabled
        : Boolean(
            (p.customizedPrice != null && p.customizedPrice !== '') ||
              Number(p.deliveryDaysCustomized) > 0,
          ),
    deliveryDaysProduct: Number(p.deliveryDaysProduct) || 0,
    deliveryDaysCustomized: Number(p.deliveryDaysCustomized) || 0,
    rating,
    reviewCount,
    stock: Number(p.stock) || 0,
    shortDescription: p.description?.slice(0, 120) || '',
    description: p.description || '',
    instruction: p.instruction || '',
    features: [],
    images,
    image: images[0],
    variants: {},
    personalization: { customText: false, uploadImage: false, uploadLogo: false, maxChars: 24 },
    bulkPricing: [{ minQty: 1, price: Number(p.price) || 0 }],
    shippingNote:
      Number(p.deliveryDaysProduct) > 0
        ? `Dispatches in ${Number(p.deliveryDaysProduct)} day${Number(p.deliveryDaysProduct) === 1 ? '' : 's'}`
        : 'Dispatches in 1–2 days',
    featured: Boolean(p.featured),
    trending: Boolean(p.trending),
    status: p.status,
    updatedAt: p.updatedAt,
    createdAt: p.createdAt,
  }
}

function readAdminProducts() {
  return []
}

function readAdminCategories() {
  return []
}

function isPublishedCategory(c) {
  const status = c?.status
  return !status || status === 'published' || status === 'active'
}

/**
 * Active admin products for the storefront — no static seed fallback.
 * Prefer React Query hooks in useLiveCatalog for UI; this sync helper
 * returns [] when local cache is empty (API-backed data lives in hooks).
 */
let _catalogCache = []
let _categoryCache = []

export function setLiveCatalogCache({ products, categories } = {}) {
  if (Array.isArray(products)) _catalogCache = products
  if (Array.isArray(categories)) _categoryCache = categories
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
}

export function getStorefrontProducts() {
  if (_catalogCache.length) return _catalogCache
  try {
    return readAdminProducts().map(mapAdminProduct)
  } catch {
    return []
  }
}

export function getStorefrontProduct(idOrSlug) {
  return (
    getStorefrontProducts().find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
  )
}

export function getStorefrontRelated(product, limit = 4) {
  if (!product) return []
  const productCats = new Set(
    [
      ...(Array.isArray(product.categories) ? product.categories : []),
      product.category,
    ]
      .filter(Boolean)
      .map(norm),
  )
  return getStorefrontProducts()
    .filter((p) => {
      if (p.id === product.id) return false
      const other = [
        ...(Array.isArray(p.categories) ? p.categories : []),
        p.category,
      ]
        .filter(Boolean)
        .map(norm)
      return other.some((c) => productCats.has(c))
    })
    .slice(0, limit)
}

/**
 * Dynamic categories from ERP catalog (with live product counts).
 */
export function getStorefrontCategories() {
  const products = getStorefrontProducts()
  const cats = _categoryCache.length
    ? _categoryCache
    : (() => {
        try {
          return readAdminCategories()
        } catch {
          return []
        }
      })()

  return cats.map((c) => {
    const name = c.name
    const count = countLiveProductsInCategory(products, name, cats)
    return {
      id: c.id,
      name,
      title: name,
      subtitle: c.description || '',
      description: c.description || '',
      slug: c.slug || name.toLowerCase().replace(/\s+/g, '-'),
      path: `/categories?category=${encodeURIComponent(name)}`,
      image:
        c.imageUrl ||
        products.find((p) => productMatchesCategory(p, name, cats))?.image ||
        FALLBACK_IMAGE,
      productCount: count,
      status: c.status || 'published',
    }
  })
}

export function getStorefrontCategoryNames() {
  return ['All', ...getStorefrontCategories().map((c) => c.name)]
}

export function filterStorefrontCatalog({
  search = '',
  category = 'All',
  occasion = 'All',
  sort = 'featured',
  minPrice = 0,
  maxPrice = Infinity,
  onlyInStock = false,
  products,
  categories,
} = {}) {
  let list = [...(products || getStorefrontProducts())]
  const cats = categories || getStorefrontCategories()

  if (category && category !== 'All') {
    list = list.filter((p) => productMatchesCategory(p, category, cats))
  }
  if (occasion && occasion !== 'All') {
    list = list.filter((p) => (p.occasion || []).includes(occasion))
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.tag || '').toLowerCase().includes(q) ||
        (p.shortDescription || '').toLowerCase().includes(q),
    )
  }
  if (onlyInStock) {
    list = list.filter((p) => Number(p.stock) > 0)
  }
  if (minPrice > 0) {
    list = list.filter((p) => Number(p.price) >= minPrice)
  }
  if (maxPrice < Infinity) {
    list = list.filter((p) => Number(p.price) <= maxPrice)
  }

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
  else if (sort === 'newest') {
    list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
  } else if (sort === 'rating') {
    list.sort(
      (a, b) =>
        (Number(b.rating) || 0) - (Number(a.rating) || 0) ||
        (Number(b.reviewCount) || 0) - (Number(a.reviewCount) || 0),
    )
  } else {
    list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.price - a.price)
  }

  return list
}
