import { categorySeed, listCategories } from '@/admin/features/categories/categoryStore'
import { listProducts } from '@/admin/features/products/productStore'
import {
  averageRating,
  ensureReviewsForProducts,
  listApprovedReviewsForProduct,
} from '@/admin/features/reviews/reviewStore'
import { catalogProducts as seedCatalog } from '@/storefront/data/catalog'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80'

function norm(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
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
    rating: p.rating != null && p.rating !== '' ? Number(p.rating) : undefined,
    reviewCount: Number(p.reviewCount) || 0,
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
  try {
    return listProducts().filter(isLiveProduct)
  } catch {
    return []
  }
}

/**
 * Active categories from Admin → Categories.
 * Falls back to seed so the storefront never looks empty.
 */
function readAdminCategories() {
  try {
    const rows = listCategories()
    const active = (Array.isArray(rows) ? rows : [])
      .filter((c) => isPublishedCategory(c))
      .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
    if (active.length > 0) return active
  } catch {
    /* fall through */
  }
  return categorySeed.filter((c) => isPublishedCategory(c))
}

function isPublishedCategory(c) {
  const status = c?.status
  return !status || status === 'published' || status === 'active'
}

/**
 * Attach live rating / review count from approved admin reviews.
 */
function withLiveReviews(product) {
  if (!product?.id) return product
  const rows = listApprovedReviewsForProduct(product)
  if (!rows.length) return product
  return {
    ...product,
    rating: averageRating(rows) ?? product.rating,
    reviewCount: rows.length,
  }
}

/**
 * Active admin products for the storefront.
 * Falls back to static catalog seed if admin store is empty.
 */
export function getStorefrontProducts() {
  const adminMapped = readAdminProducts().map(mapAdminProduct)
  const base =
    adminMapped.length > 0
      ? adminMapped
      : seedCatalog.map((p) => ({
          ...p,
          image: p.image || p.images?.[0],
        }))

  ensureReviewsForProducts(base)
  return base.map(withLiveReviews)
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
 * Dynamic categories from /admin/categories (with live product counts).
 * Categories with 0 products still appear.
 * productCount uses the same live-product rule as Admin → Categories.
 */
export function getStorefrontCategories() {
  const products = getStorefrontProducts()
  const cats = readAdminCategories()

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
} = {}) {
  let list = [...getStorefrontProducts()]
  const cats = readAdminCategories()

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
  list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice)
  if (onlyInStock) list = list.filter((p) => p.stock > 0)

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'newest':
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      break
    default:
      list.sort(
        (a, b) => Number(b.featured) - Number(a.featured) || (b.rating || 0) - (a.rating || 0),
      )
  }

  return list
}
