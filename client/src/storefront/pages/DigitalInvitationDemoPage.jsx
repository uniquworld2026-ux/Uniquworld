import { useMemo, useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Share2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import {
  getInvitationBySlug,
  INVITATION_PRICE_INR,
} from '@/storefront/features/digitalInvitation/occasions'
import {
  buildInvitationDemoSlides,
  INVITATION_DEMO_TONES,
} from '@/storefront/features/digitalInvitation/demoSlides'
import { formatINR } from '@/storefront/lib/commerce'

const SLIDE_MS = 4200

/**
 * /surprise/invitation/:occasionSlug/demo?name=Asha&from=Rahul&date=...&venue=...
 */
export function DigitalInvitationDemoPage() {
  const { occasionSlug } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const occasion = getInvitationBySlug(occasionSlug)

  const name = searchParams.get('name') || 'You'
  const sender = searchParams.get('from') || 'The hosts'
  const message = searchParams.get('msg') || ''
  const templateId = searchParams.get('template') || occasion?.templates[0]?.id
  const eventDate = searchParams.get('date') || ''
  const eventTime = searchParams.get('time') || ''
  const venue = searchParams.get('venue') || ''

  const slides = useMemo(() => {
    const base = buildInvitationDemoSlides({
      occasionId: occasion?.id,
      name,
      sender,
      eventDate,
      eventTime,
      venue,
    })
    if (!message) return base
    return base.map((s, i) => (i === Math.min(4, base.length - 2) ? { ...s, body: message } : s))
  }, [occasion?.id, name, sender, message, eventDate, eventTime, venue])

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const holdRef = useRef(false)

  useEffect(() => {
    setIndex(0)
    setProgress(0)
  }, [occasionSlug, name, sender])

  useEffect(() => {
    if (paused || holdRef.current) return undefined
    const start = Date.now()
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / SLIDE_MS)
      setProgress(p)
      if (p >= 1) {
        setIndex((i) => (i + 1) % slides.length)
        setProgress(0)
      }
    }
    const id = setInterval(tick, 40)
    return () => clearInterval(id)
  }, [index, paused, slides.length])

  if (!occasion) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-hm-bg px-5 text-center">
        <h1 className="font-display text-3xl text-hm-text">Demo unavailable</h1>
        <Link to="/surprise/invitation" className="mt-4 inline-block text-hm-accent">
          ← Digital invitations
        </Link>
      </div>
    )
  }

  const slide = slides[index]
  const overlay = INVITATION_DEMO_TONES[slide.tone] || INVITATION_DEMO_TONES.unlock
  const isLast = index === slides.length - 1
  const customizePath = `/surprise/invitation/${occasion.slug}`

  const shareDemo = async () => {
    const u = new URL(`${window.location.origin}/surprise/invitation/${occasion.slug}/demo`)
    if (name && name !== 'You') u.searchParams.set('name', name)
    if (sender && sender !== 'The hosts') u.searchParams.set('from', sender)
    if (eventDate) u.searchParams.set('date', eventDate)
    if (eventTime) u.searchParams.set('time', eventTime)
    if (venue) u.searchParams.set('venue', venue)
    const url = u.toString()
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${occasion.title} demo`,
          text: `Watch this Uniquworld invitation demo`,
          url,
        })
        return
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard?.writeText(url)
  }

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
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.image + index}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <img src={slide.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0" style={{ background: overlay }} />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex gap-1 px-3 pt-3">
        {slides.map((_, i) => (
          <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full bg-white transition-[width] duration-75"
              style={{
                width: i < index ? '100%' : i === index ? `${progress * 100}%` : '0%',
              }}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-10 text-center">
        <motion.span
          key={`e-${index}`}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl"
        >
          {slide.emoji}
        </motion.span>
        <motion.h1
          key={`t-${index}`}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08 }}
          className="mt-5 max-w-md font-display text-3xl leading-tight sm:text-4xl"
        >
          {slide.title}
        </motion.h1>
        <motion.p
          key={`b-${index}`}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-3 max-w-sm text-sm leading-relaxed text-white/85 sm:text-base"
        >
          {slide.body}
        </motion.p>
      </div>

      <div className="relative z-10 space-y-3 px-4 pb-6">
        {isLast ? (
          <Button
            type="button"
            variant="primary"
            className="w-full gap-1.5"
            onClick={() => navigate(customizePath)}
          >
            Create invite · {formatINR(INVITATION_PRICE_INR)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            className="w-full"
            onClick={() => {
              setIndex((i) => Math.min(i + 1, slides.length - 1))
              setProgress(0)
            }}
          >
            Next
          </Button>
        )}
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1 gap-1.5 border-white/30 bg-white/10 text-white" onClick={shareDemo}>
            <Share2 className="h-4 w-4" />
            Share demo
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 border-white/30 bg-white/10 text-white"
            onClick={() => navigate(customizePath)}
          >
            Customize
          </Button>
        </div>
        <p className="text-center text-[11px] text-white/50">
          Template: {occasion.templates.find((t) => t.id === templateId)?.name || 'Default'}
        </p>
      </div>
    </div>
  )
}
