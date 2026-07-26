import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Upload,
  Zap,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import {
  getUnitPrice,
} from '@/storefront/data/catalog'
import {
  getStorefrontProduct,
  getStorefrontProducts,
  getStorefrontRelated,
} from '@/shared/catalog/liveCatalog'
import { getStorefrontReviewBundle } from '@/admin/features/reviews/reviewStore'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { StarRating } from '@/storefront/components/product/StarRating'
import { CustomizeProductModal } from '@/storefront/components/product/CustomizeProductModal'
import { pushRecentlyViewed, getRecentlyViewedIds } from '@/storefront/hooks/useRecentlyViewed'
import { useCart } from '@/storefront/hooks/useCart'
import { createPersonalizedOrder } from '@/admin/features/personalized/personalizedOrdersStore'
import { formatCurrency } from '@/shared/lib/utils'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

function initialVariants(variants = {}) {
  return Object.fromEntries(Object.entries(variants).map(([k, opts]) => [k, opts[0]]))
}

export function ProductDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const product = getStorefrontProduct(id)

  const [activeImage, setActiveImage] = useState(0)
  const [lensZoom, setLensZoom] = useState(false)
  const [lensOrigin, setLensOrigin] = useState({ x: 50, y: 50 })
  const imageFrameRef = useRef(null)
  const [qty, setQty] = useState(1)
  const [variants, setVariants] = useState(() => initialVariants(product?.variants))
  const [customText, setCustomText] = useState('')
  const [logoName, setLogoName] = useState('')
  const [imageName, setImageName] = useState('')
  const [customPhotoName, setCustomPhotoName] = useState('')
  const [customPhotoDataUrl, setCustomPhotoDataUrl] = useState('')
  const [customizeOpen, setCustomizeOpen] = useState(false)
  const [pendingCartAction, setPendingCartAction] = useState(null) // 'add' | 'buy' | null
  const [wishlisted, setWishlisted] = useState(false)
  const [optionType, setOptionType] = useState('product') // product | customized
  const [reviewsTick, setReviewsTick] = useState(0)

  useEffect(() => {
    if (!product) return
    setActiveImage(0)
    setQty(1)
    setVariants(initialVariants(product.variants))
    setCustomText('')
    setLogoName('')
    setImageName('')
    setCustomPhotoName('')
    setCustomPhotoDataUrl('')
    setCustomizeOpen(false)
    setPendingCartAction(null)
    setOptionType('product')
    setLensZoom(false)
    setLensOrigin({ x: 50, y: 50 })
    pushRecentlyViewed(product.id)
    window.scrollTo(0, 0)
  }, [product?.id])

  useEffect(() => {
    const onChange = () => setReviewsTick((n) => n + 1)
    window.addEventListener('hm-catalog-changed', onChange)
    return () => window.removeEventListener('hm-catalog-changed', onChange)
  }, [])

  function updateLensOrigin(clientX, clientY) {
    const el = imageFrameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setLensOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    })
  }

  function handleImagePointerMove(e) {
    if (!lensZoom) return
    updateLensOrigin(e.clientX, e.clientY)
  }

  function handleImageClick(e) {
    if (!lensZoom) {
      updateLensOrigin(e.clientX, e.clientY)
      setLensZoom(true)
      return
    }
    setLensZoom(false)
  }

  const isCustomized = optionType === 'customized'
  const hasCustomizedOption =
    product?.customizationEnabled === true ||
    (product?.customizationEnabled !== false &&
      (Boolean(product?.customizedPrice) || Boolean(product?.deliveryDaysCustomized)))

  const displayPrice = isCustomized
    ? Number(product?.customizedPrice) || Number(product?.price) || 0
    : product
      ? getUnitPrice(product, qty)
      : 0
  const displayCompareAt = isCustomized ? product?.customizedCompareAt : product?.compareAt
  const displayOffer =
    isCustomized
      ? product?.customizedOfferPercent ||
        (displayCompareAt && displayCompareAt > displayPrice
          ? Math.round(((displayCompareAt - displayPrice) / displayCompareAt) * 1000) / 10
          : undefined)
      : product?.offerPercent ||
        (displayCompareAt && displayCompareAt > displayPrice
          ? Math.round(((displayCompareAt - displayPrice) / displayCompareAt) * 1000) / 10
          : undefined)
  const deliveryDays = isCustomized
    ? Number(product?.deliveryDaysCustomized) || Number(product?.deliveryDaysProduct) || 0
    : Number(product?.deliveryDaysProduct) || 0
  const shippingNote =
    deliveryDays > 0
      ? `Dispatches in ${deliveryDays} day${deliveryDays === 1 ? '' : 's'}`
      : product?.shippingNote || 'Dispatches in 1–2 days'

  const unitPrice = displayPrice
  const related = product ? getStorefrontRelated(product) : []
  const reviewBundle = useMemo(() => {
    if (!product) return { reviews: [], rating: undefined, reviewCount: 0 }
    return getStorefrontReviewBundle(product)
    // reviewsTick refreshes after admin / seed writes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, reviewsTick])
  const reviews = reviewBundle.reviews
  const displayRating = reviewBundle.rating || product?.rating || 0
  const displayReviewCount = reviewBundle.reviewCount || product?.reviewCount || 0
  const recentlyViewed = useMemo(() => {
    if (!product) return []
    const all = getStorefrontProducts()
    return getRecentlyViewedIds()
      .filter((rid) => rid !== product.id)
      .map((rid) => all.find((p) => p.id === rid))
      .filter(Boolean)
      .slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[70svh] max-w-lg flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-hm-text">Gift not found</h1>
        <Link to="/categories" className="mt-6">
          <Button variant="primary">Back to shop</Button>
        </Link>
      </div>
    )
  }

  const hasCustomizationInput = Boolean(customText.trim() || customPhotoDataUrl)

  function payload() {
    return {
      id: product.id,
      name: product.name,
      price: unitPrice,
      image: product.images[0],
      tag: product.tag,
      meta: {
        optionType,
        variants,
        customText: customText || undefined,
        photoName: customPhotoName || undefined,
        photoDataUrl: customPhotoDataUrl || undefined,
        logoName: logoName || undefined,
        imageName: imageName || undefined,
      },
    }
  }

  function selectCustomized() {
    setOptionType('customized')
    setCustomizeOpen(true)
  }

  function commitToCart(action) {
    const item = payload()
    addItem(item, qty)
    if (optionType === 'customized' && hasCustomizationInput) {
      createPersonalizedOrder({
        productId: product.id,
        product: product.name,
        customText,
        photoName: customPhotoName,
        photoDataUrl: customPhotoDataUrl,
        status: 'pending',
      })
    }
    if (action === 'buy') navigate('/cart')
  }

  function handleAddToBag(action) {
    if (optionType === 'customized' && !hasCustomizationInput) {
      setPendingCartAction(action)
      setCustomizeOpen(true)
      return
    }
    commitToCart(action)
  }

  function handleCustomizeContinue(next) {
    setCustomText(next.customText || '')
    setCustomPhotoName(next.photoName || '')
    setCustomPhotoDataUrl(next.photoDataUrl || '')
    setCustomizeOpen(false)
    if (pendingCartAction) {
      const action = pendingCartAction
      setPendingCartAction(null)
      // Use next values immediately for cart (state may not have flushed)
      const item = {
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.images[0],
        tag: product.tag,
        meta: {
          optionType: 'customized',
          variants,
          customText: next.customText || undefined,
          photoName: next.photoName || undefined,
          photoDataUrl: next.photoDataUrl || undefined,
          logoName: logoName || undefined,
          imageName: imageName || undefined,
        },
      }
      addItem(item, qty)
      createPersonalizedOrder({
        productId: product.id,
        product: product.name,
        customText: next.customText || '',
        photoName: next.photoName || '',
        photoDataUrl: next.photoDataUrl || '',
        status: 'pending',
      })
      if (action === 'buy') navigate('/cart')
    }
  }

  return (
    <div className="pb-24 pt-3 lg:pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm text-hm-text-muted hover:text-hm-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="lg:sticky lg:top-[var(--hm-header-offset)]">
            <div
              ref={imageFrameRef}
              role="button"
              tabIndex={0}
              aria-label={lensZoom ? 'Zoom out product image' : 'Zoom in product image'}
              onClick={handleImageClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setLensZoom((v) => !v)
                }
                if (e.key === 'Escape') setLensZoom(false)
              }}
              onMouseMove={handleImagePointerMove}
              onMouseLeave={() => setLensZoom(false)}
              className={cn(
                'relative overflow-hidden rounded-2xl border border-hm-border bg-hm-muted outline-none focus-visible:ring-2 focus-visible:ring-hm-accent',
                lensZoom ? 'cursor-zoom-out' : 'cursor-zoom-in',
              )}
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                draggable={false}
                className={cn(
                  'aspect-[5/4] max-h-[min(52svh,520px)] w-full object-cover select-none lg:aspect-auto lg:h-[min(68svh,620px)]',
                  'transition-transform duration-150 ease-out will-change-transform',
                  lensZoom ? 'scale-[2.4]' : 'scale-100',
                )}
                style={
                  lensZoom
                    ? { transformOrigin: `${lensOrigin.x}% ${lensOrigin.y}%` }
                    : { transformOrigin: '50% 50%' }
                }
              />
              <span
                className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-hm-elevated/95 shadow-sm"
                aria-hidden
              >
                {lensZoom ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
              </span>
              {product.tag ? (
                <span className="pointer-events-none absolute left-3 top-3 rounded-lg bg-hm-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                  {product.tag}
                </span>
              ) : null}
              {lensZoom ? (
                <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-medium text-white">
                  Move cursor to explore · click to exit
                </span>
              ) : null}
            </div>
            {product.images.length > 1 ? (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => {
                      setActiveImage(i)
                      setLensZoom(false)
                    }}
                    className={cn(
                      'overflow-hidden rounded-lg border-2',
                      activeImage === i ? 'border-hm-accent' : 'border-transparent',
                    )}
                  >
                    <img src={src} alt="" className="aspect-square w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex min-h-0 flex-col lg:pr-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-hm-accent">
              {product.category}
            </p>
            <h1 className="mt-1 font-display text-3xl leading-tight text-hm-text sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <StarRating rating={displayRating} size="md" />
              <span className="text-hm-text-muted">({displayReviewCount} reviews)</span>
              <span className="text-hm-text-muted">· {product.stock} in stock</span>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-2.5">
              <p className="text-2xl font-semibold text-hm-text sm:text-3xl">
                {formatCurrency(unitPrice)}
              </p>
              {displayCompareAt && displayCompareAt > unitPrice ? (
                <p className="pb-0.5 text-sm text-hm-text-subtle line-through">
                  {formatCurrency(displayCompareAt)}
                </p>
              ) : null}
              {displayOffer > 0 ? (
                <span className="mb-0.5 rounded-md bg-hm-offer-muted px-2 py-0.5 text-xs font-semibold text-hm-offer">
                  {displayOffer}% off
                </span>
              ) : null}
            </div>

            {hasCustomizedOption ? (
              <div className="mt-3 inline-flex w-fit rounded-xl border border-hm-border bg-hm-elevated p-1">
                <button
                  type="button"
                  onClick={() => setOptionType('product')}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-sm font-semibold transition',
                    optionType === 'product'
                      ? 'bg-hm-primary text-white'
                      : 'text-hm-text-muted hover:text-hm-text',
                  )}
                >
                  Product
                </button>
                <button
                  type="button"
                  onClick={selectCustomized}
                  className={cn(
                    'rounded-lg px-3.5 py-1.5 text-sm font-semibold transition',
                    optionType === 'customized'
                      ? 'bg-hm-primary text-white'
                      : 'text-hm-text-muted hover:text-hm-text',
                  )}
                >
                  Customized
                </button>
              </div>
            ) : null}

            {isCustomized ? (
              <div className="mt-3 rounded-xl border border-hm-border bg-hm-muted/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-hm-text-subtle">
                      Your customization
                    </p>
                    {hasCustomizationInput ? (
                      <div className="mt-2 flex items-start gap-2">
                        {customPhotoDataUrl ? (
                          <img
                            src={customPhotoDataUrl}
                            alt=""
                            className="h-12 w-12 shrink-0 rounded-lg object-cover"
                          />
                        ) : null}
                        <div className="min-w-0">
                          {customText ? (
                            <p className="text-sm text-hm-text">{customText}</p>
                          ) : null}
                          {customPhotoName ? (
                            <p className="mt-0.5 truncate text-xs text-hm-text-muted">
                              Photo: {customPhotoName}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1.5 text-sm text-hm-text-muted">
                        Upload a photo or enter text to personalize this gift.
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCustomizeOpen(true)}
                  >
                    {hasCustomizationInput ? 'Edit' : 'Customize'}
                  </Button>
                </div>
              </div>
            ) : null}

            <div className="mt-3 space-y-2">
              <p className="line-clamp-3 text-sm leading-relaxed text-hm-text-muted">
                {product.description}
              </p>
              {isCustomized && product.instruction ? (
                <div className="rounded-xl border border-hm-border bg-hm-muted/40 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-hm-text-subtle">
                    Customization instructions
                  </p>
                  <p className="mt-1.5 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-hm-text">
                    {product.instruction}
                  </p>
                </div>
              ) : null}
              {deliveryDays > 0 ? (
                <p className="text-sm text-hm-text">
                  <span className="font-semibold text-hm-primary">Delivery timeline:</span>{' '}
                  {deliveryDays} day{deliveryDays === 1 ? '' : 's'}
                  {isCustomized ? ' for customized order' : ''}
                </p>
              ) : null}
            </div>

            {Object.keys(product.variants || {}).length > 0 ? (
              <div className="mt-3 space-y-3">
                {Object.entries(product.variants || {}).map(([key, options]) => (
                  <div key={key}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-hm-text-subtle">
                      {key}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setVariants((v) => ({ ...v, [key]: opt }))}
                          className={cn(
                            'rounded-lg border px-3 py-1.5 text-sm',
                            variants[key] === opt
                              ? 'border-hm-primary bg-hm-primary text-white'
                              : 'border-hm-border text-hm-text hover:border-hm-accent',
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            <div className="mt-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-hm-text-subtle">
                Quantity
              </p>
              <div className="mt-1.5 inline-flex items-center rounded-xl border border-hm-border">
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center"
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {(product.personalization?.customText ||
              product.personalization?.uploadLogo ||
              product.personalization?.uploadImage) && (
              <div className="mt-3 rounded-xl border border-hm-border bg-hm-elevated p-3">
                <p className="text-sm font-semibold text-hm-text">Personalize (optional)</p>
                {product.personalization.customText ? (
                  <input
                    value={customText}
                    maxLength={product.personalization.maxChars}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Custom text"
                    className="mt-2 h-9 w-full rounded-lg border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent"
                  />
                ) : null}
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.personalization.uploadLogo ? (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-hm-border px-3 py-1.5 text-xs font-medium">
                      <Upload className="h-3.5 w-3.5" />
                      {logoName || 'Upload logo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setLogoName(e.target.files?.[0]?.name || '')}
                      />
                    </label>
                  ) : null}
                  {product.personalization.uploadImage ? (
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-hm-border px-3 py-1.5 text-xs font-medium">
                      <Upload className="h-3.5 w-3.5" />
                      {imageName || 'Upload image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setImageName(e.target.files?.[0]?.name || '')}
                      />
                    </label>
                  ) : null}
                </div>
              </div>
            )}

            <div className="mt-4 hidden gap-2.5 sm:grid sm:grid-cols-2">
              <Button variant="outline" size="lg" onClick={() => handleAddToBag('add')}>
                <ShoppingBag className="h-4 w-4" />
                Add to bag
              </Button>
              <Button variant="primary" size="lg" onClick={() => handleAddToBag('buy')}>
                <Zap className="h-4 w-4" />
                Buy now
              </Button>
            </div>

            <div className="mt-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setWishlisted((w) => !w)}
                className={cn(wishlisted && 'text-hm-accent')}
              >
                <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
                Wishlist
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  const url = window.location.href
                  if (navigator.share) {
                    try {
                      await navigator.share({ title: product.name, url })
                    } catch {
                      /* ignore */
                    }
                  } else await navigator.clipboard.writeText(url)
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <p className="mt-2 text-xs text-hm-text-muted">{shippingNote}</p>
          </div>
        </div>

        <section className="mt-16 border-t border-hm-border pt-10">
          <h2 className="font-display text-3xl text-hm-text">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-hm-text-muted">No reviews yet.</p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {reviews.map((r) => (
                <blockquote key={r.id} className="rounded-2xl border border-hm-border bg-hm-elevated p-5">
                  <p className="text-xs font-semibold text-hm-gold">{'★'.repeat(r.rating || 5)}</p>
                  <p className="mt-2 text-sm text-hm-text">“{r.text}”</p>
                  <footer className="mt-3 text-xs text-hm-text-muted">
                    {r.name} · {r.date}
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </section>

        {related.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-hm-text">Related gifts</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={{ ...p, image: p.images[0], occasion: p.occasion[0] }} />
              ))}
            </div>
          </section>
        ) : null}

        {recentlyViewed.length > 0 ? (
          <section className="mt-14">
            <h2 className="font-display text-3xl text-hm-text">Recently viewed</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recentlyViewed.map((p) => (
                <ProductCard key={p.id} product={{ ...p, image: p.images[0], occasion: p.occasion[0] }} />
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <CustomizeProductModal
        key={`${product.id}-${customizeOpen}`}
        open={customizeOpen}
        productName={product.name}
        initialText={customText}
        initialPhotoName={customPhotoName}
        initialPhotoDataUrl={customPhotoDataUrl}
        onClose={() => {
          setCustomizeOpen(false)
          setPendingCartAction(null)
        }}
        onContinue={handleCustomizeContinue}
      />

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-hm-border bg-hm-elevated/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg sm:hidden">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2">
          <Button variant="outline" size="lg" onClick={() => handleAddToBag('add')}>
            <ShoppingBag className="h-4 w-4" />
            Add
          </Button>
          <Button variant="primary" size="lg" onClick={() => handleAddToBag('buy')}>
            <Zap className="h-4 w-4" />
            Buy now
          </Button>
        </div>
      </div>
    </div>
  )
}
