import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { useCart } from '@/storefront/hooks/useCart'
import { StarRating } from '@/storefront/components/product/StarRating'
import { cn } from '@/shared/utils/cn'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80'

function occasionLabel(product) {
  if (typeof product.occasion === 'string' && product.occasion.trim()) return product.occasion
  if (Array.isArray(product.occasion) && product.occasion[0]) return product.occasion[0]
  return product.category || ''
}

/** Product card — full-view image so headings on photos stay visible. */
export function ProductCard({ product, className, href, priority = false }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const preferred = product.image || product.images?.[0] || FALLBACK_IMAGE
  const [failed, setFailed] = useState(false)
  const image = failed ? FALLBACK_IMAGE : preferred
  const detailHref = href || `/products/${product.id}`
  const meta = occasionLabel(product)

  useEffect(() => {
    setFailed(false)
  }, [preferred])

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, image, price: product.price })
  }

  function handleBuy(e) {
    e.preventDefault()
    e.stopPropagation()
    navigate(`/checkout/buy?product=${product.id}&qty=1`)
  }

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft transition duration-300 hover:-translate-y-1 hover:border-hm-accent/35 hover:shadow-hm-card',
        className,
      )}
    >
      <Link
        to={detailHref}
        className="relative block aspect-[4/5] shrink-0 overflow-hidden bg-hm-muted"
      >
        <img
          src={image}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => {
            if (!failed) setFailed(true)
          }}
          className="h-full w-full object-contain p-1.5 transition duration-500 group-hover:scale-[1.03] sm:p-2"
        />
        {product.tag ? (
          <span className="absolute left-2 top-2 rounded-full bg-hm-primary/95 px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-sm sm:left-3 sm:top-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {product.tag}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Wishlist"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-hm-primary shadow-hm-soft sm:right-3 sm:top-3 sm:h-10 sm:w-10"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate('/wishlist')
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4 sm:pt-3">
        <div className="min-w-0">
          {meta ? (
            <p className="mb-0.5 truncate font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-hm-accent sm:text-[11px]">
              {meta}
            </p>
          ) : null}
          <Link to={detailHref}>
            <h3 className="line-clamp-2 font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-hm-text transition hover:text-hm-accent sm:min-h-[2.6rem] sm:text-[1.25rem]">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-end justify-between gap-1.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <p className="font-sans text-base font-bold leading-tight text-hm-primary sm:text-xl">
                  {formatCurrency(product.price)}
                </p>
                {product.offerPercent > 0 ||
                (product.compareAt && product.compareAt > product.price) ? (
                  <span className="rounded-md bg-hm-offer-muted px-1.5 py-0.5 font-sans text-[0.7rem] font-semibold text-hm-offer sm:text-[0.75rem]">
                    {product.offerPercent > 0
                      ? `${product.offerPercent}% off`
                      : `${Math.round(((product.compareAt - product.price) / product.compareAt) * 1000) / 10}% off`}
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  'font-sans text-[0.75rem] leading-tight text-hm-text-subtle line-through sm:text-[0.8125rem]',
                  !product.compareAt && 'invisible',
                )}
              >
                {product.compareAt ? formatCurrency(product.compareAt) : '—'}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-0.5">
              <StarRating rating={product.rating || 0} size="sm" showValue />
              <span className="font-sans text-[0.6875rem] text-hm-text-muted sm:text-xs">
                {product.reviewCount || 0} reviews
              </span>
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-hm-border font-sans text-[0.75rem] font-semibold text-hm-text transition hover:border-hm-accent hover:text-hm-primary sm:h-11 sm:gap-1.5 sm:text-[0.8125rem]"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add
            </button>
            <button
              type="button"
              onClick={handleBuy}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-hm-primary font-sans text-[0.75rem] font-semibold text-white transition hover:bg-hm-primary-hover sm:h-11 sm:text-[0.8125rem]"
            >
              Buy
              <span className="hidden sm:inline"> now</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

/** @deprecated use ProductCard */
export const ProductCard3D = ProductCard
