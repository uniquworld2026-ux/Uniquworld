import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Section } from '@/storefront/components/ui/Section'

const REDIRECT_SECONDS = 6

/**
 * Shown for unknown routes. Auto-redirects home after a short countdown.
 */
export function NotFoundPage({ homePath = '/', homeLabel = 'Back home' }) {
  const navigate = useNavigate()
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS)

  useEffect(() => {
    if (secondsLeft <= 0) {
      navigate(homePath, { replace: true })
      return undefined
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [secondsLeft, navigate, homePath])

  return (
    <Section className="min-h-[70svh] pt-10">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-hm-accent">
          Error 404
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-hm-text sm:text-5xl md:text-6xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-hm-text-muted sm:text-base">
          The page you are looking for does not exist or has moved. You will be
          redirected to the home page in{' '}
          <span className="font-semibold text-hm-text">{secondsLeft}</span>{' '}
          {secondsLeft === 1 ? 'second' : 'seconds'}.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to={homePath}>
            <Button variant="primary">
              <Home className="h-4 w-4" />
              {homeLabel}
            </Button>
          </Link>
          <Link to="/categories">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Explore gifts
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  )
}
