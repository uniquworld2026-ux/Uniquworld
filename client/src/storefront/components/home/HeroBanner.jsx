import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/shared/components/ui/Button'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { Container } from '@/storefront/components/ui/Container'
import { trendingCollections, occasions } from '@/storefront/data/home'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=80'

/**
 * FNP-style hero: horizontal rounded promo cards + occasion icon strip.
 */
export function HeroBanner() {
  const scrollerRef = useRef(null)

  function scrollBy(dir) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 520), behavior: 'smooth' })
  }

  return (
    <section className="overflow-x-clip pb-2 pt-4 sm:pt-5">
      <Container>
        <div className="relative overflow-hidden">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => scrollBy(-1)}
            className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hm-border bg-hm-elevated text-hm-text shadow-hm-soft hover:border-hm-accent md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => scrollBy(1)}
            className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-hm-border bg-hm-elevated text-hm-text shadow-hm-soft hover:border-hm-accent md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 scrollbar-none sm:gap-4"
          >
            <article className="relative flex min-h-[280px] w-[min(88%,22rem)] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-hm-border bg-gradient-to-br from-[#fff8f8] via-white to-[#f3f7fb] shadow-hm-elevated sm:min-h-[280px] sm:w-[70%] sm:flex-row lg:w-[58%]">
              <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-hm-accent/15 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 right-1/3 h-32 w-32 rounded-full bg-hm-primary/10 blur-3xl" />
              <div className="relative z-10 flex w-full flex-col justify-center p-5 sm:max-w-[55%] sm:p-8 md:p-10">
                <BrandLogo to={null} priority imgClassName="h-12 sm:h-14 md:h-16" />
                <h1 className="mt-3 text-base font-semibold leading-snug text-hm-text sm:text-lg md:text-xl">
                  India&apos;s most premium gifting experience.
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">
                  Personalized keepsakes, corporate kits, and unforgettable surprises — crafted to
                  feel one-of-one.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link to="/categories">
                    <Button variant="primary" size="sm">
                      Explore gifts
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link to="/surprise">
                    <Button variant="outline" size="sm">
                      <Play className="h-3.5 w-3.5" />
                      Plan a surprise
                    </Button>
                  </Link>
                </div>
              </div>
              <img
                src={HERO_IMAGE}
                alt=""
                className="relative mt-auto h-36 w-full object-cover sm:absolute sm:inset-y-0 sm:right-0 sm:mt-0 sm:h-full sm:w-[50%]"
                fetchPriority="high"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[50%] bg-gradient-to-r from-[#fff8f8] via-transparent to-transparent sm:block" />
            </article>

            {trendingCollections.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="group relative flex min-h-[240px] w-[min(78%,20rem)] shrink-0 snap-center overflow-hidden rounded-3xl border border-hm-border shadow-hm-card sm:min-h-[280px] sm:w-[52%] lg:w-[38%]"
              >
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-hm-primary/85 via-hm-accent/45 to-transparent" />
                <div className="relative z-10 flex w-full flex-col justify-end p-5 sm:p-8">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
                    Trending collections
                  </p>
                  <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">{item.title}</h2>
                  <p className="mt-1 text-sm text-white/80">{item.subtitle}</p>
                  <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-hm-primary">
                    Explore <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 flex gap-3 overflow-x-auto pb-2 scrollbar-none sm:mt-6 sm:justify-center sm:gap-5">
          {occasions.map((item, index) => {
            const tones = [
              'from-[#fde8e8] to-[#fff5f5]',
              'from-[#d8f3ee] to-[#eafaf7]',
              'from-[#e7eef6] to-[#f4f8fc]',
              'from-[#fff4d8] to-[#fffaf0]',
              'from-[#f8dede] to-[#fdf0f0]',
              'from-[#e4f5d8] to-[#f1fae8]',
            ]
            return (
              <Link
                key={item.id}
                to={item.path}
                className="group flex w-[76px] shrink-0 flex-col items-center gap-2 sm:w-[84px]"
              >
                <span
                  className={`flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-hm-border bg-gradient-to-br ${tones[index % tones.length]} shadow-hm-soft transition duration-300 group-hover:-translate-y-1 group-hover:border-hm-accent sm:h-[84px] sm:w-[84px]`}
                >
                  <span className="font-display text-2xl text-hm-primary sm:text-3xl">
                    {item.label.charAt(0)}
                  </span>
                </span>
                <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-hm-text sm:text-xs">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
