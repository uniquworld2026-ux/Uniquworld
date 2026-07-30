import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { resolveMediaEmbeds } from '@/storefront/features/digitalSurprise/mediaEmbeds'
import { DS_GRADIENTS } from '@/storefront/features/digitalSurprise/gradients'
import { cn } from '@/shared/utils/cn'

function MediaBlock({ media }) {
  const embeds = useMemo(() => resolveMediaEmbeds(media || {}), [media])
  if (!embeds.instagram && !embeds.video && !media?.photoUrl) return null

  return (
    <div className="mx-auto mt-8 w-full max-w-md space-y-4 px-4">
      {media?.photoUrl ? (
        <motion.img
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          src={media.photoUrl}
          alt=""
          className="mx-auto max-h-64 w-full rounded-2xl object-cover shadow-lg"
        />
      ) : null}
      {embeds.instagram ? (
        <iframe
          title="Instagram"
          src={embeds.instagram}
          className="h-[480px] w-full rounded-2xl border-0 bg-white shadow-lg"
          loading="lazy"
          allow="encrypted-media; clipboard-write"
        />
      ) : null}
      {embeds.video?.type === 'direct' ? (
        <video src={embeds.video.src} controls playsInline className="w-full rounded-2xl shadow-lg" />
      ) : embeds.video ? (
        <div className="aspect-video overflow-hidden rounded-2xl shadow-lg">
          <iframe
            title="Video"
            src={embeds.video}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  )
}

function FloatingBits({ count = 18, chars = ['*', '+', 'o'], className }) {
  const bits = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        char: chars[i % chars.length],
        left: `${(i * 37) % 100}%`,
        delay: (i % 8) * 0.35,
        duration: 6 + (i % 5),
        size: 12 + (i % 10),
      })),
    [count, chars],
  )
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute text-white/70"
          style={{ left: b.left, bottom: '-10%', fontSize: b.size }}
          animate={{ y: ['0%', '-120vh'], opacity: [0, 1, 0], rotate: [0, 40] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        >
          {b.char}
        </motion.span>
      ))}
    </div>
  )
}

function Shell({ children, tone = 'default', className }) {
  const gradient = DS_GRADIENTS[tone] || DS_GRADIENTS.default
  return (
    <div className={cn('relative min-h-[70svh] overflow-hidden', className)} style={{ background: gradient }}>
      {children}
    </div>
  )
}

function TitleBlock({ name, sender, message, titleClass }) {
  return (
    <div className="relative z-10 mx-auto max-w-lg px-5 pt-16 text-center sm:pt-20">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70"
      >
        Uniquworld Digital Surprise
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 160 }}
        className={cn('mt-3 font-display text-4xl text-white sm:text-5xl md:text-6xl', titleClass)}
      >
        {name}
      </motion.h1>
      {message ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-base leading-relaxed text-white/85 sm:text-lg"
        >
          {message}
        </motion.p>
      ) : null}
      {sender ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-6 text-sm text-white/60"
        >
          — {sender}
        </motion.p>
      ) : null}
    </div>
  )
}

function InteractiveTap({ label, onDone, children }) {
  const [done, setDone] = useState(false)
  return (
    <div className="relative z-10 mx-auto mt-8 flex flex-col items-center px-4">
      {!done ? (
        <button
          type="button"
          onClick={() => {
            setDone(true)
            onDone?.()
          }}
          className="rounded-full border border-white/40 bg-white/15 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/25"
        >
          {label}
        </button>
      ) : (
        <AnimatePresence>{children}</AnimatePresence>
      )}
    </div>
  )
}

function PreviewBadge({ dark }) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute left-3 top-3 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider',
        dark ? 'bg-black/70 text-white' : 'bg-white/90 text-hm-primary',
      )}
    >
      Demo preview
    </div>
  )
}

function Typewriter({ text }) {
  const [shown, setShown] = useState('')
  useEffect(() => {
    let i = 0
    setShown('')
    const id = setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) clearInterval(id)
    }, 28)
    return () => clearInterval(id)
  }, [text])
  return <p className="mt-4 min-h-[4.5rem] whitespace-pre-wrap text-stone-700">{shown}</p>
}

function CountdownTemplate({ name, sender, message, media, preview }) {
  const [n, setN] = useState(3)
  const [go, setGo] = useState(false)

  useEffect(() => {
    if (go) return undefined
    if (n <= 0) {
      setGo(true)
      return undefined
    }
    const t = setTimeout(() => setN((v) => v - 1), 800)
    return () => clearTimeout(t)
  }, [n, go])

  return (
    <Shell tone="bd-countdown">
      {!go ? (
        <div className="flex min-h-[70svh] items-center justify-center">
          <motion.span
            key={n}
            initial={{ scale: 1.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="font-display text-8xl text-white"
          >
            {n}
          </motion.span>
        </div>
      ) : (
        <>
          <FloatingBits chars={['*', '+', 'o']} />
          <TitleBlock name={name} sender={sender} message={message || 'Happy Birthday!'} />
          <MediaBlock media={media} />
        </>
      )}
      {preview ? <PreviewBadge /> : null}
    </Shell>
  )
}

/** Render one of 24 unique interactive templates */
export function DigitalSurpriseExperience({
  templateId,
  recipientName,
  senderName,
  message,
  media,
  preview = false,
}) {
  const name = recipientName || 'You'
  const common = { name, sender: senderName, message, media }
  const tone = templateId

  switch (templateId) {
    case 'gf-bloom':
      return (
        <Shell tone={tone}>
          <FloatingBits chars={['*', '+', 'o']} />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'gf-polaroid':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <div className="relative z-10 mx-auto mt-8 flex max-w-sm justify-center gap-0 px-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ rotate: (i - 1) * 8, y: 40, opacity: 0 }}
                animate={{ rotate: (i - 1) * 8, y: 0, opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.15 }}
                className="-mx-2 w-36 rounded-sm bg-white p-2 shadow-xl"
              >
                <div className="aspect-square bg-gradient-to-br from-rose-200 to-rose-400" />
                <p className="mt-2 text-center text-xs text-stone-600">{name}</p>
              </motion.div>
            ))}
          </div>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'gf-constellation':
      return (
        <Shell tone={tone}>
          <FloatingBits count={24} chars={['*', '+', '.']} />
          <TitleBlock {...common} titleClass="text-pink-200" />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'gf-letter':
      return (
        <Shell tone={tone}>
          <div className="relative z-10 mx-auto max-w-md px-5 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-sm bg-amber-50 p-6 shadow-xl ring-1 ring-black/5 sm:p-8"
            >
              <p className="font-display text-2xl text-stone-700">Dear {name},</p>
              <Typewriter text={message || 'You make ordinary days feel extraordinary.'} />
              {senderName ? <p className="mt-8 text-right text-sm text-stone-700">— {senderName}</p> : null}
            </motion.div>
            <MediaBlock media={media} />
          </div>
          {preview ? <PreviewBadge dark /> : null}
        </Shell>
      )
    case 'gf-spotlight':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <p className="relative z-10 text-center text-xs uppercase tracking-widest text-white/50">
            Featured moment
          </p>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'gf-balloons':
      return (
        <Shell tone={tone}>
          <FloatingBits count={14} chars={['o', '*', '+']} />
          <TitleBlock {...common} titleClass="text-rose-900" />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge dark /> : null}
        </Shell>
      )
    case 'gf-scrapbook':
      return (
        <Shell tone={tone}>
          <div className="relative z-10 mx-auto max-w-lg px-4 py-16">
            <motion.div
              initial={{ rotateY: -20, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              className="rounded-lg border-4 border-amber-700/40 bg-amber-50 p-6 shadow-2xl"
            >
              <h1 className="font-display text-4xl text-stone-800">{name}</h1>
              <p className="mt-3 text-stone-700/80">{message || 'Our story, page by page.'}</p>
              {senderName ? <p className="mt-6 text-sm text-stone-600">From {senderName}</p> : null}
            </motion.div>
            <MediaBlock media={media} />
          </div>
          {preview ? <PreviewBadge dark /> : null}
        </Shell>
      )
    case 'gf-neon':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} titleClass="text-fuchsia-300" />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )

    case 'bd-cake':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <InteractiveTap label="Make a wish">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center text-2xl font-semibold text-amber-200"
            >
              Celebrate!
            </motion.div>
          </InteractiveTap>
          <FloatingBits chars={['*', '+', 'o']} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-balloons':
      return (
        <Shell tone={tone}>
          <FloatingBits count={16} chars={['o', '*', '+']} />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-countdown':
      return <CountdownTemplate {...common} preview={preview} />
    case 'bd-unwrap':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <InteractiveTap label="Unwrap gift">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-sm text-center text-lg text-amber-100"
            >
              {message || `Happy Birthday, ${name}!`}
            </motion.p>
          </InteractiveTap>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-carousel':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <motion.div
            className="relative z-10 mx-auto mt-6 h-40 w-40 overflow-hidden rounded-full ring-4 ring-amber-300/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          >
            <div className="flex h-full w-[400%]">
              {['bg-amber-400', 'bg-pink-400', 'bg-sky-400', 'bg-emerald-400'].map((c) => (
                <div key={c} className={cn('h-full w-1/4', c)} />
              ))}
            </div>
          </motion.div>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-fireworks':
      return (
        <Shell tone={tone}>
          <FloatingBits count={28} chars={['*', '+', '.']} />
          <TitleBlock {...common} titleClass="text-amber-200" />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-karaoke':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <motion.p
            className="relative z-10 mx-auto mt-6 max-w-md px-6 text-center font-display text-2xl text-pink-200"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            Happy birthday to you
          </motion.p>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'bd-tunnel':
      return (
        <Shell tone={tone}>
          <FloatingBits count={30} chars={['*', '+', 'o']} />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )

    case 'dw-diya':
      return (
        <Shell tone={tone}>
          <TitleBlock {...common} />
          <InteractiveTap label="Light the diya">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.08, 1], opacity: 1 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-16 w-16 rounded-full bg-amber-400 shadow-[0_0_40px_rgba(251,191,36,0.8)]"
            />
          </InteractiveTap>
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-rangoli':
      return (
        <Shell tone={tone}>
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 rounded-full border-4 border-amber-300/40"
            animate={{ rotate: 360, scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-sparkler':
      return (
        <Shell tone={tone}>
          <FloatingBits count={40} chars={['*', '.', '+']} />
          <TitleBlock {...common} titleClass="text-amber-100" />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-lantern':
      return (
        <Shell tone={tone}>
          <FloatingBits count={12} chars={['o', '*']} />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-cracker':
      return (
        <Shell tone={tone}>
          <InteractiveTap label="Burst celebration">
            <FloatingBits count={36} chars={['*', '+', '.']} />
          </InteractiveTap>
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-mandala':
      return (
        <Shell tone={tone}>
          <motion.div
            className="pointer-events-none absolute left-1/2 top-[28%] h-56 w-56 -translate-x-1/2 rounded-full border border-amber-400/30 bg-amber-400/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-foil':
      return (
        <Shell tone={tone}>
          <div className="relative z-10 mx-auto max-w-md px-5 py-20">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-amber-200/50 bg-black/25 p-8 text-center backdrop-blur"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-amber-100/80">Shubh Diwali</p>
              <h1 className="mt-3 font-display text-4xl text-amber-50">{name}</h1>
              <p className="mt-4 text-amber-50/90">{message || 'May your lights never dim.'}</p>
              {senderName ? <p className="mt-6 text-sm text-amber-100/60">— {senderName}</p> : null}
            </motion.div>
            <MediaBlock media={media} />
          </div>
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
    case 'dw-bells':
      return (
        <Shell tone={tone}>
          <motion.div
            className="relative z-10 mx-auto mt-10 h-10 w-10 rounded-full bg-amber-300"
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )

    default:
      return (
        <Shell tone="default">
          <TitleBlock {...common} />
          <MediaBlock media={media} />
          {preview ? <PreviewBadge /> : null}
        </Shell>
      )
  }
}
