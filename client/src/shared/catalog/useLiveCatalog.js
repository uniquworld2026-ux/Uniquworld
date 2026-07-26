import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { catalogPublicApi } from '@/admin/lib/erpApi'
import {
  filterStorefrontCatalog,
  isLiveProduct,
  mapAdminProduct,
  setLiveCatalogCache,
} from '@/shared/catalog/liveCatalog'

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
  const { data = [] } = useQuery({
    queryKey: ['catalog', 'categories'],
    queryFn: () => catalogPublicApi.listCategories(),
    staleTime: 30_000,
  })
  const categories = useMemo(
    () =>
      data
        .map(mapCategory)
        .filter((c) => !c.status || c.status === 'published' || c.status === 'active')
        .sort((a, b) => String(a.name).localeCompare(String(b.name))),
    [data],
  )

  useEffect(() => {
    setLiveCatalogCache({ categories })
  }, [categories])

  return categories
}

export function useStorefrontProducts() {
  const { data = [] } = useQuery({
    queryKey: ['catalog', 'products'],
    queryFn: () => catalogPublicApi.listProducts(),
    staleTime: 30_000,
  })
  const products = useMemo(
    () => data.filter(isLiveProduct).map(mapAdminProduct),
    [data],
  )

  useEffect(() => {
    setLiveCatalogCache({ products })
  }, [products])

  return products
}

export function useStorefrontCategoryNames() {
  const categories = useStorefrontCategories()
  return useMemo(() => ['All', ...categories.map((c) => c.name)], [categories])
}

export function useStorefrontProduct(idOrSlug) {
  const products = useStorefrontProducts()
  return useMemo(
    () => products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null,
    [products, idOrSlug],
  )
}

export function useStorefrontRelated(product, limit = 4) {
  const products = useStorefrontProducts()
  return useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, limit)
  }, [products, product, limit])
}

export function useFilteredStorefrontCatalog(filters) {
  const products = useStorefrontProducts()
  const categories = useStorefrontCategories()
  const {
    search = '',
    category = 'All',
    occasion = 'All',
    sort = 'featured',
    minPrice = 0,
    maxPrice = Infinity,
    onlyInStock = false,
  } = filters || {}

  return useMemo(
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
}
