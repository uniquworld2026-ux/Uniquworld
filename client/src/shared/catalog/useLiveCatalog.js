import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { catalogPublicApi } from '@/admin/lib/erpApi'
import {
  countLiveProductsInCategory,
  filterStorefrontCatalog,
  isLiveProduct,
  mapAdminProduct,
  setLiveCatalogCache,
} from '@/shared/catalog/liveCatalog'

const CATALOG_STALE_MS = 5 * 60_000
const CATALOG_GC_MS = 30 * 60_000

export const catalogQueryKeys = {
  categories: ['catalog', 'categories'],
  products: ['catalog', 'products'],
  reviews: ['catalog', 'reviews'],
  productReviews: ['catalog', 'product-reviews'],
}

function mapCategory(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    imageUrl: c.imageUrl || '',
    status: c.status || 'published',
  }
}

export function useStorefrontCategories() {
  const { data = [], isLoading, isFetching, isPending } = useQuery({
    queryKey: catalogQueryKeys.categories,
    queryFn: () => catalogPublicApi.listCategories(),
    staleTime: CATALOG_STALE_MS,
    gcTime: CATALOG_GC_MS,
  })
  const {
    products,
    isLoading: productsLoading,
    isFetching: productsFetching,
    isPending: productsPending,
  } = useStorefrontProducts()

  const categories = useMemo(() => {
    const base = data
      .map(mapCategory)
      .filter((c) => !c.status || c.status === 'published' || c.status === 'active')
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))

    return base.map((c) => {
      const count = countLiveProductsInCategory(products, c.name, base)
      const cover =
        c.imageUrl ||
        products.find((p) =>
          [p.category, ...(p.categories || [])].some(
            (name) => String(name || '').toLowerCase() === String(c.name).toLowerCase(),
          ),
        )?.image ||
        ''
      return {
        ...c,
        title: c.name,
        subtitle: c.description || '',
        path: `/categories?category=${encodeURIComponent(c.name)}`,
        image: cover,
        productCount: count,
      }
    })
  }, [data, products])

  useEffect(() => {
    setLiveCatalogCache({ categories })
  }, [categories])

  return {
    categories,
    isLoading: isLoading || productsLoading,
    isFetching: isFetching || productsFetching,
    isPending: isPending || productsPending,
  }
}

export function useStorefrontProducts() {
  const { data = [], isLoading, isFetching, isPending } = useQuery({
    queryKey: catalogQueryKeys.products,
    queryFn: () => catalogPublicApi.listProducts(),
    staleTime: CATALOG_STALE_MS,
    gcTime: CATALOG_GC_MS,
  })
  const products = useMemo(
    () => data.filter(isLiveProduct).map(mapAdminProduct),
    [data],
  )

  useEffect(() => {
    setLiveCatalogCache({ products })
  }, [products])

  return { products, isLoading, isFetching, isPending }
}

/** Prefetch catalog so category / products pages open instantly. */
export function usePrefetchStorefrontCatalog() {
  const qc = useQueryClient()
  useEffect(() => {
    void qc.prefetchQuery({
      queryKey: catalogQueryKeys.categories,
      queryFn: () => catalogPublicApi.listCategories(),
      staleTime: CATALOG_STALE_MS,
    })
    void qc.prefetchQuery({
      queryKey: catalogQueryKeys.products,
      queryFn: () => catalogPublicApi.listProducts(),
      staleTime: CATALOG_STALE_MS,
    })
  }, [qc])
}

export function useStorefrontCategoryNames() {
  const { categories } = useStorefrontCategories()
  return useMemo(() => ['All', ...categories.map((c) => c.name)], [categories])
}

export function useStorefrontProduct(idOrSlug) {
  const { products, isLoading, isPending } = useStorefrontProducts()
  const product = useMemo(
    () => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null,
    [products, idOrSlug],
  )
  return { product, isLoading, isPending }
}

export function useStorefrontRelated(product, limit = 4) {
  const { products } = useStorefrontProducts()
  return useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit)
  }, [products, product, limit])
}

export function useFilteredStorefrontCatalog(filters) {
  const { products, isLoading, isFetching, isPending } = useStorefrontProducts()
  const { categories } = useStorefrontCategories()
  const {
    search = '',
    category = 'All',
    occasion = 'All',
    sort = 'featured',
    minPrice = 0,
    maxPrice = Infinity,
    onlyInStock = false,
  } = filters || {}

  const filtered = useMemo(
    () =>
      filterStorefrontCatalog({
        search,
        category,
        occasion,
        sort,
        minPrice,
        maxPrice,
        onlyInStock,
        products,
        categories,
      }),
    [products, categories, search, category, occasion, sort, minPrice, maxPrice, onlyInStock],
  )

  return { products: filtered, isLoading, isFetching, isPending }
}

const REVIEWS_STALE_MS = 30_000

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

/** Map ERP review rows to storefront card shape. */
export function mapStorefrontReview(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.author || row.customer || 'Customer',
    rating: Number(row.rating) || 5,
    text: row.body || row.comment || '',
    quote: row.body || row.comment || '',
    place: row.productName || row.product || '',
    date: formatReviewDate(row.createdAt),
    productId: row.productId,
    productName: row.productName,
  }
}

export function useProductReviews(productIdOrSlug) {
  const enabled = Boolean(productIdOrSlug)
  const { data, isLoading, isFetching, isPending, isError, isSuccess } = useQuery({
    queryKey: [...catalogQueryKeys.productReviews, productIdOrSlug],
    queryFn: () => catalogPublicApi.listProductReviews(productIdOrSlug),
    enabled,
    staleTime: REVIEWS_STALE_MS,
    gcTime: CATALOG_GC_MS,
  })

  const reviews = useMemo(
    () => (data?.items || []).map(mapStorefrontReview).filter(Boolean),
    [data],
  )

  return {
    reviews,
    rating: data?.rating ?? undefined,
    reviewCount: data?.reviewCount ?? reviews.length,
    isLoading: enabled && (isLoading || isPending),
    isFetching,
    isError,
    isSuccess,
  }
}

export function useFeaturedReviews(limit = 6) {
  const { data, isLoading, isFetching, isPending } = useQuery({
    queryKey: [...catalogQueryKeys.reviews, { limit }],
    queryFn: () => catalogPublicApi.listReviews({ limit }),
    staleTime: REVIEWS_STALE_MS,
    gcTime: CATALOG_GC_MS,
  })

  const reviews = useMemo(
    () => (data?.items || []).map(mapStorefrontReview).filter(Boolean),
    [data],
  )

  return {
    reviews,
    rating: data?.rating ?? undefined,
    reviewCount: data?.reviewCount ?? reviews.length,
    isLoading: isLoading || isPending,
    isFetching,
  }
}
