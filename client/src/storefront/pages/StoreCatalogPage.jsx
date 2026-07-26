import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'
import { storePublicApi } from '@/admin/lib/erpApi'
import { getErrorMessage } from '@/shared/lib/axios'

/**
 * /store — powered by the separate store_products catalog (not main products).
 */
export function StoreHubPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    storePublicApi
      .listProducts()
      .then(setItems)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const products = items.map((p) => {
    const gallery = Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : []
    const images = [...new Set([p.imageUrl, ...gallery].filter(Boolean))]
    return {
      id: p.id,
      name: p.name,
      price: Number(p.price),
      compareAt: p.compareAtPrice != null ? Number(p.compareAtPrice) : undefined,
      image: p.imageUrl || images[0],
      images,
      tag: p.category || 'Store',
      slug: p.slug,
      category: p.category,
      rating: 4.6,
      reviewCount: 0,
    }
  })

  return (
    <div>
      <PageHero
        eyebrow="Store & Wholesale"
        title="Store catalog"
        description="Curated wholesale and store products, separate from the main gift shop."
        actions={
          <Link to="/store/bulk">
            <Button variant="outline" size="sm">Bulk orders</Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {loading ? <p className="text-sm text-hm-text-muted">Loading store products…</p> : null}
        {error ? <p className="text-sm text-hm-danger">{error}</p> : null}
        {!loading && !products.length ? (
          <div className="rounded-2xl border border-hm-border bg-hm-elevated p-10 text-center">
            <p className="text-sm text-hm-text-muted">
              No store products available right now. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} href={`/store/p/${product.slug}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
