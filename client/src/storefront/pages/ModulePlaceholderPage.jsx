import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'

/**
 * Premium placeholder for modules under active development.
 * Keeps routes live so IA / nav / SEO structure can ship early.
 */
export function ModulePlaceholderPage({
  title,
  eyebrow = 'Coming soon',
  description = 'This experience is being crafted with the same care as our gifts. Check back shortly.',
  nextModule,
  links = [],
}) {
  return (
    <Section className="min-h-[70svh] pt-10">
      <Container className="max-w-3xl text-center">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
          <Sparkles className="h-3.5 w-3.5" />
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-hm-text sm:text-5xl md:text-6xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-hm-text-muted sm:text-base">
          {description}
        </p>

        {links.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="rounded-full border border-hm-border bg-hm-elevated px-4 py-2 text-xs font-semibold text-hm-text transition hover:border-hm-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Button>
          </Link>
          <Link to="/categories">
            <Button variant="primary">Explore gifts</Button>
          </Link>
        </div>

        {nextModule ? (
          <p className="mt-10 text-xs text-hm-text-subtle">
            Next build module: <span className="text-hm-accent">{nextModule}</span>
          </p>
        ) : null}
      </Container>
    </Section>
  )
}
