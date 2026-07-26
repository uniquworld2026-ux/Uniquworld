import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Building2,
  Check,
  Package,
  PenLine,
  Truck,
  Users,
} from 'lucide-react'
import { useStorefrontProducts } from '@/shared/catalog/useLiveCatalog'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'

const HERO_IMG =
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=2000&q=80'

const solutions = [
  {
    id: 'welcome',
    title: 'Welcome kits',
    text: 'Onboarding hampers that feel considered — notebook, mug, treats, logo card.',
    image:
      'https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=1200&q=80',
    href: '/categories?occasion=welcome',
  },
  {
    id: 'festival',
    title: 'Festival packs',
    text: 'Diwali and year-end kits with calm packaging and optional branding.',
    image:
      'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?auto=format&fit=crop&w=1200&q=80',
    href: '/categories?occasion=festival',
  },
  {
    id: 'client',
    title: 'Client gifts',
    text: 'Refined objects for partners and VIPs — trays, keepsakes, curated boxes.',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    href: '/categories?category=Corporate%20Gifts',
  },
]

const steps = [
  {
    icon: Users,
    title: 'Tell us the brief',
    text: 'Quantity, budget, occasion, and city — 2 minutes.',
  },
  {
    icon: Package,
    title: 'We curate kits',
    text: 'Options with samples or mockups for logo placement.',
  },
  {
    icon: PenLine,
    title: 'Approve & brand',
    text: 'Add logo, insert cards, and packing preferences.',
  },
  {
    icon: Truck,
    title: 'We deliver',
    text: 'Single warehouse or multi-city shipping pan-India.',
  },
]

const perks = [
  'Logo & insert cards',
  'Bulk pricing from 10 units',
  'Pan-India dispatch',
  'Dedicated sales desk',
  'Festival pre-order windows',
  'Gift-ready packing',
]

export function CorporateGiftsPage() {
  const allProducts = useStorefrontProducts()
  const products = allProducts.filter(
    (p) => p.category === 'Corporate Gifts' || (p.occasion || []).includes('Corporate'),
  )

  return (
    <div>
      {/* Hero — full bleed, brand-first */}
      <section className="relative min-h-[78svh] overflow-hidden bg-hm-muted">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-hm-bg via-hm-bg/85 to-hm-bg/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-hm-bg via-transparent to-hm-bg/40" />

        <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:justify-center">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
              <Building2 className="h-3.5 w-3.5" />
              Corporate gifting
            </p>
            <p className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-hm-text sm:text-6xl md:text-7xl">
              Uniquworld
            </p>
            <h1 className="mt-5 text-balance text-lg font-medium leading-snug text-hm-text sm:text-xl md:text-2xl">
              Brand gifts that feel personal — for teams, clients, and milestones.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-hm-text-muted sm:text-base">
              Welcome kits, festival packs, and logo-ready hampers. Curated once, delivered at
              scale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/bulk-orders">
                <Button variant="primary" size="lg">
                  Request a quote
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#corporate-kits">
                <Button variant="outline" size="lg">
                  View kits
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3 sm:px-8">
          {[
            { label: 'Minimum order', value: '10 units' },
            { label: 'Quote turnaround', value: 'Within 24 hrs' },
            { label: 'Coverage', value: 'Pan-India shipping' },
          ].map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                {item.label}
              </p>
              <p className="mt-1 font-display text-2xl text-hm-text sm:text-3xl">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
            Solutions
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-hm-text sm:text-4xl md:text-5xl">
            Built for every corporate moment
          </h2>
          <p className="mt-3 text-sm text-hm-text-muted sm:text-base">
            Choose a path — we’ll tailor quantity, branding, and delivery.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {solutions.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="group overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft"
            >
              <div className="aspect-[16/11] overflow-hidden">
                <img
                  src={item.image}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-hm-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-hm-accent">
                  Explore
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="bg-hm-muted/45 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
              Process
            </p>
            <h2 className="mt-3 font-display text-3xl text-hm-text sm:text-4xl">
              From brief to doorstep
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="rounded-2xl border border-hm-border bg-hm-elevated p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-hm-accent/15 text-hm-accent">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="font-display text-2xl text-hm-accent/50">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-hm-text">{step.title}</h3>
                  <p className="mt-2 text-sm text-hm-text-muted">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Kits */}
      <section id="corporate-kits" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
              Kits
            </p>
            <h2 className="mt-2 font-display text-3xl text-hm-text sm:text-4xl">
              Corporate favourites
            </h2>
            <p className="mt-2 max-w-lg text-sm text-hm-text-muted">
              Ready to brand. Volume pricing unlocks from 10 units.
            </p>
          </div>
          <Link to="/bulk-orders">
            <Button variant="outline">
              Get custom quote
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{ ...p, image: p.images[0], occasion: p.occasion[0] }}
            />
          ))}
        </div>
      </section>

      {/* Perks + CTA split */}
      <section className="border-y border-hm-border bg-hm-elevated">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-2">
          <div className="px-5 py-14 sm:px-8 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
              Why Uniquworld
            </p>
            <h2 className="mt-3 font-display text-3xl text-hm-text sm:text-4xl">
              Enterprise polish. Atelier care.
            </h2>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2.5 text-sm text-hm-text">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hm-accent/20 text-hm-accent">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=80"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-hm-primary/70" />
            <div className="relative flex h-full flex-col justify-end p-8 sm:p-12">
              <h3 className="font-display text-3xl text-white sm:text-4xl">
                Ready for a quote?
              </h3>
              <p className="mt-3 max-w-sm text-sm text-white/80">
                Share quantity and budget — our desk replies within one business day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/bulk-orders">
                  <Button variant="accent" size="lg">
                    Start enquiry
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/35 text-white hover:bg-white/10"
                  >
                    Talk to sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
