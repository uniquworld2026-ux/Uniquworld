import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import {
  blogPosts,
  corporateClients,
  featuredCategories,
  giftIdeas,
  instagramPosts,
  occasionCollections,
  productRails,
  surprisePaths,
} from '@/storefront/data/home'
import { useFeaturedReviews, useStorefrontProducts } from '@/shared/catalog/useLiveCatalog'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'
import { SectionHeading } from '@/storefront/components/ui/SectionHeading'
import { Reveal } from '@/storefront/components/ui/Reveal'
import { Chip } from '@/storefront/components/ui/Chip'
import { Input } from '@/storefront/components/ui/Input'
import { GlassPanel } from '@/storefront/components/ui/GlassPanel'

const HOME_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80'

function SafeImg({ src, alt = '', className, loading = 'lazy', ...rest }) {
  return (
    <img
      src={src || HOME_FALLBACK_IMAGE}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        if (e.currentTarget.src !== HOME_FALLBACK_IMAGE) {
          e.currentTarget.src = HOME_FALLBACK_IMAGE
        }
      }}
      {...rest}
    />
  )
}

function ProductRail({ id, eyebrow, title, description, products, viewAllTo = '/categories' }) {
  return (
    <Section id={id} muted>
      <Container>
        <Reveal>
          <SectionHeading
            align="between"
            eyebrow={eyebrow}
            title={title}
            description={description}
            action={
              <Link to={viewAllTo}>
                <Button variant="outline" size="sm">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, i) => (
            <Reveal key={`${id}-${product.id}`} delay={i * 0.06}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

/** Prefer live catalog products (real admin images); fall back to curated static rails. */
function useHomeRailProducts(fallback = [], { featured, trending, newest, deals } = {}) {
  const { products = [], isLoading } = useStorefrontProducts()

  return useMemo(() => {
    if (!products.length) return { products: fallback, isLoading }

    let list = [...products]
    if (featured) list = list.filter((p) => p.featured)
    if (trending) list = list.filter((p) => p.trending || p.featured)
    if (deals) {
      list = list
        .filter((p) => Number(p.compareAt) > Number(p.price))
        .sort(
          (a, b) =>
            (Number(b.compareAt) - Number(b.price)) / Number(b.compareAt) -
            (Number(a.compareAt) - Number(a.price)) / Number(a.compareAt),
        )
    }
    if (newest) {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      )
    }
    if (!featured && !trending && !newest && !deals) {
      list = [...list].sort(
        (a, b) => Number(b.featured) - Number(a.featured) || Number(b.rating || 0) - Number(a.rating || 0),
      )
    }

    // If a filter emptied the rail, still show live catalog products.
    if (!list.length) {
      list = [...products].sort(
        (a, b) => Number(b.featured) - Number(a.featured) || Number(b.rating || 0) - Number(a.rating || 0),
      )
    }

    const mapped = list.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      compareAt: p.compareAt,
      tag: p.tag || (p.featured ? 'Featured' : p.trending ? 'Trending' : ''),
      occasion: Array.isArray(p.occasion) ? p.occasion[0] : p.occasion || p.category,
      rating: p.rating,
      image: p.images?.[0] || p.image,
      images: p.images,
    }))

    return {
      products: mapped.length ? mapped : fallback,
      isLoading,
    }
  }, [products, fallback, featured, trending, newest, deals, isLoading])
}

export function FeaturedCategories() {
  return (
    <Section id="featured-categories">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Collections"
            title="Featured categories"
            description="Quiet luxury paths — personalized, corporate, Uniquworld, and ceremonial."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={i * 0.05}>
              <Link
                to={cat.path}
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[3/4]"
              >
                <SafeImg
                  src={cat.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="font-display text-2xl text-white sm:text-3xl">{cat.title}</p>
                  <p className="mt-1 text-sm text-white/75">{cat.subtitle}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function PersonalizedBand() {
  return (
    <Section id="personalized-gifts" className="overflow-hidden py-0 sm:py-0 md:py-0">
      <div className="relative">
        <div className="absolute inset-0">
          <SafeImg
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-hm-bg/80 backdrop-blur-[2px]" />
        </div>
        <Container className="relative py-16 sm:py-20">
          <Reveal>
            <GlassPanel className="max-w-xl p-8 sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
                Personalized gifts
              </p>
              <h2 className="mt-3 font-display text-4xl text-hm-text sm:text-5xl">
                Make it unmistakably theirs
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-hm-text-muted sm:text-base">
                Names, photos, audio QR, engraving, and live preview — personalization without the
                chaos.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Name', 'Photo', 'Audio QR', 'Engraving'].map((label) => (
                  <Chip key={label} to="/personalized" className="bg-hm-elevated">
                    {label}
                  </Chip>
                ))}
              </div>
              <Link to="/personalized" className="mt-8 inline-block">
                <Button variant="primary">
                  Start personalizing <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </GlassPanel>
          </Reveal>
        </Container>
      </div>
    </Section>
  )
}

export function CorporateBand() {
  return (
    <Section id="corporate-gifts" className="overflow-hidden py-0 sm:py-0 md:py-0">
      <div className="relative">
        <div className="absolute inset-0">
          <SafeImg
            src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1800&q=80"
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-hm-primary/78" />
        </div>
        <Container className="relative flex flex-col items-start gap-6 py-20 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent-soft">
                Corporate gifts
              </p>
              <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl">
                Welcome kits to executive edits
              </h2>
              <p className="mt-4 text-sm text-white/75 sm:text-base">
                Bulk ordering, branding, GST invoices, and a dedicated account manager.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3">
              <Link to="/corporate">
                <Button variant="accent" size="lg">
                  Corporate gifts
                </Button>
              </Link>
              <Link to="/corporate/quote">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Request quote
                </Button>
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </Section>
  )
}

export function OccasionCollections() {
  return (
    <Section id="occasions">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Moments that matter"
            title="Wedding, birthday & beyond"
            description="Collections for ceremonies, celebrations, festivals, thank-yous, and every relationship."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {occasionCollections.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <Link
                to={item.path}
                className="group overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated"
              >
                <div className="aspect-[16/11] overflow-hidden">
                  <SafeImg
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-1.5 p-5">
                  <h3 className="font-display text-2xl text-hm-text">{item.title}</h3>
                  <p className="text-sm text-hm-text-muted">{item.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Chip to="/functions/wedding">Wedding</Chip>
          <Chip to="/festivals">Festivals</Chip>
          <Chip to="/thank-you">Thank you</Chip>
          <Chip to="/relationships">Relationships</Chip>
          <Chip to="/celebrations/anniversary">Anniversary</Chip>
        </div>
      </Container>
    </Section>
  )
}

export function SurpriseDual() {
  return (
    <Section id="surprise" muted>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Signature feature"
            title="Surprise, two ways"
            description="Book local experiences with city partners — or create a shareable digital surprise website."
          />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {surprisePaths.map((path, i) => (
            <Reveal key={path.id} delay={i * 0.08}>
              <Link
                to={path.path}
                className="group relative block overflow-hidden rounded-2xl border border-hm-border"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <SafeImg
                    src={path.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <h3 className="font-display text-3xl text-white sm:text-4xl">{path.title}</h3>
                  <p className="mt-2 max-w-md text-sm text-white/75">{path.hint}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-hm-accent-soft">
                    {path.cta} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function BestSellers() {
  const { products } = useHomeRailProducts(productRails.bestSellers, { featured: true })
  return (
    <ProductRail
      id="bestsellers"
      title="Best sellers"
      description="Loved pieces, packed with care."
      products={products}
    />
  )
}

export function NewArrivals() {
  const { products } = useHomeRailProducts(productRails.newArrivals, { newest: true })
  return (
    <ProductRail
      id="new-arrivals"
      eyebrow="Just landed"
      title="New arrivals"
      products={products}
    />
  )
}

export function TrendingProducts() {
  const { products } = useHomeRailProducts(productRails.trending, { trending: true })
  return (
    <ProductRail
      id="trending-products"
      eyebrow="In demand"
      title="Trending now"
      products={products}
    />
  )
}

export function TodaysDeals() {
  const { products } = useHomeRailProducts(productRails.deals, { deals: true })
  return (
    <ProductRail
      id="todays-deals"
      eyebrow="Limited"
      title="Today's deals"
      description="Quiet luxury, timed offers."
      products={products}
    />
  )
}

export function CorporateClients() {
  return (
    <Section id="corporate-clients" bordered className="py-10 sm:py-12 md:py-14">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-hm-text-subtle">
          Trusted by teams across India
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {corporateClients.map((name) => (
            <span
              key={name}
              className="font-display text-xl tracking-wide text-hm-text-subtle/80 sm:text-2xl"
            >
              {name}
            </span>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function ReviewsSection() {
  const { reviews, isLoading } = useFeaturedReviews(6)

  return (
    <Section id="reviews">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Trusted"
            title="Customer reviews"
            description="Stories from givers and receivers across India."
          />
        </Reveal>
        {isLoading ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-hm-muted" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-8 text-sm text-hm-text-muted">No customer reviews yet.</p>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {reviews.map((review, i) => (
              <Reveal key={review.id} delay={i * 0.06}>
                <blockquote className="h-full rounded-2xl border border-hm-border bg-hm-elevated p-6">
                  <p className="text-xs font-semibold text-hm-gold">
                    {'★'.repeat(review.rating || 5)}
                  </p>
                  <p className="mt-3 font-display text-xl leading-snug text-hm-text">
                    “{review.quote || review.text}”
                  </p>
                  <footer className="mt-5 text-sm text-hm-text-muted">
                    <span className="font-medium text-hm-text">{review.name}</span>
                    {review.place ? <> · {review.place}</> : null}
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

export function InstagramGallery() {
  return (
    <Section id="instagram" muted>
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="@uniquworld"
            title="Instagram gallery"
            description="Unboxings, décor, and quiet luxury in the wild."
          />
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.04}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-square overflow-hidden rounded-xl"
              >
                <SafeImg
                  src={post.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function BlogsSection() {
  return (
    <Section id="blogs">
      <Container>
        <Reveal>
          <SectionHeading
            align="between"
            eyebrow="Journal"
            title="Blogs"
            description="Guides for gifting with intention."
            action={
              <Link to="/blog">
                <Button variant="outline" size="sm">
                  All posts <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            }
          />
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.id} delay={i * 0.05}>
              <Link
                to={post.path}
                className="group overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <SafeImg
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="font-display text-2xl text-hm-text">{post.title}</h3>
                  <p className="text-sm text-hm-text-muted">{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function GiftIdeasStrip() {
  return (
    <Section id="gift-ideas" bordered className="py-10 sm:py-12 md:py-12">
      <Container>
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
              Gift ideas
            </p>
            <h2 className="mt-2 font-display text-3xl text-hm-text">Need a starting point?</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-end">
            {giftIdeas.map((idea) => (
              <Chip key={idea.id} to={idea.path}>
                {idea.label}
              </Chip>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export function NewsletterBand() {
  return (
    <Section id="newsletter" muted>
      <Container>
        <GlassPanel className="flex flex-col items-start gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-hm-text sm:text-4xl">Stay in the edit</h2>
            <p className="mt-2 max-w-md text-sm text-hm-text-muted">
              Festival drops, surprise ideas, and bestsellers — one thoughtful email a month.
            </p>
          </div>
          <form
            className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input type="email" required placeholder="Email address" aria-label="Email" />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
        </GlassPanel>
      </Container>
    </Section>
  )
}

/** Legacy exports kept for older imports */
export function ShopPaths() {
  return <SurpriseDual />
}

export function OccasionStrip() {
  return <GiftIdeasStrip />
}

export function HowItWorks() {
  return null
}
