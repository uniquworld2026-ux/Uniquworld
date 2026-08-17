import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { ProductGridSkeleton } from '@/storefront/components/product/ProductCardSkeleton'
import { Button } from '@/shared/components/ui/Button'
import { Skeleton } from '@/shared/components/ui/Skeleton'
import { cn } from '@/shared/utils/cn'
import {
  useFilteredStorefrontCatalog,
  useStorefrontCategories,
  useStorefrontProducts,
} from '@/shared/catalog/useLiveCatalog'

const CATEGORY_FALLBACK =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'

function CategoryThumb({ src, alt = '', className }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden bg-white',
        className,
      )}
    >
      <img
        src={src || CATEGORY_FALLBACK}
        alt={alt}
        className="h-full w-full object-contain"
        loading="lazy"
        decoding="async"
        onError={(e) => {
          if (e.currentTarget.src !== CATEGORY_FALLBACK) {
            e.currentTarget.src = CATEGORY_FALLBACK
          }
        }}
      />
    </span>
  )
}

export function ProductsPage() {
  const [params, setParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const { categories, isLoading: categoriesLoading } = useStorefrontCategories()
  const { products: allProducts, isLoading: allLoading } = useStorefrontProducts()

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

  const categoryFilter = activeCategory?.name || state.category

  const { products, isLoading: filteredLoading } = useFilteredStorefrontCatalog({
    search: state.search,
    category: categoryFilter,
    sort: state.sort,
    onlyInStock: state.inStock,
  })

  const isLoading = filteredLoading || allLoading || categoriesLoading

  const totalInCategory =
    state.category === 'All'
      ? allProducts.length
      : activeCategory?.productCount ?? products.length

  const isCatActive = (cat) =>
    state.category === cat.name || state.category === cat.slug || state.category === cat.id

  const Filters = (
    <div className="space-y-6">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
          Category
        </p>
        {categoriesLoading ? (
          <div className="mt-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="mt-3 font-sans text-sm text-hm-text-muted">Categories will appear here soon.</p>
        ) : (
          <div className="mt-3 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => patch({ category: 'All' })}
              className={cn(
                'flex items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-sm transition',
                state.category === 'All'
                  ? 'bg-hm-primary text-white'
                  : 'text-hm-text-muted hover:bg-hm-muted hover:text-hm-text',
              )}
            >
              <span className="font-medium">All gifts</span>
              <span className="text-xs opacity-70">{allProducts.length}</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => patch({ category: cat.name })}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left font-sans text-sm transition',
                  isCatActive(cat)
                    ? 'bg-hm-primary text-white'
                    : 'text-hm-text-muted hover:bg-hm-muted hover:text-hm-text',
                )}
              >
                <CategoryThumb
                  src={cat.image}
                  className={cn(
                    'h-9 w-9 rounded-lg border',
                    isCatActive(cat) ? 'border-white/25 bg-white' : 'border-hm-border',
                  )}
                />
                <span className="min-w-0 flex-1 truncate font-medium">{cat.name}</span>
                <span className="shrink-0 text-xs opacity-70">{cat.productCount}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <label className="flex items-center gap-2 font-sans text-sm text-hm-text">
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
      <h1 className="sr-only">{activeCategory?.title || 'All gifts'}</h1>

      {categories.length > 0 || categoriesLoading ? (
        <div className="border-b border-hm-border bg-hm-elevated">
          <div className="mx-auto max-w-[90rem] px-4 py-4 sm:px-8">
            <p className="mb-3 font-sans text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
              Shop by category
            </p>
            {categoriesLoading ? (
              <div className="flex gap-3 overflow-hidden">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-[6.5rem] w-[5.25rem] shrink-0 rounded-2xl" />
                ))}
              </div>
            ) : (
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
                <button
                  type="button"
                  onClick={() => patch({ category: 'All' })}
                  className={cn(
                    'flex w-[5.25rem] shrink-0 flex-col items-center gap-1.5 rounded-2xl p-1.5 text-center transition',
                    state.category === 'All'
                      ? 'bg-hm-accent-muted ring-1 ring-hm-accent/40'
                      : 'hover:bg-hm-muted',
                  )}
                >
                  <span className="flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-2xl border border-hm-border bg-hm-muted font-display text-lg font-semibold text-hm-primary">
                    All
                  </span>
                  <span className="line-clamp-2 font-sans text-[11px] font-semibold leading-tight text-hm-text">
                    All gifts
                  </span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => patch({ category: cat.name })}
                    className={cn(
                      'flex w-[5.25rem] shrink-0 flex-col items-center gap-1.5 rounded-2xl p-1.5 text-center transition',
                      isCatActive(cat)
                        ? 'bg-hm-accent-muted ring-1 ring-hm-accent/40'
                        : 'hover:bg-hm-muted',
                    )}
                  >
                    <CategoryThumb
                      src={cat.image}
                      className="h-[4.25rem] w-[4.25rem] rounded-2xl border border-hm-border shadow-sm"
                    />
                    <span className="line-clamp-2 font-sans text-[11px] font-semibold leading-tight text-hm-text">
                      {cat.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="mx-auto max-w-[90rem] px-4 py-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-muted" />
            <input
              value={state.search}
              onChange={(e) => patch({ search: e.target.value })}
              placeholder="Search gifts…"
              className="h-12 w-full rounded-xl border border-hm-border bg-hm-elevated pl-10 pr-3 font-sans text-[0.9375rem] outline-none focus:border-hm-accent"
            />
          </label>
          <select
            value={state.sort}
            onChange={(e) => patch({ sort: e.target.value })}
            className="h-12 rounded-xl border border-hm-border bg-hm-elevated px-3 font-sans text-[0.9375rem]"
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

      <div className="mx-auto grid max-w-[90rem] gap-6 px-4 pb-16 sm:gap-8 sm:px-8 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[var(--hm-header-offset)] rounded-2xl border border-hm-border bg-hm-elevated p-5">
            <div className="mb-4 flex items-center gap-2 font-sans text-[0.9375rem] font-semibold text-hm-text">
              <Filter className="h-4 w-4 text-hm-accent" />
              Filters
            </div>
            {Filters}
          </div>
        </aside>

        <div>
          <p className="mb-5 font-sans text-[0.9375rem] text-hm-text-muted">
            {isLoading ? (
              <Skeleton className="inline-block h-4 w-40 rounded-md align-middle" />
            ) : (
              <>
                <span className="font-semibold text-hm-text">{products.length}</span> gift
                {products.length === 1 ? '' : 's'}
                {categoryFilter !== 'All' ? <span> in {categoryFilter}</span> : null}
              </>
            )}
          </p>
          {isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-hm-border bg-hm-elevated/50 p-8 text-center sm:p-12">
              <p className="font-display text-2xl font-semibold text-hm-text">
                {categoryFilter !== 'All' ? `No active gifts in ${categoryFilter}` : 'No gifts match'}
              </p>
              <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-hm-text-muted">
                {categoryFilter !== 'All' && totalInCategory === 0
                  ? 'Nothing in this collection right now. Try another category or view all gifts.'
                  : 'Try clearing filters or browse another category.'}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button variant="primary" onClick={() => patch({ search: '', category: 'All' })}>
                  View all gifts
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid auto-rows-fr grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  className="h-full"
                  priority={index < 4}
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
          <div className="absolute inset-x-0 bottom-0 max-h-[85svh] overflow-y-auto rounded-t-3xl border border-hm-border bg-hm-elevated p-5 pb-[max(1.25rem,calc(var(--uw-bottom-nav-h)+0.75rem))]">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-sans font-semibold text-hm-text">Filters</p>
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
