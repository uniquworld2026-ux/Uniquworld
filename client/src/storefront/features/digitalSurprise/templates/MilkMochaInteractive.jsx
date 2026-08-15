import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { cn } from '@/shared/utils/cn'

const GIF = {
  no: '/gifts/mocha/no.webp',
  birthday: '/gifts/mocha/finale.webp',
  wish: '/gifts/mocha/wish.webp',
  hug: '/gifts/mocha/hug.webp',
  finale: '/gifts/mocha/finale.webp',
}

function fireHearts() {
  confetti({
    particleCount: 72,
    spread: 88,
    origin: { y: 0.62 },
    colors: ['#e11d2a', '#f9a8d4', '#ffffff', '#fb7185', '#fda4af'],
  })
}

function fireFinale() {
  const end = Date.now() + 900
  const colors = ['#e11d2a', '#f9a8d4', '#ffffff', '#fb7185']
  ;(function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors })
    confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()
}

const RED = '#e11d2a'
const PINK = '#f7c6d4'

function HeartWallpaper() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        id: i,
        left: `${(i * 19) % 100}%`,
        top: `${(i * 29) % 100}%`,
        size: 16 + (i % 6) * 8,
        opacity: 0.1 + (i % 4) * 0.05,
        delay: (i % 8) * 0.4,
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="absolute text-[#e88aa3]"
          style={{ left: h.left, top: h.top, fontSize: h.size, opacity: h.opacity }}
          animate={{ scale: [1, 1.18, 1], y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 3.8 + (h.id % 4), delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♥
        </motion.span>
      ))}
    </div>
  )
}

function RisingBits() {
  const bits = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        char: ['♥', '✦', '♡', '✶'][i % 4],
        left: `${8 + ((i * 13) % 84)}%`,
        delay: i * 0.35,
        duration: 5 + (i % 4),
      })),
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute text-[#e11d2a]/50"
          style={{ left: b.left, bottom: '-8%', fontSize: 12 + (b.id % 10) }}
          animate={{ y: ['0%', '-118%'], opacity: [0, 1, 0], scale: [0.7, 1.1, 0.8] }}
          transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'linear' }}
        >
          {b.char}
        </motion.span>
      ))}
    </div>
  )
}

function Balloon({ color, string }) {
  return (
    <svg viewBox="0 0 48 92" className="h-full w-full overflow-visible drop-shadow-sm">
      <ellipse cx="24" cy="26" rx="18" ry="24" fill={color} />
      <ellipse cx="16" cy="16" rx="5" ry="8" fill="white" opacity="0.35" />
      <path d="M24 50 L20 55 L28 55 Z" fill={color} />
      <path
        d="M24 55 Q18 68 24 78 Q30 68 24 88"
        fill="none"
        stroke={string}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BalloonSky() {
  const balloons = useMemo(
    () =>
      [
        { id: 1, color: '#e11d2a', left: '6%', size: 44, dur: 9, delay: 0, sway: 18 },
        { id: 2, color: '#fb7185', left: '18%', size: 34, dur: 11, delay: 1.2, sway: 22 },
        { id: 3, color: '#f9a8d4', left: '32%', size: 40, dur: 10, delay: 0.4, sway: 16 },
        { id: 4, color: '#fda4af', left: '52%', size: 28, dur: 8.5, delay: 2, sway: 20 },
        { id: 5, color: '#e11d2a', left: '68%', size: 46, dur: 12, delay: 0.8, sway: 14 },
        { id: 6, color: '#fff1f2', left: '82%', size: 32, dur: 9.5, delay: 1.6, sway: 24 },
        { id: 7, color: '#fb7185', left: '92%', size: 36, dur: 11.5, delay: 0.2, sway: 18 },
        { id: 8, color: '#f472b6', left: '42%', size: 30, dur: 13, delay: 2.4, sway: 12 },
      ],
    [],
  )
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          className="absolute"
          style={{ left: b.left, width: b.size, height: b.size * 1.9, bottom: '-20%' }}
          animate={{
            y: ['0%', '-130vh'],
            x: [0, b.sway, -b.sway, 0],
            rotate: [-6, 6, -4, 5],
          }}
          transition={{
            y: { duration: b.dur, delay: b.delay, repeat: Infinity, ease: 'linear' },
            x: { duration: 3.4, delay: b.delay, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 4.2, delay: b.delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Balloon color={b.color} string="#9f1239" />
        </motion.div>
      ))}
    </div>
  )
}

/** Transparent WebP — sized to leftover space so it never covers titles. */
function StoryGif({ src, alt, className }) {
  return (
    <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-2">
      <motion.img
        src={src}
        alt={alt}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.35 },
          scale: { type: 'spring', stiffness: 180, damping: 18 },
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={cn(
          'max-h-full w-auto max-w-[min(100%,15.5rem)] bg-transparent object-contain sm:max-w-[17rem]',
          className,
        )}
        draggable={false}
      />
    </div>
  )
}

function PillButton({ children, onClick, className }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={cn(
        'min-h-11 min-w-[6.5rem] flex-1 rounded-full px-5 py-2.5 text-base font-black uppercase tracking-wide text-white shadow-[0_5px_0_#9f1239] sm:min-h-12 sm:min-w-[8rem] sm:flex-none sm:px-8 sm:py-3 sm:text-lg',
        className,
      )}
      style={{ background: RED }}
    >
      {children}
    </motion.button>
  )
}

function NextBar({ onClick }) {
  return (
    <div className="flex shrink-0 justify-center pt-2">
      <motion.button
        type="button"
        onClick={onClick}
        className="flex flex-col items-center"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.1, repeat: Infinity }}
        aria-label="Next"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e11d2a] text-lg text-white shadow-lg ring-4 ring-white/50 sm:h-12 sm:w-12 sm:text-xl">
          ♥
        </span>
        <span className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-[#be123c]">
          Next
        </span>
      </motion.button>
    </div>
  )
}

function CardFrame({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden px-4 pb-2 pt-1 sm:px-6"
    >
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-stretch">{children}</div>
    </motion.div>
  )
}

function ArcTitle({ children, className }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'px-2 text-center font-display text-[clamp(1.2rem,4.6vw,2.1rem)] leading-snug',
        className,
      )}
      style={{ color: RED }}
    >
      {children}
    </motion.h2>
  )
}

function Sub({ children }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mx-auto mt-1 max-w-md shrink-0 px-1 text-center text-xs leading-snug text-[#be123c]/90 sm:text-sm"
    >
      {children}
    </motion.p>
  )
}

function FloatingHeartsCluster() {
  return (
    <div className="relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center">
      <motion.span
        className="select-none text-[4.5rem] leading-none drop-shadow-sm sm:text-[5.5rem]"
        animate={{ y: [0, -12, 0], scale: [1, 1.08, 1], rotate: [-6, 6, -6] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden
      >
        🎁
      </motion.span>
    </div>
  )
}

function CardIntro({ name, onYes, onNo }) {
  const who = name === 'You' ? 'you' : name
  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>A little surprise, just for {who}</ArcTitle>
        <Sub>Someone cared enough to make this page only for you. Ready to open it?</Sub>
      </div>
      <FloatingHeartsCluster />
      <div className="shrink-0 pt-2">
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#be123c]/70">
          Tap yes to begin
        </p>
        <div className="mt-3 flex w-full items-center justify-center gap-3">
          <PillButton onClick={onYes}>Yes</PillButton>
          <PillButton onClick={onNo}>No</PillButton>
        </div>
      </div>
    </CardFrame>
  )
}

function CardNo({ onRetry }) {
  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>Wait… please?</ArcTitle>
        <Sub>That no made someone a little sad. One more chance — this hug is still waiting.</Sub>
      </div>
      <StoryGif src={GIF.no} alt="" />
      <div className="flex shrink-0 justify-center pt-2">
        <PillButton onClick={onRetry} className="max-w-xs">
          Try again
        </PillButton>
      </div>
    </CardFrame>
  )
}

function CardBirthday({ name, onNext }) {
  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>Happy Birthday</ArcTitle>
        <p className="mt-0.5 text-center text-base font-black tracking-wide text-[#be123c] sm:text-lg">
          {name}
        </p>
        <Sub>Blow the candle in your heart. Today is all about you.</Sub>
      </div>
      <StoryGif src={GIF.birthday} alt="" />
      <p className="shrink-0 text-center font-display text-[clamp(1.15rem,3.8vw,1.75rem)] italic text-[#be123c]">
        I am ur gift
      </p>
      <NextBar onClick={onNext} />
    </CardFrame>
  )
}

function CardWish({ name, message, sender, onNext }) {
  const wish =
    message ||
    `I hope this year brings ${name} endless happiness, success, peace, and strength. May every quiet wish come true — and may you feel loved on ordinary days too.`
  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>My wish for you</ArcTitle>
        <Sub>Keep this close. Read it whenever the day feels heavy.</Sub>
        <p className="mx-auto mt-2 max-w-lg px-1 text-center text-xs leading-snug text-[#7a3148] line-clamp-4 sm:text-sm sm:line-clamp-5">
          {wish}
        </p>
        {sender ? (
          <p className="mt-1 text-center text-xs font-semibold text-[#be123c] sm:text-sm">— {sender}</p>
        ) : null}
      </div>
      <StoryGif src={GIF.wish} alt="" />
      <NextBar onClick={onNext} />
    </CardFrame>
  )
}

function CardHug({ onNext }) {
  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>A virtual hug</ArcTitle>
        <Sub>Distance can wait. This squeeze is for right now.</Sub>
      </div>
      <StoryGif src={GIF.hug} alt="" />
      <p
        className="shrink-0 text-center text-[clamp(1.35rem,5vw,2.2rem)] font-black tracking-tight"
        style={{ color: RED }}
      >
        I MISS YOU
      </p>
      <NextBar onClick={onNext} />
    </CardFrame>
  )
}

function CardFinale({ dateLabel, sender, name }) {
  useEffect(() => {
    fireFinale()
  }, [])

  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>Have a great year ahead..</ArcTitle>
        <Sub>
          {name === 'You' ? 'You' : name}, may this year be kinder, brighter, and full of small joys.
        </Sub>
      </div>
      <StoryGif src={GIF.finale} alt="" />
      <div className="shrink-0 text-center">
        {sender ? (
          <p className="text-sm font-semibold text-[#be123c]">With love, {sender}</p>
        ) : null}
        <p className="mt-1 text-base font-black tracking-[0.16em] sm:text-lg" style={{ color: RED }}>
          {dateLabel}
        </p>
      </div>
    </CardFrame>
  )
}

function formatCardDate() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  return `${dd}.${mm}.${d.getFullYear()}`
}

/**
 * Interactive birthday story — Tuji Bunny GIFs with white background removed.
 */
export function MilkMochaInteractive({ name = 'You', sender, message, preview, fullscreen }) {
  const [step, setStep] = useState('intro')
  const dateLabel = useMemo(formatCardDate, [])
  const cardNumber = { intro: 1, no: 2, birthday: 3, wish: 4, hug: 5, finale: 6 }[step] || 1

  return (
    <div
      className={cn(
        'relative isolate flex w-full flex-col overflow-hidden',
        fullscreen ? 'h-full min-h-0' : 'min-h-[70svh]',
      )}
      style={{ background: PINK }}
    >
      <HeartWallpaper />
      <RisingBits />
      <BalloonSky />
      {preview ? (
        <div className="pointer-events-none absolute left-2 top-2 z-30 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-hm-primary sm:left-3 sm:top-3 sm:text-[10px]">
          Full demo
        </div>
      ) : null}
      <p className="relative z-10 shrink-0 px-2 pt-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#be123c] sm:pt-2 sm:text-[11px]">
        ft. Tuji Bunny · interactive
      </p>
      <p className="relative z-10 mb-1 shrink-0 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#be123c]/70">
        Card {cardNumber}/6
      </p>
      <div className="relative z-10 flex min-h-0 flex-1 items-stretch justify-center">
        <div className="flex h-full min-h-0 w-full max-w-lg justify-center">
          <AnimatePresence mode="wait">
            {step === 'intro' ? (
              <CardIntro
                key="intro"
                name={name}
                onYes={() => {
                  fireHearts()
                  setStep('birthday')
                }}
                onNo={() => setStep('no')}
              />
            ) : null}
            {step === 'no' ? <CardNo key="no" onRetry={() => setStep('intro')} /> : null}
            {step === 'birthday' ? (
              <CardBirthday key="bday" name={name} onNext={() => setStep('wish')} />
            ) : null}
            {step === 'wish' ? (
              <CardWish key="wish" name={name} message={message} sender={sender} onNext={() => setStep('hug')} />
            ) : null}
            {step === 'hug' ? <CardHug key="hug" onNext={() => setStep('finale')} /> : null}
            {step === 'finale' ? (
              <CardFinale key="finale" dateLabel={dateLabel} sender={sender} name={name} />
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
