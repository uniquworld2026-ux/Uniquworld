import { createLocalStore } from '@/admin/lib/createLocalStore'

const seed = [
  {
    id: 'rv_1',
    productId: 'prd_1001',
    product: 'Walnut Serving Tray',
    customer: 'Ananya Krishnan',
    rating: 5,
    comment: 'Beautiful finish — arrived well packed.',
    status: 'approved',
    updatedAt: '2026-07-18T10:00:00.000Z',
    createdAt: '2026-07-17T10:00:00.000Z',
  },
  {
    id: 'rv_2',
    productId: 'prd_1002',
    product: 'Brass Candle Set',
    customer: 'Rahul Mehta',
    rating: 4,
    comment: 'Warm glow, slightly lighter than expected.',
    status: 'pending',
    updatedAt: '2026-07-16T10:00:00.000Z',
    createdAt: '2026-07-16T09:00:00.000Z',
  },
  {
    id: 'rv_3',
    productId: 'prd_1004',
    product: 'Corporate Welcome Hamper',
    customer: 'Priya Nair',
    rating: 5,
    comment: 'Perfect for our new hires.',
    status: 'approved',
    updatedAt: '2026-07-12T10:00:00.000Z',
    createdAt: '2026-07-11T10:00:00.000Z',
  },
]

const STATIC_REVIEW_POOL = [
  {
    customer: 'Ananya R.',
    rating: 5,
    comment: 'Beautiful piece — packed carefully and gift-ready.',
  },
  {
    customer: 'Karan M.',
    rating: 5,
    comment: 'Solid quality, not flimsy. Guests noticed right away.',
  },
  {
    customer: 'Meera K.',
    rating: 5,
    comment: 'Warm finish and elegant look. Would order again.',
  },
  {
    customer: 'Rahul S.',
    rating: 4,
    comment: 'Great craftsmanship. Delivery was on time.',
  },
  {
    customer: 'Priya N.',
    rating: 5,
    comment: 'Perfect for gifting — thoughtful details throughout.',
  },
  {
    customer: 'Divya P.',
    rating: 5,
    comment: 'Looks even better in person. Very happy with this.',
  },
  {
    customer: 'Arjun V.',
    rating: 5,
    comment: 'Premium feel and neat packaging. Highly recommend.',
  },
  {
    customer: 'Sneha L.',
    rating: 4,
    comment: 'Lovely gift. Exactly as shown in the photos.',
  },
  {
    customer: 'Vikram D.',
    rating: 5,
    comment: 'Ordered for a celebration — everyone loved it.',
  },
]

export const reviewsStore = createLocalStore('hm_admin_reviews_v1', seed, 'rv')

export function listReviews() {
  return reviewsStore.list()
}

export function createReview(payload) {
  return reviewsStore.create(payload)
}

/** Pick a stable subset of static reviews from the product id. */
function pickStaticTemplates(productId, count = 3) {
  const seedKey = String(productId || '')
  let hash = 0
  for (let i = 0; i < seedKey.length; i += 1) {
    hash = (hash + seedKey.charCodeAt(i) * (i + 1)) % STATIC_REVIEW_POOL.length
  }
  const picked = []
  for (let i = 0; i < count; i += 1) {
    picked.push(STATIC_REVIEW_POOL[(hash + i) % STATIC_REVIEW_POOL.length])
  }
  return picked
}

/**
 * Create approved static reviews for a newly created product.
 * @param {{ id: string, name: string }} product
 * @returns {object[]}
 */
export function createStaticReviewsForProduct(product) {
  if (!product?.id || !product?.name) return []

  const existing = reviewsStore
    .list()
    .filter((r) => r.productId === product.id || r.product === product.name)
  const approved = existing.filter((r) => r.status === 'approved')
  if (approved.length > 0) return approved
  if (existing.length > 0) return existing

  const templates = pickStaticTemplates(product.id, 3)
  const rows = reviewsStore.list()
  const now = Date.now()
  const created = templates.map((template, index) => {
    const daysAgo = 3 + index * 5
    const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    return {
      id: `rv_${now}_${index}`,
      productId: product.id,
      product: product.name,
      customer: template.customer,
      rating: template.rating,
      comment: template.comment,
      status: 'approved',
      createdAt,
      updatedAt: createdAt,
    }
  })
  localStorage.setItem('hm_admin_reviews_v1', JSON.stringify([...created, ...rows]))
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('hm-catalog-changed'))
  }
  return created
}

/**
 * Ensure every product has approved reviews (lazy seed for existing catalog).
 * @param {{ id: string, name: string }} product
 */
export function ensureApprovedReviewsForProduct(product) {
  if (!product?.id) return []
  const existing = listApprovedReviewsForProduct(product)
  if (existing.length > 0) return existing
  return createStaticReviewsForProduct({
    id: product.id,
    name: product.name || product.id,
  }).filter((r) => r.status === 'approved')
}

/**
 * Batch-ensure reviews for many products (one localStorage write).
 * @param {{ id: string, name: string }[]} products
 */
export function ensureReviewsForProducts(products = []) {
  const list = Array.isArray(products) ? products : []
  if (!list.length) return []

  let rows = reviewsStore.list()
  let changed = false
  const now = Date.now()
  const createdAll = []

  list.forEach((product, productIndex) => {
    if (!product?.id) return
    const hasApproved = rows.some(
      (r) =>
        r.status === 'approved' &&
        (r.productId === product.id || r.product === product.name),
    )
    if (hasApproved) return

    const templates = pickStaticTemplates(product.id, 3)
    const created = templates.map((template, index) => {
      const daysAgo = 3 + index * 5 + productIndex
      const createdAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      return {
        id: `rv_${now}_${productIndex}_${index}`,
        productId: product.id,
        product: product.name || product.id,
        customer: template.customer,
        rating: template.rating,
        comment: template.comment,
        status: 'approved',
        createdAt,
        updatedAt: createdAt,
      }
    })
    rows = [...created, ...rows]
    createdAll.push(...created)
    changed = true
  })

  if (changed) {
    localStorage.setItem('hm_admin_reviews_v1', JSON.stringify(rows))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hm-catalog-changed'))
    }
  }

  return createdAll
}

/** Storefront reviews + live rating stats for one product. */
export function getStorefrontReviewBundle(product) {
  if (!product) {
    return { reviews: [], rating: undefined, reviewCount: 0 }
  }
  const rows = ensureApprovedReviewsForProduct(product)
  const reviews = toStorefrontReviews(rows)
  return {
    reviews,
    rating: averageRating(rows),
    reviewCount: rows.length,
  }
}

/**
 * Approved reviews for a storefront product (by id, then name).
 * @param {{ id?: string, name?: string } | null} product
 */
export function listApprovedReviewsForProduct(product) {
  if (!product) return []
  return reviewsStore
    .list()
    .filter((r) => r.status === 'approved')
    .filter(
      (r) =>
        (product.id && r.productId === product.id) ||
        (product.name && r.product === product.name),
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** Map admin review rows into the storefront review card shape. */
export function toStorefrontReviews(rows = []) {
  return rows.map((r) => ({
    id: r.id,
    name: r.customer,
    rating: Number(r.rating) || 5,
    text: r.comment || '',
    date: formatReviewDate(r.createdAt),
  }))
}

function formatReviewDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function averageRating(rows = []) {
  if (!rows.length) return undefined
  const sum = rows.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return Math.round((sum / rows.length) * 10) / 10
}
