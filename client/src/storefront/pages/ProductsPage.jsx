import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'
import {
  useFilteredStorefrontCatalog,
  useStorefrontCategories,
  useStorefrontProducts,
} from '@/shared/catalog/useLiveCatalog'

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const categories = useStorefrontCategories()
  const allProducts = useStorefrontProducts()

  useEffect(() => {
    if (!mobileFilters) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileFilters])

  const state = {
    search: params.get('q') || '',
    category: params.get('category') || 'All',
    sort: params.get('sort') || 'featured',
    inStock: params.get('inStock') === '1',
  }

  const activeCategory =
    state.category !== 'All'
      ? categories.find(
          (c) =>
            c.name === state.category ||
            c.slug === state.category ||
            c.id === state.category,
        )
      : null

  function patch(updates) {
    const next = new URLSearchParams(params)
    Object.entries(updates).forEach(([key, value]) => {
      const map = {
        search: 'q',
        category: 'category',
        sort: 'sort',
        inStock: 'inStock',
      }
      const paramKey = map[key] || key
      if (paramKey === 'inStock') {
        if (value) next.set('inStock', '1')
        else next.delete('inStock')
        return
      }
      if (paramKey === 'sort') {
        if (!value || value === 'featured') next.delete('sort')
        else next.set('sort', String(value))
        return
      }
      if (!value || value === 'All') next.delete(paramKey)
      else next.set(paramKey, String(value))
    })
    next.delete('occasion')
    setParams(next, { replace: true })
  }

  // Resolve filter to category name so slug/id query params still match admin products
  const categoryFilter = activeCategory?.name || state.category

  const products = useFilteredStorefrontCatalog({
    search: state.search,
    category: categoryFilter,
    sort: state.sort,
    onlyInStock: state.inStock,
  })

  const totalInCategory =
    state.category === 'All'
      ? allProducts.length
      : activeCategory?.productCount ?? products.length

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
          Category
        </p>
        {categories.length === 0 ? (
          <p className="mt-3 text-sm text-hm-text-muted">
            No categories yet.{' '}
            <Link to="/admin/categories" className="font-medium text-hm-accent hover:underline">
              Add in Admin
            </Link>
          </p>
        ) : (
          <div className="mt-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => patch({ category: 'All' })}
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                state.category === 'All'
                  ? 'bg-hm-primary text-hm-bg-elevated'
                  : 'text-hm-text-muted hover:bg-hm-muted hover:text-hm-text',
              )}
            >
              <span>All</span>
              <span className="text-xs opacity-70">{allProducts.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => patch({ category: cat.name })}
                className={cn(
                  'flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition',
                  state.category === cat.name ||
                    state.category === cat.slug ||
                    state.category === cat.id
                    ? 'bg-hm-primary text-hm-bg-elevated'
                    : 'text-hm-text-muted hover:bg-hm-muted hover:text-hm-text',
                )}
              >
                <span className="truncate pr-2">{cat.name}</span>
                <span className="shrink-0 text-xs opacity-70">{cat.productCount}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-hm-text">
        <input
          type="checkbox"
          checked={state.inStock}
          onChange={(e) => patch({ inStock: e.target.checked })}
          className="h-4 w-4 rounded border-hm-border"
        />
        In stock only
      </label>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() =>
          patch({
            search: '',
            category: 'All',
            sort: 'featured',
            inStock: false,
          })
        }
      >
        Clear filters
      </Button>
    </div>
  )

  return (
    <div>
      <div className="mx-auto max-w-[90rem] px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-muted" />
            <input
              value={state.search}
              onChange={(e) => patch({ search: e.target.value })}
              placeholder="Search gifts…"
              className="h-12 w-full rounded-xl border border-hm-border bg-hm-elevated pl-10 pr-3 text-[0.9375rem] outline-none focus:border-hm-accent"
            />
          </label>
          <select
            value={state.sort}
            onChange={(e) => patch({ sort: e.target.value })}
            className="h-12 rounded-xl border border-hm-border bg-hm-elevated px-3 text-[0.9375rem]"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="rating">Top rated</option>
            <option value="newest">Newest</option>
          </select>
          <Button variant="outline" className="lg:hidden" onClick={() => setMobileFilters(true)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-[90rem] gap-6 px-4 pb-16 sm:gap-8 sm:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[var(--hm-header-offset)] rounded-2xl border border-hm-border bg-hm-elevated p-5">
            <div className="mb-4 flex items-center gap-2 text-[0.9375rem] font-semibold text-hm-text">
              <Filter className="h-4 w-4 text-hm-accent" />
              Filters
            </div>
            {Filters}
          </div>
        </aside>

        <div>
          <p className="mb-5 text-[0.9375rem] text-hm-text-muted">
            <span className="font-semibold text-hm-text">{products.length}</span> active gift
            {products.length === 1 ? '' : 's'}
            {categoryFilter !== 'All' ? <span> in {categoryFilter}</span> : null}
          </p>
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hm-border bg-hm-elevated/50 p-8 text-center sm:p-12">
              <p className="font-display text-2xl text-hm-text">
                {categoryFilter !== 'All' ? `No active gifts in ${categoryFilter}` : 'No gifts match'}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-hm-text-muted">
                {categoryFilter !== 'All' && totalInCategory === 0
                  ? 'Add products in Admin and set status to Active for this category.'
                  : 'Only active products appear here. Draft or archived items stay in Admin.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" onClick={() => patch({ search: '', category: 'All' })}>
                  View all gifts
                </Button>
                <Link to="/admin/products">
                  <Button variant="outline">Manage products</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  className="h-full"
                  product={{
                    ...product,
                    image: product.image || product.images?.[0],
                    occasion: product.occasion?.[0],
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {mobileFilters ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-hm-overlay"
            aria-label="Close"
            onClick={() => setMobileFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-3xl border border-hm-border bg-hm-elevated p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-semibold text-hm-text">Filters</p>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                aria-label="Close"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-hm-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {Filters}
            <Button
              variant="primary"
              className="mt-4 w-full"
              onClick={() => setMobileFilters(false)}
            >
              Show {products.length} gifts
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
