import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Pause, Play, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { formatINR } from '@/storefront/lib/commerce'
import {
  DIGITAL_PRICE_INR,
  getOccasionBySlug,
} from '@/storefront/features/digitalSurprise/occasions'
import {
  DEMO_TONE_STYLES,
  buildDemoSlides,
} from '@/storefront/features/digitalSurprise/demoSlides'
import { cn } from '@/shared/utils/cn'

const SLIDE_MS = 3200
const PREVIEW_KEY = (occasionId) => `uw_ds_preview_once_${occasionId}`

function markPreviewUsed(occasionId) {
  try {
    localStorage.setItem(PREVIEW_KEY(occasionId), '1')
  } catch {
    /* ignore */
  }
}

function FloatingEmoji({ items }) {
  const bits = useMemo(
    () =>
      items.map((emoji, i) => ({
        id: i,
        emoji,
        left: `${(i * 17 + 7) % 92}%`,
        delay: (i % 6) * 0.4,
        duration: 5 + (i % 4),
      })),
    [items],
  )

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute text-2xl opacity-70 sm:text-3xl"
          style={{ left: b.left, bottom: '-8%' }}
          animate={{ y: ['0%', '-115vh'], opacity: [0, 1, 0], rotate: [0, 25] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        >
          {b.emoji}
        </motion.span>
      ))}
    </div>
  )
}

/**
 * Full-screen demo preview — auto-moves through 8–12 emoji surprise pages.
 * Route: /surprise/digital/:occasionSlug/demo
 */
export function DigitalSurpriseDemoPage() {
  const { occasionSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [search] = useSearchParams()
  const occasion = getOccasionBySlug(occasionSlug)

  const name = location.state?.recipientName || search.get('name') || 'Alex'
  const sender = location.state?.senderName || search.get('from') || 'Uniquworld'
  const message = location.state?.message || ''

  const slides = useMemo(
    () =>
      buildDemoSlides({
        occasionId: occasion?.id || 'birthday',
        name,
        sender: message ? `${sender}` : sender,
      }).map((s, idx, arr) =>
        idx === arr.length - 3 && message
          ? { ...s, body: message }
          : s,
      ),
    [occasion?.id, name, sender, message],
  )

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const holdRef = useRef(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!occasion || startedRef.current) return
    startedRef.current = true
    markPreviewUsed(occasion.id)
  }, [occasion])

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(slides.length - 1, i + 1))
    setProgress(0)
  }, [slides.length])

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1))
    setProgress(0)
  }, [])

  useEffect(() => {
    if (paused || holdRef.current) return undefined
    const atEnd = index >= slides.length - 1
    if (atEnd) return undefined

    const started = Date.now()
    const tick = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / SLIDE_MS)
      setProgress(p)
      if (p >= 1) {
        clearInterval(tick)
        goNext()
      }
    }, 40)
    return () => clearInterval(tick)
  }, [index, paused, slides.length, goNext])

  if (!occasion) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-hm-bg px-5 text-center">
        <div>
          <h1 className="font-display text-3xl">Demo not found</h1>
          <Link to="/surprise/digital" className="mt-4 inline-block text-hm-accent">
            Back to Digital Surprise
          </Link>
        </div>
      </div>
    )
  }

  const slide = slides[index]
  const bg = DEMO_TONE_STYLES[slide.tone] || DEMO_TONE_STYLES.unlock
  const isLast = index === slides.length - 1
  const customizePath = `/surprise/digital/${occasion.slug}`

  const floatEmojis =
    occasion.id === 'diwali'
      ? ['🪔', '✨', '🎆', '🏮', '💫']
      : occasion.id === 'girlfriends_day'
        ? ['💖', '🌹', '✨', '🌸', '💌']
        : ['🎂', '🎈', '🎉', '🎁', '🌟']

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col text-white"
      style={{ background: bg }}
      onPointerDown={() => {
        holdRef.current = true
        setPaused(true)
      }}
      onPointerUp={() => {
        holdRef.current = false
        setPaused(false)
      }}
      onPointerLeave={() => {
        holdRef.current = false
        setPaused(false)
      }}
    >
      <FloatingEmoji items={floatEmojis} />

      {/* Progress rails */}
      <div className="relative z-20 flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-75 ease-linear"
              style={{
                width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Top chrome */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
            Demo preview · {index + 1}/{slides.length}
          </p>
          <p className="text-sm font-semibold text-white/90">{occasion.title}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={paused ? 'Play' : 'Pause'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
            onClick={(e) => {
              e.stopPropagation()
              setPaused((v) => !v)
            }}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label="Close demo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
            onClick={(e) => {
              e.stopPropagation()
              navigate(customizePath)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tap zones */}
      <div className="absolute inset-0 z-10 flex">
        <button type="button" className="h-full w-1/3" aria-label="Previous" onClick={goPrev} />
        <button
          type="button"
          className="h-full w-2/3"
          aria-label="Next"
          onClick={() => (isLast ? navigate(customizePath) : goNext())}
        />
      </div>

      {/* Slide content */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 pb-28 text-center pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title + index}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -16 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="max-w-lg"
          >
            <motion.div
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 text-5xl shadow-lg backdrop-blur sm:h-28 sm:w-28 sm:text-6xl"
              animate={{ rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              {slide.emoji}
            </motion.div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
              Uniquworld surprise
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="relative z-20 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-auto">
        <div
          className={cn(
            'mx-auto flex max-w-md flex-col gap-2 rounded-2xl border border-white/20 bg-black/35 p-3 backdrop-blur-md sm:flex-row sm:items-center',
          )}
        >
          <p className="flex-1 px-1 text-left text-xs text-white/80">
            {isLast
              ? 'Loved it? Unlock your private interactive page.'
              : 'Auto-playing demo · tap sides to move · hold to pause'}
          </p>
          <Button
            type="button"
            variant="primary"
            className="shrink-0 gap-1.5"
            onClick={() => navigate(customizePath)}
          >
            {isLast ? `Pay now · ${formatINR(DIGITAL_PRICE_INR)}` : 'Skip to create'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
