import { Link } from 'react-router-dom'
import { Gift, Heart, Sparkles, Truck } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'
import { Reveal } from '@/storefront/components/ui/Reveal'
import { SocialLinks } from '@/storefront/components/layout/SocialLinks'
import surendarImg from '@/assets/owners/surendar.png'
import ranjithImg from '@/assets/owners/ranjith.jpg'
import gayathriImg from '@/assets/owners/gayu.jpg'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1400&q=80'

const pillars = [
  {
    icon: Gift,
    title: 'Thoughtful gifts',
    text: 'Curated keepsakes and hampers chosen for presence — not noise.',
  },
  {
    icon: Truck,
    title: 'Scheduled delivery',
    text: 'On-time dispatch across India so celebrations land exactly when they should.',
  },
  {
    icon: Sparkles,
    title: 'Personalised for them',
    text: 'Names, photos, engraving, and custom messages crafted to feel one-of-one.',
  },
]

const timeline = [
  {
    year: '2019',
    title: 'Studio beginnings',
    text: 'Uniquworld started as a small atelier for intentional, handcrafted gifts.',
  },
  {
    year: '2021',
    title: 'Personalisation studio',
    text: 'Photo gifts, engraving, and custom messaging became core to every order.',
  },
  {
    year: '2023',
    title: 'Corporate & surprise',
    text: 'Welcome kits, bulk gifting, and local surprise experiences joined the offering.',
  },
  {
    year: '2025',
    title: 'Pan-India reach',
    text: 'Premium gifting, nationwide delivery, and a growing celebration catalogue.',
  },
  {
    year: '2026',
    title: 'One celebration brand',
    text: 'Personalized, corporate, Uniquworld, and surprise — under one trusted roof.',
  },
]

const leaders = [
  {
    id: 'coo',
    name: 'Surendar B',
    role: 'Chief Operating Officer',
    shortRole: 'COO',
    bio: 'Owns operations, fulfilment, and partner networks so every celebration arrives on time with care.',
    image: surendarImg,
  },
  {
    id: 'cto',
    name: 'Ranjith Kumar C',
    role: 'Chief Technology Officer',
    shortRole: 'CTO',
    bio: 'Builds the digital experience — from personalisation tools to seamless checkout and delivery tracking.',
    image: ranjithImg,
  },
  {
    id: 'ceo',
    name: 'Gayathri B',
    role: 'Chief Executive Officer',
    shortRole: 'CEO',
    bio: 'Leads Uniquworld’s vision for premium, memory-led gifting — product, brand, and customer experience.',
    image: gayathriImg,
  },
]

const stats = [
  { value: '1M+', label: 'Moments gifted' },
  { value: '200+', label: 'Cities served' },
  { value: '50+', label: 'Celebration themes' },
  { value: '100%', label: 'Care in every box' },
]

/**
 * About Us — inspired by celebration-brand storytelling, built for Uniquworld.
 * @see https://www.fnp.com/info/about-us
 */
export function AboutPage() {
  return (
    <div>
      {/* How it all started */}
      <section className="relative overflow-hidden border-b border-hm-border">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#24131a]/92 via-[#24131a]/75 to-[#24131a]/35" />
        </div>
        <Container className="relative py-16 sm:py-20 md:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent-soft">
            About Uniquworld
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
            How it all started
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
            A quest for the perfect gift grew into a celebration brand. Uniquworld began with
            handcrafted pieces and a simple belief — every moment deserves something made with
            intention. Today we craft personalised keepsakes, corporate kits, and surprise
            experiences that turn gifting into lasting memory.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/categories">
              <Button variant="primary">Explore gifts</Button>
            </Link>
            <Link to="/corporate">
              <Button
                variant="outline"
                className="border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Corporate gifting
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Delivering love */}
      <Section muted>
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-hm-accent/15 text-hm-accent">
                <Heart className="h-7 w-7" />
              </div>
              <h2 className="mt-5 font-display text-3xl text-hm-text sm:text-4xl">
                Delivering love across India
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-hm-text-muted sm:text-base">
                Thoughtfully curated gifts travel to celebrations near and far — so love arrives
                even when you can’t be there in person.
              </p>
            </Reveal>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.05}>
                  <div className="rounded-2xl border border-hm-border bg-hm-elevated p-5 text-center shadow-hm-soft">
                    <p className="font-display text-3xl text-hm-primary sm:text-4xl">{item.value}</p>
                    <p className="mt-1 text-xs font-medium text-hm-text-muted sm:text-sm">
                      {item.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* The perfect surprise */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
              The perfect surprise
            </p>
            <h2 className="mt-2 font-display text-3xl text-hm-text sm:text-4xl">
              Crafted to feel one-of-one
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {pillars.map((item, i) => {
              const Icon = item.icon
              return (
                <Reveal key={item.title} delay={i * 0.06}>
                  <div className="h-full rounded-2xl border border-hm-border bg-hm-elevated p-6 shadow-hm-soft">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-hm-muted text-hm-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-hm-text">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">{item.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Vision & Mission */}
      <Section muted bordered>
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-hm-border bg-hm-elevated p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
                  Vision
                </p>
                <p className="mt-4 font-display text-2xl leading-snug text-hm-text sm:text-3xl">
                  Be the most trusted gifting brand for celebrating the joy of giving.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.06}>
              <div className="h-full rounded-2xl border border-hm-border bg-hm-elevated p-7 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
                  Mission
                </p>
                <p className="mt-4 font-display text-2xl leading-snug text-hm-text sm:text-3xl">
                  Wow every customer, every time — through premium products, personalisation, and a
                  people-first experience.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Timeline */}
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
              Our journey
            </p>
            <h2 className="mt-2 font-display text-3xl text-hm-text sm:text-4xl">
              Rooted in love, growing with you
            </h2>
          </div>
          <ol className="relative mx-auto mt-12 max-w-3xl space-y-0 border-l border-hm-border pl-6 sm:pl-8">
            {timeline.map((item, i) => (
              <li key={item.year} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[1.55rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-hm-accent bg-hm-elevated sm:-left-[2.05rem]">
                  <span className="h-2 w-2 rounded-full bg-hm-accent" />
                </span>
                <Reveal delay={i * 0.04}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-hm-primary">
                    {item.year}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-hm-text">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-hm-text-muted">{item.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Leadership team */}
      <Section id="team" muted bordered>
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
              The minds behind the magic
            </p>
            <h2 className="mt-2 font-display text-3xl text-hm-text sm:text-4xl">
              Meet our leadership
            </h2>
            <p className="mt-3 text-sm text-hm-text-muted sm:text-base">
              Three founders shaping Uniquworld with craft, operations, and technology.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((person, i) => (
              <Reveal key={person.id} delay={i * 0.07}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft">
                  <div className="relative aspect-[4/5] overflow-hidden bg-hm-muted">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 pt-16">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                        {person.shortRole}
                      </p>
                      <h3 className="mt-1 font-display text-2xl text-white">{person.name}</h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-sm font-semibold text-hm-primary">{person.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-hm-text-muted">{person.bio}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container>
          <div className="rounded-3xl border border-hm-border bg-gradient-to-br from-[#fff8f8] via-hm-elevated to-[#f3f7fb] px-6 py-12 text-center sm:px-10">
            <h2 className="font-display text-3xl text-hm-text sm:text-4xl">
              Ready to celebrate with Uniquworld?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-hm-text-muted">
              Explore personalised gifts, corporate kits, and surprise experiences crafted for
              unforgettable moments.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link to="/categories">
                <Button variant="primary">Shop gifts</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">Contact us</Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                Follow Uniquworld
              </p>
              <SocialLinks />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
