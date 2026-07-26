import { useMemo, useSyncExternalStore } from 'react'
import {
  getStorefrontCategories,
  getStorefrontProducts,
  filterStorefrontCatalog,
} from '@/shared/catalog/liveCatalog'

const PRODUCT_KEY = 'hm_admin_products_v1'
const CATEGORY_KEY = 'hm_admin_categories_v1'

/** Cached snapshots — getSnapshot must return the same ref when data is unchanged */
let productsCache = null
let categoriesCache = null
let categoryNamesCache = null

function invalidateCache() {
  productsCache = null
  categoriesCache = null
  categoryNamesCache = null
}

function getProductsSnapshot() {
  if (!productsCache) productsCache = getStorefrontProducts()
  return productsCache
}

function getCategoriesSnapshot() {
  if (!categoriesCache) categoriesCache = getStorefrontCategories()
  return categoriesCache
}

function getCategoryNamesSnapshot() {
  if (!categoryNamesCache) {
    categoryNamesCache = ['All', ...getCategoriesSnapshot().map((c) => c.name)]
  }
  return categoryNamesCache
}

function subscribe(callback) {
  const onChange = () => {
    invalidateCache()
    callback()
  }
  const onStorage = (e) => {
    if (!e.key || e.key === PRODUCT_KEY || e.key === CATEGORY_KEY) onChange()
  }
  window.addEventListener('storage', onStorage)
  window.addEventListener('hm-catalog-changed', onChange)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('hm-catalog-changed', onChange)
  }
}

export function useStorefrontCategories() {
  return useSyncExternalStore(subscribe, getCategoriesSnapshot, getCategoriesSnapshot)
}

export function useStorefrontProducts() {
  return useSyncExternalStore(subscribe, getProductsSnapshot, getProductsSnapshot)
}

export function useStorefrontCategoryNames() {
  return useSyncExternalStore(subscribe, getCategoryNamesSnapshot, getCategoryNamesSnapshot)
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
      }),
    // products identity changes only when catalog invalidates
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, search, category, occasion, sort, minPrice, maxPrice, onlyInStock],
  )
}
