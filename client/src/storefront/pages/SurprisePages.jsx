import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Navigation,
  Sparkles,
  Star,
} from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'
import { Reveal } from '@/storefront/components/ui/Reveal'
import { SectionHeading } from '@/storefront/components/ui/SectionHeading'
import { ModulePlaceholderPage } from '@/storefront/pages/ModulePlaceholderPage'
import { surprisePaths } from '@/storefront/data/home'
import {
  CHENNAI_CITY,
  chennaiLocationAreas,
  chennaiLocationCategories,
  chennaiSurpriseLocations,
  googleMapsEmbedUrl,
  googleMapsSearchUrl,
} from '@/storefront/data/chennaiSurpriseLocations'
import { cn } from '@/shared/utils/cn'

const HUB_HERO =
  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80'

export function SurpriseHubPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-hm-border">
        <div className="absolute inset-0">
          <img src={HUB_HERO} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24131a]/92 via-[#24131a]/72 to-[#24131a]/40" />
        </div>
        <Container className="relative py-16 sm:py-20 md:py-24">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent-soft">
            <Sparkles className="h-3.5 w-3.5" />
            Uniquworld Surprise
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            Surprise, two ways
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            Book a local experience with Chennai partners — or craft a shareable digital surprise
            website in minutes.
          </p>
        </Container>
      </section>

      <Section>
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Choose your path"
              title="How do you want to surprise them?"
              description="Pick Local for in-city décor and experiences, or Digital for a personalised website they can open anywhere."
            />
          </Reveal>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {surprisePaths.map((path, i) => (
              <Reveal key={path.id} delay={i * 0.08}>
                <Link
                  to={path.path}
                  className="group relative block overflow-hidden rounded-2xl border border-hm-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hm-ring"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={path.image}
                      alt=""
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-hm-accent-soft">
                      Option {i + 1}
                    </p>
                    <h2 className="mt-1 font-display text-3xl text-white sm:text-4xl">{path.title}</h2>
                    <p className="mt-2 max-w-md text-sm text-white/75">{path.hint}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-hm-accent-soft">
                      {path.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  )
}

export function LocalSurprisePage() {
  const [area, setArea] = useState('All areas')
  const [category, setCategory] = useState('All types')
  const [selectedId, setSelectedId] = useState(chennaiSurpriseLocations[0]?.id)

  const filtered = useMemo(() => {
    return chennaiSurpriseLocations.filter((loc) => {
      const areaOk = area === 'All areas' || loc.area === area
      const typeOk = category === 'All types' || loc.category === category
      return areaOk && typeOk
    })
  }, [area, category])

  const selected =
    filtered.find((loc) => loc.id === selectedId) || filtered[0] || chennaiSurpriseLocations[0]

  const mapSrc = selected
    ? googleMapsEmbedUrl({ lat: selected.lat, lng: selected.lng, zoom: 15 })
    : googleMapsEmbedUrl({ ...CHENNAI_CITY, zoom: CHENNAI_CITY.zoom })

  const openMaps = (loc) => {
    window.open(googleMapsSearchUrl(loc), '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <section className="border-b border-hm-border bg-hm-muted/40 py-10 sm:py-12">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
            Local Surprise · Chennai only
          </p>
          <h1 className="mt-2 font-display text-4xl tracking-tight text-hm-text sm:text-5xl">
            Local Surprises in Chennai
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-hm-text-muted sm:text-base">
            Real Chennai venues for décor, proposals, dinners, and photo moments. Tap a card to
            preview the map — open Google Maps for directions.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-hm-text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-hm-border bg-hm-elevated px-3 py-1.5 font-medium text-hm-text">
              <MapPin className="h-3.5 w-3.5 text-hm-accent" />
              {chennaiSurpriseLocations.length} locations · Chennai, Tamil Nadu
            </span>
            <Link
              to="/surprise"
              className="font-semibold text-hm-primary underline-offset-2 hover:underline"
            >
              ← All surprise options
            </Link>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {chennaiLocationAreas.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setArea(item)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition',
                    area === item
                      ? 'border-hm-accent bg-hm-accent-muted text-hm-text'
                      : 'border-hm-border bg-hm-bg text-hm-text-muted hover:border-hm-accent',
                  )}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="flex items-center gap-2 text-xs text-hm-text-muted">
              Type
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-9 rounded-lg border border-hm-border bg-hm-elevated px-3 text-sm text-hm-text outline-none focus:border-hm-accent"
              >
                {chennaiLocationCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft">
                <div className="flex items-center justify-between gap-3 border-b border-hm-border px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-hm-text">{selected.name}</p>
                    <p className="truncate text-xs text-hm-text-muted">
                      {selected.area}, Chennai · {selected.lat.toFixed(4)}, {selected.lng.toFixed(4)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openMaps(selected)}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Open Maps
                  </Button>
                </div>
                <div className="relative aspect-[4/3] w-full bg-hm-muted sm:aspect-[16/11]">
                  <iframe
                    key={selected.id}
                    title={`Google Map — ${selected.name}, Chennai`}
                    src={mapSrc}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="border-t border-hm-border px-4 py-3 text-xs text-hm-text-muted">
                  Live Google Map embed for this Chennai pin. Use Open Maps for turn-by-turn
                  directions.
                </div>
              </div>
            </Reveal>

            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="rounded-2xl border border-hm-border bg-hm-elevated p-8 text-center text-sm text-hm-text-muted">
                  No locations match these filters. Try another area or type.
                </p>
              ) : (
                filtered.map((loc, i) => {
                  const active = loc.id === selected.id
                  return (
                    <Reveal key={loc.id} delay={Math.min(i, 6) * 0.04}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(loc.id)}
                        className={cn(
                          'group flex w-full gap-3 rounded-2xl border p-3 text-left transition sm:gap-4 sm:p-4',
                          active
                            ? 'border-hm-accent bg-hm-accent-muted/40 shadow-hm-soft'
                            : 'border-hm-border bg-hm-elevated hover:border-hm-accent/50',
                        )}
                      >
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-hm-muted sm:h-24 sm:w-24">
                          <img
                            src={loc.image}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-hm-text">{loc.name}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-hm-text-muted">
                                <MapPin className="h-3 w-3 shrink-0 text-hm-accent" />
                                {loc.area} · {loc.category}
                              </p>
                            </div>
                            <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold text-hm-text">
                              <Star className="h-3 w-3 fill-hm-accent text-hm-accent" />
                              {loc.rating}
                            </span>
                          </div>
                          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-hm-text-muted sm:text-sm">
                            {loc.blurb}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {loc.bestFor.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full border border-hm-border bg-hm-bg px-2 py-0.5 text-[10px] font-medium text-hm-text-muted"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span
                              className={cn(
                                'inline-flex items-center gap-1 text-xs font-semibold',
                                active ? 'text-hm-primary' : 'text-hm-text-muted',
                              )}
                            >
                              <Navigation className="h-3.5 w-3.5" />
                              {active ? 'Showing on map' : 'Show on map'}
                            </span>
                            <a
                              href={googleMapsSearchUrl(loc)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-hm-accent hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Google Maps
                            </a>
                          </div>
                        </div>
                      </button>
                    </Reveal>
                  )
                })
              )}
            </div>
          </div>

          {selected ? (
            <div className="mt-10 rounded-2xl border border-hm-border bg-hm-muted/30 p-5 sm:p-6">
              <h2 className="font-display text-2xl text-hm-text">{selected.name}</h2>
              <p className="mt-1 text-sm text-hm-text-muted">{selected.address}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-hm-text-muted">
                {selected.blurb}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {selected.bestFor.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-hm-border bg-hm-elevated px-3 py-1 text-xs font-medium text-hm-text"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button type="button" variant="primary" onClick={() => openMaps(selected)}>
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps
                </Button>
                <Link to="/surprise/digital">
                  <Button type="button" variant="outline">
                    Try Digital Surprise
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </Container>
      </Section>
    </div>
  )
}

export function DigitalSurprisePage() {
  return (
    <ModulePlaceholderPage
      title="Digital Surprise"
      eyebrow="Shareable magic"
      description="Plans from ₹99 — love stories, countdowns, photo memories, QR share, and gift-reveal animations."
      nextModule="Digital Surprise — Plans & Studio"
      links={[
        { label: 'Local Surprise · Chennai', path: '/surprise/local' },
        { label: 'All surprise options', path: '/surprise' },
      ]}
    />
  )
}
