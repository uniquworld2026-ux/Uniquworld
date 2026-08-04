import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Minus, Plus, ShoppingBag } from 'lucide-react'
import { storePublicApi } from '@/admin/lib/erpApi'
import { getErrorMessage } from '@/shared/lib/axios'
import { useCart } from '@/storefront/hooks/useCart'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'

/**
 * /store/p/:slug — detail page for separate store_products catalog.
 */
export function StoreProductDetailsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    setLoading(true)
    setError('')
    storePublicApi
      .getProduct(slug)
      .then((item) => {
        setProduct(item)
        setQty(1)
        setActiveImage(0)
        window.scrollTo(0, 0)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [slug])

  const images = useMemo(() => {
    if (!product) return []
    const gallery = Array.isArray(product.gallery) ? product.gallery.filter(Boolean) : []
    const primary = product.imageUrl ? [product.imageUrl] : []
    return [...new Set([...primary, ...gallery])]
  }, [product])

  const cartProduct = useMemo(() => {
    if (!product) return null
    return {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      compareAt: product.compareAtPrice != null ? Number(product.compareAtPrice) : undefined,
      image: product.imageUrl || images[0],
      images,
      slug: product.slug,
      tag: product.category || 'Store',
      channel: 'store',
      meta: {
        channel: 'store',
        storeId: product.storeId || null,
        storeProductId: product.id,
        storeCode: product.storeCode || null,
        storeName: product.storeName || null,
      },
    }
  }, [product, images])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <p className="text-sm text-hm-text-muted">Loading store product…</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-8">
        <p className="text-hm-text">{error || 'Product not found.'}</p>
        <Link to="/store" className="mt-4 inline-block text-sm text-hm-primary">
          Back to store catalog
        </Link>
      </div>
    )
  }

  function handleAdd() {
    if (!cartProduct) return
    for (let i = 0; i < qty; i += 1) addItem(cartProduct)
  }

  function handleBuy() {
    handleAdd()
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <button
        type="button"
        onClick={() => navigate('/store')}
        className="mb-6 inline-flex items-center gap-2 text-sm text-hm-text-muted hover:text-hm-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Store catalog
      </button>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl bg-hm-muted">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          {images.length > 1 ? (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                    i === activeImage ? 'border-hm-primary' : 'border-transparent'
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-hm-text-subtle">
            {product.category || 'Store'}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-hm-text">{product.name}</h1>
          {product.storeName ? (
            <p className="mt-1 text-sm text-hm-text-muted">
              Sold by{' '}
              <Link to={`/store?store=${product.storeCode || ''}`} className="text-hm-accent">
                {product.storeName}
              </Link>
            </p>
          ) : null}
          {product.sku ? (
            <p className="mt-1 text-sm text-hm-text-muted">SKU · {product.sku}</p>
          ) : null}

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="text-2xl font-semibold text-hm-primary">
              {formatCurrency(product.price)}
            </span>
            {product.compareAtPrice != null && Number(product.compareAtPrice) > Number(product.price) ? (
              <span className="text-base text-hm-text-subtle line-through">
                {formatCurrency(product.compareAtPrice)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-hm-text-muted">
            Checkout adds 10% platform fee + shipping. The store receives the full product price after delivery.
          </p>

          {product.description ? (
            <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-hm-text-muted">
              {product.description}
            </p>
          ) : null}

          <p className="mt-4 text-sm text-hm-text-muted">
            Stock · {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center rounded-xl border border-hm-border">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-hm-text"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-hm-text"
                onClick={() => setQty((q) => q + 1)}
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              variant="outline"
              onClick={handleAdd}
              disabled={!product.stock}
              className="gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to cart
            </Button>
            <Button onClick={handleBuy} disabled={!product.stock}>
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
