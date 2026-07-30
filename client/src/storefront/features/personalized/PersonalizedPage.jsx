import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { giftCollectionGroups } from '@/storefront/features/personalized/giftCollectionGroups'
import { cn } from '@/shared/utils/cn'

/** @deprecated kept for imports — prefer giftCollectionGroups */
export const personalizedTypes = giftCollectionGroups.flatMap((g) =>
  g.items.slice(0, 1).map((it) => ({
    id: it.id,
    title: it.label,
    subtitle: g.title,
    path: it.path,
    image: g.image,
  })),
)

function SubCard({ item }) {
  return (
    <Link
      to={item.path}
      className="group flex min-h-[4.5rem] items-center justify-between gap-2 rounded-xl border border-hm-border bg-hm-elevated px-3.5 py-3 shadow-hm-soft transition duration-300 hover:-translate-y-0.5 hover:border-hm-accent/40 hover:shadow-hm-card sm:min-h-[5rem] sm:px-4"
    >
      <span className="text-sm font-semibold leading-snug text-hm-primary group-hover:text-hm-accent">
        {item.label}
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-hm-text-subtle transition group-hover:translate-x-0.5 group-hover:text-hm-accent" />
    </Link>
  )
}

function CollectionBlock({ group, reverse = false }) {
  return (
    <section
      id={group.id}
      className="scroll-mt-36 border-b border-hm-border py-10 last:border-0 sm:py-12"
    >
      <div
        className={cn(
          'grid gap-5 lg:grid-cols-12 lg:items-stretch lg:gap-6',
          reverse && 'lg:[&>*:first-child]:order-2',
        )}
      >
        {/* Large side card */}
        <Link
          to={group.path}
          className="group relative overflow-hidden rounded-2xl lg:col-span-4"
        >
          <div className="aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[280px]">
            <img
              src={group.image}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a2d4d]/90 via-[#0a2d4d]/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-2xl" aria-hidden>
              {group.emoji}
            </p>
            <h2 className="mt-1 font-display text-2xl tracking-tight text-white sm:text-3xl">
              {group.title}
            </h2>
            <p className="mt-1.5 line-clamp-2 text-sm text-white/75">{group.description}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-hm-accent-soft">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        {/* Small cards — 4 per row */}
        <div className="lg:col-span-8">
          <div className="mb-3 flex items-end justify-between gap-3 lg:hidden">
            <h2 className="font-display text-2xl text-hm-primary">
              <span className="mr-1.5" aria-hidden>
                {group.emoji}
              </span>
              {group.title}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4">
            {group.items.map((item) => (
              <SubCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function PersonalizedPage() {
  return (
    <div>
      <PageHero
        eyebrow="Personalized"
        title="Gift collections for every moment"
        description="Corporate kits, weddings, birthdays, handmade crafts, hampers, and more — pick a category, then a style. Four picks per row, ready to explore."
        actions={
          <>
            <Link to="/categories">
              <Button variant="primary">Shop all gifts</Button>
            </Link>
            <Link to="/personalized/studio">
              <Button variant="outline">Live preview studio</Button>
            </Link>
          </>
        }
      />

      {/* Quick jump chips */}
      <div className="sticky top-[var(--hm-header-offset,7.5rem)] z-20 border-b border-hm-border bg-hm-elevated/95 backdrop-blur-md">
        <Container className="py-2.5">
          <div className="flex gap-2 overflow-x-auto scrollbar-none [-webkit-overflow-scrolling:touch]">
            {giftCollectionGroups.map((g) => (
              <a
                key={g.id}
                href={`#${g.id}`}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-hm-border bg-hm-bg px-3 py-1.5 text-xs font-semibold text-hm-text-muted transition hover:border-hm-accent hover:text-hm-primary"
              >
                <span aria-hidden>{g.emoji}</span>
                {g.title.replace(/ Gifts$/, '').replace(/ & .*$/, '')}
              </a>
            ))}
          </div>
        </Container>
      </div>

      <Container className="pb-16 pt-2 sm:pb-20">
        {giftCollectionGroups.map((group, index) => (
          <CollectionBlock key={group.id} group={group} reverse={index % 2 === 1} />
        ))}
      </Container>
    </div>
  )
}
