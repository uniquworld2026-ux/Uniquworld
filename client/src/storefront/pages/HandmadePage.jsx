import { Link } from 'react-router-dom'
import {
  ArrowRight,
  HandHeart,
  IndianRupee,
  Package,
  Sparkles,
  Store,
  Users,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { cn } from '@/shared/utils/cn'

const HERO_IMG = '/gifts/handmade.jpg'

const GALLERY = [
  {
    src: '/gifts/craft.jpg',
    label: 'Hand-painted keepsakes',
  },
  {
    src: '/gifts/pottery.jpg',
    label: 'Home pottery & clay',
  },
  {
    src: '/gifts/textile.jpg',
    label: 'Textile & embroidery',
  },
  {
    src: '/gifts/ceramic.jpg',
    label: 'Ceramic & clay craft',
  },
]

const STEPS = [
  {
    icon: HandHeart,
    title: 'Create at home',
    text: 'Turn your craft — art, décor, jewellery, candles, gifts — into products the world can love.',
  },
  {
    icon: Store,
    title: 'List on Uniquworld',
    text: 'Open your maker storefront on our platform. We handle discovery, checkout, and gifting flow.',
  },
  {
    icon: IndianRupee,
    title: 'Earn from craftology',
    text: 'Sell what you make, grow with community support, and build income from your handmade skill.',
  },
]

const PILLARS = [
  {
    title: 'Maker marketplace',
    text: 'A dedicated Handmade lane for home creators and small studios — not factory bulk.',
  },
  {
    title: 'Craftology stories',
    text: 'Share how each piece is made. Buyers gift the story, not just the product.',
  },
  {
    title: 'Community boost',
    text: 'Future tools to crowdfund limited drops, pre-orders, and maker campaigns.',
  },
  {
    title: 'Ship with care',
    text: 'Gift-ready packing and nationwide delivery so your craft arrives like a moment.',
  },
]

/**
 * Handmade hub — coming soon marketplace for home makers & craft sellers.
 */
export function HandmadePage() {
  return (
    <div>
      {/* Hero — full bleed, brand + coming soon */}
      <section className="relative min-h-[min(78svh,640px)] overflow-hidden">
        <img
          src={HERO_IMG}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a2d4d]/92 via-[#0a2d4d]/75 to-[#0a2d4d]/35" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(217,44,43,0.25),transparent_60%)]" />

        <div className="relative mx-auto flex min-h-[min(78svh,640px)] max-w-7xl flex-col justify-end px-5 pb-12 pt-24 sm:px-8 sm:pb-16">
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-hm-accent-soft" />
            Coming soon
          </p>
          <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.5rem,6vw,4.25rem)] leading-[1.05] tracking-tight text-white">
            Handmade
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Create at home. Sell on Uniquworld. Earn from your craftology — a platform for makers to
            turn handmade gifts into real income.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contact">
              <Button variant="primary" className="min-h-11 bg-hm-accent hover:bg-hm-accent-soft">
                Join the waitlist
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                variant="outline"
                className="min-h-11 border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              >
                Browse gifts meanwhile
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Idea */}
      <section className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
            The idea
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl tracking-tight text-hm-primary sm:text-4xl">
            Everyone can make. Everyone can sell.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-hm-text-muted sm:text-base">
            Uniquworld Handmade is for people who create from home — artists, hobbyists, and small
            craft studios. List your products, reach gift shoppers nationwide, and earn money from
            the work you already love. Think craftology meets marketplace: your skill, our platform.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className={cn(
                    'relative pt-1',
                    'animate-[hm-fade-up_0.5s_ease-out_both]',
                    i === 1 && '[animation-delay:80ms]',
                    i === 2 && '[animation-delay:160ms]',
                  )}
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-hm-accent/10 text-hm-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-hm-text-subtle">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1.5 text-lg font-semibold text-hm-primary">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">{step.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="border-b border-hm-border">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
                Craft in focus
              </p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-hm-primary sm:text-4xl">
                What makers will bring
              </h2>
            </div>
            <p className="max-w-sm text-sm text-hm-text-muted">
              A taste of the handmade world — pottery, paint, textile, and studio craft. Full
              catalog launches soon.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {GALLERY.map((item, i) => (
              <figure
                key={item.label}
                className={cn(
                  'group relative overflow-hidden rounded-2xl',
                  i % 2 === 1 ? 'mt-0 sm:mt-8' : '',
                )}
              >
                <div className="aspect-[4/5] overflow-hidden bg-hm-muted">
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    onError={(e) => {
                      e.currentTarget.src = '/gifts/handmade.jpg'
                    }}
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-12">
                  <span className="text-sm font-medium text-white">{item.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="border-b border-hm-border bg-[radial-gradient(ellipse_70%_50%_at_10%_0%,rgba(217,44,43,0.06),transparent_50%),radial-gradient(ellipse_60%_40%_at_90%_100%,rgba(10,45,77,0.06),transparent_45%),var(--hm-bg)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-hm-accent" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
              Built for makers
            </p>
          </div>
          <h2 className="mt-3 max-w-xl font-display text-3xl tracking-tight text-hm-primary sm:text-4xl">
            Platform tools, coming with Handmade
          </h2>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {PILLARS.map((item) => (
              <div key={item.title} className="border-l-2 border-hm-accent/40 pl-5">
                <h3 className="text-lg font-semibold text-hm-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming soon CTA */}
      <section className="relative overflow-hidden bg-hm-primary text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-hm-accent/25 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent-soft">
              <Package className="h-3.5 w-3.5" />
              Launching soon
            </p>
            <h2 className="mt-3 font-display text-3xl tracking-tight sm:text-4xl">
              Be first when Handmade opens
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75 sm:text-base">
              Makers and early buyers — tell us you&apos;re interested. We&apos;ll invite you when
              listing, selling, and craftology campaigns go live.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link to="/contact">
              <Button variant="primary" className="min-h-11 bg-hm-accent hover:bg-hm-accent-soft">
                I&apos;m a maker
              </Button>
            </Link>
            <Link to="/">
              <Button
                variant="outline"
                className="min-h-11 border-white/35 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
