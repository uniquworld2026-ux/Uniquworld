import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingBag } from 'lucide-react'
import { formatCurrency } from '@/shared/lib/utils'
import { useCart } from '@/storefront/hooks/useCart'
import { StarRating } from '@/storefront/components/product/StarRating'
import { cn } from '@/shared/utils/cn'

/** Simple product card — responsive for 2-col mobile grids */
export function ProductCard({ product, className }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const image = product.image || product.images?.[0]

  function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, image, price: product.price })
  }

  function handleBuy(e) {
    e.preventDefault()
    e.stopPropagation()
    addItem({ ...product, image, price: product.price })
  }

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft transition duration-300 hover:-translate-y-1 hover:border-hm-accent/40 hover:shadow-hm-card',
        className,
      )}
    >
      <Link
        to={`/products/${product.id}`}
        className="relative block aspect-[5/4] shrink-0 overflow-hidden bg-gradient-to-br from-hm-muted to-white"
      >
        <img
          src={image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {product.tag ? (
          <span className="absolute left-2 top-2 rounded-lg bg-hm-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white sm:left-3.5 sm:top-3.5 sm:rounded-xl sm:px-3 sm:py-1 sm:text-[11px]">
            {product.tag}
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Wishlist"
          className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-hm-primary shadow-hm-soft sm:right-3.5 sm:top-3.5 sm:h-10 sm:w-10"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            navigate('/wishlist')
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="min-w-0">
          <Link to={`/products/${product.id}`}>
            <h3 className="line-clamp-2 text-sm font-medium leading-snug text-hm-text hover:text-hm-primary sm:min-h-[2.75rem] sm:text-[1.05rem]">
              {product.name}
            </h3>
          </Link>
          {(typeof product.occasion === 'string'
            ? product.occasion
            : product.occasion?.[0]) || product.category ? (
            <p className="mt-1 hidden line-clamp-1 text-[0.8125rem] text-hm-text-subtle sm:block">
              {typeof product.occasion === 'string'
                ? product.occasion
                : product.occasion?.[0] || product.category}
            </p>
          ) : null}
        </div>

        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-end justify-between gap-1.5">
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-1.5">
                <p className="text-base font-semibold leading-tight text-hm-primary sm:text-xl">
                  {formatCurrency(product.price)}
                </p>
                {product.offerPercent > 0 ||
                (product.compareAt && product.compareAt > product.price) ? (
                  <span className="rounded-md bg-hm-offer-muted px-1.5 py-0.5 text-[0.7rem] font-semibold text-hm-offer sm:text-[0.75rem]">
                    {product.offerPercent > 0
                      ? `${product.offerPercent}% off`
                      : `${Math.round(((product.compareAt - product.price) / product.compareAt) * 1000) / 10}% off`}
                  </span>
                ) : null}
              </div>
              <p
                className={cn(
                  'text-[0.75rem] leading-tight text-hm-text-subtle line-through sm:text-[0.8125rem]',
                  !product.compareAt && 'invisible',
                )}
              >
                {product.compareAt ? formatCurrency(product.compareAt) : '—'}
              </p>
            </div>
            <div className={cn('hidden sm:block', !product.rating && 'invisible')}>
              <StarRating rating={product.rating || 0} />
            </div>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1.5 sm:mt-3 sm:gap-2.5">
            <button
              type="button"
              onClick={handleAdd}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl border border-hm-border text-[0.75rem] font-semibold text-hm-text hover:border-hm-accent hover:text-hm-primary sm:h-11 sm:gap-1.5 sm:text-[0.8125rem]"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Add
            </button>
            <button
              type="button"
              onClick={handleBuy}
              className="inline-flex h-10 items-center justify-center gap-1 rounded-xl bg-hm-primary text-[0.75rem] font-semibold text-white hover:bg-hm-primary-hover sm:h-11 sm:text-[0.8125rem]"
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
