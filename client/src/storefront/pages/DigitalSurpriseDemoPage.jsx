import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ArrowRight, Link2, Pause, Play, Share2, X } from 'lucide-react'
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
import { DigitalSurpriseExperience } from '@/storefront/features/digitalSurprise/DigitalSurpriseExperience'
import { YoutubeBackgroundMusic } from '@/storefront/features/digitalSurprise/YoutubeBackgroundMusic'
import { BACKGROUND_TRACKS } from '@/storefront/features/digitalSurprise/musicTracks'
import { cn } from '@/shared/utils/cn'

const SLIDE_MS = 3800

function fireConfetti() {
  const end = Date.now() + 900
  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: ['#d92c2b', '#d4af37', '#ffffff', '#f9a8d4'],
    })
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: ['#d92c2b', '#d4af37', '#ffffff', '#f9a8d4'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

function FloatingBits({ emojis }) {
  const bits = useMemo(
    () =>
      emojis.map((emoji, i) => ({
        id: i,
        emoji,
        left: `${(i * 13 + 5) % 94}%`,
        delay: (i % 7) * 0.35,
        duration: 6 + (i % 5),
        size: 18 + (i % 14),
      })),
    [emojis],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute opacity-80"
          style={{ left: b.left, bottom: '-10%', fontSize: b.size }}
          animate={{ y: ['0%', '-120vh'], opacity: [0, 1, 0], rotate: [0, 40] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        >
          {b.emoji}
        </motion.span>
      ))}
    </div>
  )
}

function SparkleField() {
  const dots = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        top: `${(i * 37) % 100}%`,
        left: `${(i * 53) % 100}%`,
        delay: (i % 10) * 0.2,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute h-1 w-1 rounded-full bg-white"
          style={{ top: d.top, left: d.left }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [0.6, 1.6, 0.6] }}
          transition={{ duration: 1.8, delay: d.delay, repeat: Infinity }}
        />
      ))}
    </div>
  )
}

/**
 * Full-screen sharable demo — 8 auto-moving pages with images + motion.
 * /surprise/digital/:occasionSlug/demo?name=Priya&from=Rahul
 */
export function DigitalSurpriseDemoPage() {
  const { occasionSlug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useSearchParams()
  const occasion = getOccasionBySlug(occasionSlug)

  const name = location.state?.recipientName || search.get('name') || 'Alex'
  const sender = location.state?.senderName || search.get('from') || 'Uniquworld'
  const message = location.state?.message || search.get('msg') || ''
  const templateId = location.state?.templateId || search.get('template') || ''
  const musicUrl =
    location.state?.musicUrl ||
    search.get('music') ||
    (occasion?.id === 'birthday' ? BACKGROUND_TRACKS.find((t) => t.id === 'birthday-piano')?.url : '') ||
    ''

  const slides = useMemo(() => {
    const base = buildDemoSlides({
      occasionId: occasion?.id || 'birthday',
      name,
      sender,
    })
    if (!message) return base
    return base.map((s, i) => (i === 5 ? { ...s, body: message } : s))
  }, [occasion?.id, name, sender, message])

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const holdRef = useRef(false)
  const confettiFor = useRef(-1)

  // Lock page scroll while demo is open
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // Keep URL sharable (name/from in query)
  useEffect(() => {
    if (!occasion) return
    const next = new URLSearchParams(search)
    if (name && name !== 'Alex') next.set('name', name)
    if (sender && sender !== 'Uniquworld') next.set('from', sender)
    if (message) next.set('msg', message.slice(0, 180))
    const a = next.toString()
    const b = search.toString()
    if (a !== b) setSearch(next, { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [occasion?.id])

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
    if (index >= slides.length - 1) return undefined
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

  const slide = slides[index]
  useEffect(() => {
    if (!slide) return
    if (slide.effect === 'confetti' && confettiFor.current !== index) {
      confettiFor.current = index
      fireConfetti()
    }
  }, [index, slide])

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined' || !occasion) return ''
    const u = new URL(`${window.location.origin}/surprise/digital/${occasion.slug}/demo`)
    u.searchParams.set('name', name)
    u.searchParams.set('from', sender)
    if (message) u.searchParams.set('msg', message.slice(0, 180))
    if (templateId) u.searchParams.set('template', templateId)
    if (musicUrl) u.searchParams.set('music', musicUrl)
    return u.toString()
  }, [occasion, name, sender, message, templateId, musicUrl])

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* ignore */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${occasion?.title || 'Surprise'} demo`,
          text: `Watch this Uniquworld surprise demo for ${name}`,
          url: shareUrl,
        })
        return
      } catch {
        /* fall through */
      }
    }
    copyShareLink()
  }

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

  const customizePath = `/surprise/digital/${occasion.slug}`

  if (templateId) {
    return (
      <div className="flex h-svh max-h-svh flex-col overflow-hidden bg-[#f7c6d4]">
        <div className="z-40 flex shrink-0 items-center justify-between gap-2 px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] sm:gap-3 sm:px-4 sm:py-3">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#be123c]/80 sm:text-[10px]">
              Full interactive demo · 6 cards
            </p>
            <p className="truncate text-xs font-semibold text-[#9f1239] sm:text-sm">
              {occasion.templates.find((t) => t.id === templateId)?.name || occasion.title}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Share demo"
              className="inline-flex h-9 items-center gap-1 rounded-full bg-white/80 px-2.5 text-xs font-semibold text-[#9f1239] sm:px-3"
              onClick={nativeShare}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              type="button"
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#9f1239]"
              onClick={() => navigate(customizePath)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DigitalSurpriseExperience
            templateId={templateId}
            recipientName={name}
            senderName={sender}
            message={message || occasion.headline}
            preview
            media={musicUrl ? { musicUrl } : undefined}
          />
        </div>
        <div className="shrink-0 px-3 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-1 sm:px-4 sm:pt-2">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-2 rounded-2xl border border-white/70 bg-white/90 p-2 shadow-lg sm:gap-3 sm:p-3">
            <p className="hidden text-xs text-[#7a3148] sm:block">
              Play every card: Yes / No, then Click me through the story.
            </p>
            <p className="text-[11px] text-[#7a3148] sm:hidden">Tap Yes, then Click me</p>
            <Button type="button" variant="primary" size="sm" className="shrink-0 gap-1.5" onClick={() => navigate(customizePath)}>
              Create
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const overlay = DEMO_TONE_STYLES[slide.tone] || DEMO_TONE_STYLES.unlock
  const isLast = index === slides.length - 1
  const floatEmojis =
    occasion.id === 'diwali'
      ? ['🪔', '✨', '🎆', '🏮', '💫', '🙏']
      : occasion.id === 'girlfriends_day'
        ? ['💖', '🌹', '✨', '🌸', '💌', '🥰']
        : ['🎂', '🎈', '🎉', '🎁', '🌟', '✨']

  return (
    <div
      className="relative flex min-h-svh w-full flex-col overflow-hidden bg-black text-white"
      onPointerDown={() => {
        holdRef.current = true
        setPaused(true)
      }}
      onPointerUp={() => {
        holdRef.current = false
        setPaused(false)
      }}
      onPointerCancel={() => {
        holdRef.current = false
        setPaused(false)
      }}
    >
      {/* Full-bleed image with Ken Burns */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image + index}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        >
          <motion.img
            src={slide.image}
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.08 }}
            animate={{
              scale: slide.effect === 'kenburns' ? [1.08, 1.18] : [1.05, 1.1],
            }}
            transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
          />
          <div className="absolute inset-0" style={{ background: overlay }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/35" />
        </motion.div>
      </AnimatePresence>

      {(slide.effect === 'float' || slide.effect === 'pulse' || slide.effect === 'confetti') && (
        <FloatingBits emojis={floatEmojis} />
      )}
      {slide.effect === 'sparkle' && <SparkleField />}

      {/* Progress */}
      <div className="relative z-30 flex gap-1.5 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white"
              style={{
                width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      {/* Chrome */}
      <div className="relative z-30 flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
            Sharable demo · {index + 1}/8
          </p>
          <p className="truncate text-sm font-semibold">{occasion.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            aria-label="Share demo"
            className="inline-flex h-9 items-center gap-1 rounded-full bg-white/15 px-3 text-xs font-semibold backdrop-blur"
            onClick={(e) => {
              e.stopPropagation()
              nativeShare()
            }}
          >
            <Share2 className="h-3.5 w-3.5" />
            {copied ? 'Copied' : 'Share'}
          </button>
          <button
            type="button"
            aria-label="Copy link"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur"
            onClick={(e) => {
              e.stopPropagation()
              copyShareLink()
            }}
          >
            <Link2 className="h-4 w-4" />
          </button>
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
            aria-label="Close"
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
      <div className="absolute inset-0 z-20 flex">
        <button type="button" className="h-full w-[32%]" aria-label="Previous" onClick={goPrev} />
        <button
          type="button"
          className="h-full w-[68%]"
          aria-label="Next"
          onClick={() => (isLast ? navigate(customizePath) : goNext())}
        />
      </div>

      {/* Content */}
      <div className="pointer-events-none relative z-30 flex flex-1 flex-col items-center justify-center px-6 pb-32 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${slide.title}-${index}`}
            initial={{ opacity: 0, y: 28, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            className="max-w-lg"
          >
            <motion.div
              className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/15 text-5xl shadow-[0_0_40px_rgba(255,255,255,0.15)] backdrop-blur-md sm:h-28 sm:w-28 sm:text-6xl"
              animate={
                slide.effect === 'pulse'
                  ? { scale: [1, 1.1, 1] }
                  : { rotate: [0, -6, 6, 0], scale: [1, 1.05, 1] }
              }
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {slide.emoji}
            </motion.div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              Uniquworld surprise
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight drop-shadow-lg sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/90 sm:text-lg">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div
          className={cn(
            'mx-auto flex max-w-lg flex-col gap-2 rounded-2xl border border-white/20 bg-black/45 p-3 shadow-2xl backdrop-blur-md sm:flex-row sm:items-center',
          )}
        >
          <p className="flex-1 px-1 text-left text-xs leading-snug text-white/80">
            {isLast
              ? 'Loved this demo? Unlock a private interactive page for them.'
              : 'Auto-playing · hold to pause · share this link with anyone'}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
              onClick={nativeShare}
            >
              Share demo
            </Button>
            <Button type="button" variant="primary" className="gap-1.5" onClick={() => navigate(customizePath)}>
              {isLast ? `Pay now · ${formatINR(DIGITAL_PRICE_INR)}` : 'Create'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <YoutubeBackgroundMusic url={musicUrl} />
    </div>
  )
}
