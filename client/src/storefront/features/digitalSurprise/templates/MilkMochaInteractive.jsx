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

function Floater({ children, className, delay = 0, y = 7, rotate = 5 }) {
  return (
    <motion.div
      className={cn('absolute', className)}
      animate={{ y: [0, -y, 0], rotate: [-rotate, rotate, -rotate] }}
      transition={{ duration: 2.8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}

function SvgRose({ className }) {
  return (
    <svg viewBox="0 0 56 78" className={cn('overflow-visible drop-shadow-md', className)}>
      <path d="M28 76 C26 58 18 52 16 40" fill="none" stroke="#2f7a45" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="20" cy="52" rx="10" ry="5" fill="#3d9a58" transform="rotate(-28 20 52)" />
      <ellipse cx="38" cy="56" rx="9" ry="4.5" fill="#348a4e" transform="rotate(32 38 56)" />
      <ellipse cx="28" cy="34" rx="11" ry="10" fill="#ff4d7a" />
      <ellipse cx="20" cy="28" rx="9" ry="8" fill="#ff7aa0" />
      <ellipse cx="36" cy="27" rx="9" ry="8" fill="#ff8fb4" />
      <ellipse cx="28" cy="22" rx="8" ry="7" fill="#ffb3c9" />
      <ellipse cx="28" cy="30" rx="6" ry="5" fill="#e11d48" />
    </svg>
  )
}

function SvgHeart({ className, color = '#ff6b9d' }) {
  return (
    <svg viewBox="0 0 32 30" className={cn('overflow-visible drop-shadow', className)}>
      <path
        d="M16 27C16 27 3 18 3 10.5 3 6 6.4 3 10.2 3c2.4 0 4.6 1.3 5.8 3.3C17.2 4.3 19.4 3 21.8 3 25.6 3 29 6 29 10.5 29 18 16 27 16 27z"
        fill={color}
        stroke="#fff"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function SvgHeartBalloon({ className, label }) {
  return (
    <svg viewBox="0 0 80 110" className={cn('overflow-visible drop-shadow-lg', className)}>
      <path
        d="M40 62C40 62 10 42 10 26 10 16 18 9 28 9c5.4 0 10 3 12 7.6C42 12 46.6 9 52 9c10 0 18 7 18 17 0 16-30 36-30 36z"
        fill="#ff6b9d"
        stroke="#fff"
        strokeWidth="2"
      />
      <ellipse cx="28" cy="24" rx="6" ry="8" fill="#fff" opacity="0.28" />
      {label ? (
        <text x="40" y="34" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">
          {label}
        </text>
      ) : null}
      <path d="M40 62 Q36 82 40 102" fill="none" stroke="#9f1239" strokeWidth="1.5" />
    </svg>
  )
}

function SvgGiftBox({ className, color = '#fb7185' }) {
  return (
    <svg viewBox="0 0 56 52" className={cn('overflow-visible drop-shadow-md', className)}>
      <rect x="8" y="20" width="40" height="26" rx="3" fill={color} />
      <rect x="8" y="20" width="40" height="7" rx="2" fill="#fff" opacity="0.35" />
      <rect x="25" y="20" width="6" height="26" fill="#fff" />
      <rect x="8" y="30" width="40" height="4" fill="#fff" />
      <path d="M28 20 C20 6 12 14 28 20 C44 14 36 6 28 20" fill="#fff" />
    </svg>
  )
}

function SvgEnvelope({ className }) {
  return (
    <svg viewBox="0 0 72 52" className={cn('overflow-visible drop-shadow-md', className)}>
      <rect x="4" y="10" width="64" height="38" rx="5" fill="#ffc1d6" />
      <path d="M4 14 L36 34 L68 14" fill="none" stroke="#fff" strokeWidth="2.4" />
      <circle cx="36" cy="28" r="6" fill="#e11d48" />
      <path d="M36 31c-1.6-1.5-4-.5-4 1.2 0 2.2 4 4 4 4s4-1.8 4-4c0-1.7-2.4-2.7-4-1.2z" fill="#fff" />
    </svg>
  )
}

function SvgBouquet({ className }) {
  return (
    <svg viewBox="0 0 70 90" className={cn('overflow-visible drop-shadow-md', className)}>
      <path d="M35 88 C33 70 20 62 18 48" stroke="#2f7a45" strokeWidth="2.2" fill="none" />
      <path d="M35 88 C37 70 50 62 52 48" stroke="#2f7a45" strokeWidth="2.2" fill="none" />
      <ellipse cx="22" cy="40" rx="12" ry="11" fill="#ff4d7a" />
      <ellipse cx="35" cy="32" rx="13" ry="12" fill="#ff7aa0" />
      <ellipse cx="50" cy="40" rx="12" ry="11" fill="#e11d48" />
      <ellipse cx="28" cy="50" rx="9" ry="8" fill="#ff8fb4" />
      <ellipse cx="44" cy="50" rx="9" ry="8" fill="#ff6b9d" />
      <path d="M22 70 L48 70 L42 88 L28 88 Z" fill="#f9a8d4" />
    </svg>
  )
}

function SvgBunting({ className }) {
  return (
    <svg viewBox="0 0 120 36" className={cn('overflow-visible', className)}>
      <path d="M4 6 H116" stroke="#fff" strokeWidth="1.6" />
      {[10, 30, 50, 70, 90].map((x, i) => (
        <polygon
          key={x}
          points={`${x},8 ${x + 14},8 ${x + 7},28`}
          fill={i % 2 ? '#e11d2a' : '#ff8fb4'}
          stroke="#fff"
          strokeWidth="0.8"
        />
      ))}
    </svg>
  )
}

function SvgBunnyHeart({ className }) {
  return (
    <svg viewBox="0 0 80 90" className={cn('overflow-visible drop-shadow-lg', className)}>
      <ellipse cx="28" cy="18" rx="8" ry="18" fill="#ffe4ee" />
      <ellipse cx="48" cy="18" rx="8" ry="18" fill="#ffe4ee" />
      <ellipse cx="28" cy="18" rx="4" ry="10" fill="#ffb3c9" />
      <ellipse cx="48" cy="18" rx="4" ry="10" fill="#ffb3c9" />
      <ellipse cx="38" cy="52" rx="22" ry="24" fill="#fff0f5" />
      <circle cx="32" cy="48" r="2.2" fill="#3b1d2a" />
      <circle cx="46" cy="48" r="2.2" fill="#3b1d2a" />
      <path d="M36 56 Q38 59 40 56" fill="none" stroke="#3b1d2a" strokeWidth="1.4" />
      <ellipse cx="26" cy="54" rx="4" ry="2.4" fill="#ffb3c9" />
      <ellipse cx="50" cy="54" rx="4" ry="2.4" fill="#ffb3c9" />
      <path d="M38 70 C28 78 22 70 22 64 22 58 30 58 38 64 46 58 54 58 54 64 54 70 48 78 38 70z" fill="#e11d48" />
    </svg>
  )
}

function SvgBlossom({ className }) {
  return (
    <svg viewBox="0 0 90 120" className={cn('overflow-visible drop-shadow-md', className)}>
      <path d="M45 118 C44 80 38 70 28 50" fill="none" stroke="#7a4a32" strokeWidth="4" />
      <path d="M42 78 C58 70 64 58 70 42" fill="none" stroke="#7a4a32" strokeWidth="3" />
      {[
        [24, 46],
        [36, 38],
        [48, 32],
        [62, 40],
        [70, 30],
        [18, 58],
        [54, 52],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <circle r="7" fill="#ff8fb4" />
          <circle r="3" fill="#fff" />
        </g>
      ))}
    </svg>
  )
}

function SideColumn({ side, step }) {
  const left = side === 'left'
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-y-0 z-[6] w-[22%] max-w-[9.5rem] overflow-hidden sm:relative sm:z-[5] sm:w-[24%] sm:max-w-[12rem]',
        left ? 'left-0' : 'right-0',
      )}
      aria-hidden
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`${side}-${step}`}
          className="relative h-full w-full"
          initial={{ opacity: 0, x: left ? -16 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {left ? <LeftScene step={step} /> : <RightScene step={step} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function LeftScene({ step }) {
  if (step === 'birthday') {
    return (
      <>
        <Floater className="left-[8%] top-[10%] w-16 sm:w-20" delay={0.1}>
          <LoveCake />
        </Floater>
        <Floater className="left-[18%] top-[38%] w-12 sm:w-14" delay={0.2} rotate={8}>
          <SvgRose />
        </Floater>
        <Floater className="left-[4%] top-[52%] w-11" delay={0.35}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[18%] left-[10%] w-10" y={10}>
          <Balloon color="#fb7185" string="#9f1239" />
        </Floater>
        <Floater className="bottom-[8%] left-[38%] w-12" delay={0.4}>
          <SvgHeart className="w-10" />
        </Floater>
      </>
    )
  }
  if (step === 'wish') {
    return (
      <>
        <Floater className="left-[6%] top-[16%] w-[4.6rem] sm:w-24" delay={0.1}>
          <SvgBouquet />
        </Floater>
        <Floater className="left-[10%] top-[48%] w-10" delay={0.25}>
          <Balloon color="#e11d2a" string="#9f1239" />
        </Floater>
        <Floater className="bottom-[16%] left-[22%] w-12" delay={0.15}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[8%] left-[6%] w-8" delay={0.4}>
          <SvgHeart color="#ff8fb4" />
        </Floater>
      </>
    )
  }
  if (step === 'hug') {
    return (
      <>
        <Floater className="left-[8%] top-[12%] w-16" delay={0.1}>
          <SvgHeartBalloon label="HUGS" />
        </Floater>
        <Floater className="left-[4%] top-[42%] w-12" delay={0.2}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[20%] left-[16%] w-14" delay={0.3}>
          <SvgGiftBox color="#fda4af" />
        </Floater>
        <Floater className="bottom-[8%] left-[6%] w-9" delay={0.15}>
          <SvgHeart />
        </Floater>
      </>
    )
  }
  if (step === 'cake') {
    return (
      <>
        <Floater className="left-[8%] top-[12%] w-16" delay={0.1}>
          <LoveCake />
        </Floater>
        <Floater className="left-[6%] top-[42%] w-12" delay={0.2}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[12%] left-[16%] w-10" delay={0.3}>
          <SvgHeart />
        </Floater>
      </>
    )
  }
  if (step === 'finale') {
    return (
      <>
        <Floater className="left-[10%] top-[14%] w-12" delay={0.1}>
          <SvgGiftBox color="#e11d48" />
        </Floater>
        <Floater className="left-[18%] top-[30%] w-11" delay={0.2}>
          <SvgGiftBox color="#ff8fb4" />
        </Floater>
        <Floater className="left-[6%] top-[46%] w-14" delay={0.15}>
          <SvgHeartBalloon />
        </Floater>
        <Floater className="bottom-[12%] left-[16%] w-12" delay={0.3}>
          <SvgRose />
        </Floater>
      </>
    )
  }
  if (step === 'no') {
    return (
      <>
        <Floater className="left-[8%] top-[12%] w-14" delay={0.1} y={12}>
          <Balloon color="#f9a8d4" string="#9f1239" />
        </Floater>
        <Floater className="left-[4%] top-[36%] w-[4.5rem]" delay={0.2}>
          <SvgBouquet />
        </Floater>
        <Floater className="bottom-[14%] left-[12%] w-12" delay={0.3}>
          <SvgGiftBox />
        </Floater>
      </>
    )
  }
  return (
    <>
      <Floater className="left-[4%] top-[8%] w-[5.5rem] sm:w-28" delay={0}>
        <SvgBunting />
      </Floater>
      <Floater className="left-[10%] top-[22%] w-12" delay={0.15} y={10}>
        <Balloon color="#e11d2a" string="#9f1239" />
      </Floater>
      <Floater className="left-[2%] top-[40%] w-[4.4rem] sm:w-24" delay={0.1}>
        <SvgBunnyHeart />
      </Floater>
      <Floater className="bottom-[22%] left-[14%] w-12" delay={0.25}>
        <SvgGiftBox color="#fff" />
      </Floater>
      <Floater className="bottom-[10%] left-[6%] w-11" delay={0.35}>
        <SvgRose />
      </Floater>
      <Floater className="bottom-[6%] left-[40%] w-8" delay={0.2}>
        <SvgHeart />
      </Floater>
    </>
  )
}

function RightScene({ step }) {
  if (step === 'birthday') {
    return (
      <>
        <Floater className="right-[8%] top-[12%] w-11" delay={0.1} y={11}>
          <Balloon color="#fb7185" string="#9f1239" />
        </Floater>
        <Floater className="right-[18%] top-[28%] w-10" delay={0.25}>
          <Balloon color="#e11d2a" string="#9f1239" />
        </Floater>
        <Floater className="right-[6%] top-[46%] w-14" delay={0.15}>
          <SvgGiftBox color="#ff8fb4" />
        </Floater>
        <Floater className="bottom-[16%] right-[14%] w-12" delay={0.3}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[8%] right-[6%] w-8">
          <SvgHeart />
        </Floater>
      </>
    )
  }
  if (step === 'wish') {
    return (
      <>
        <Floater className="right-[10%] top-[10%] w-10" delay={0.1}>
          <Balloon color="#e11d2a" string="#9f1239" />
        </Floater>
        <Floater className="right-[4%] top-[28%] w-[4.4rem]" delay={0.2}>
          <SvgEnvelope />
        </Floater>
        <Floater className="right-[12%] top-[50%] w-12" delay={0.15}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[12%] right-[8%] w-11" delay={0.3}>
          <SvgHeart color="#ff4d7a" />
        </Floater>
      </>
    )
  }
  if (step === 'hug') {
    return (
      <>
        <Floater className="right-[2%] top-[8%] w-[5.2rem] sm:w-28" delay={0.1}>
          <SvgBlossom />
        </Floater>
        <Floater className="right-[8%] top-[48%] w-12" delay={0.25}>
          <SvgBouquet />
        </Floater>
        <Floater className="bottom-[14%] right-[10%] w-10" delay={0.2}>
          <SvgHeart />
        </Floater>
      </>
    )
  }
  if (step === 'cake') {
    return (
      <>
        <Floater className="right-[8%] top-[10%] w-12" delay={0.1} y={11}>
          <Balloon color="#fb7185" string="#9f1239" />
        </Floater>
        <Floater className="right-[6%] top-[36%] w-16" delay={0.2}>
          <LoveCake />
        </Floater>
        <Floater className="bottom-[12%] right-[12%] w-11" delay={0.3}>
          <SvgRose />
        </Floater>
      </>
    )
  }
  if (step === 'finale') {
    return (
      <>
        <Floater className="right-[4%] top-[10%] w-[5.5rem]" delay={0}>
          <SvgBunting />
        </Floater>
        <Floater className="right-[8%] top-[26%] w-16" delay={0.15}>
          <SvgHeartBalloon label="YOU" />
        </Floater>
        <Floater className="right-[12%] top-[52%] w-12" delay={0.25}>
          <SvgRose />
        </Floater>
        <Floater className="bottom-[10%] right-[6%] w-12" delay={0.2}>
          <SvgBunnyHeart />
        </Floater>
      </>
    )
  }
  if (step === 'no') {
    return (
      <>
        <Floater className="right-[6%] top-[12%] w-14" delay={0.1}>
          <SvgHeartBalloon />
        </Floater>
        <Floater className="right-[4%] top-[40%] w-[4.6rem]" delay={0.2}>
          <SvgBouquet />
        </Floater>
        <Floater className="bottom-[14%] right-[12%] w-10" delay={0.3}>
          <SvgRose />
        </Floater>
      </>
    )
  }
  return (
    <>
      <Floater className="right-[4%] top-[8%] w-16 sm:w-20" delay={0.1} y={11}>
        <SvgHeartBalloon label="LOVE" />
      </Floater>
      <Floater className="right-[18%] top-[32%] w-10" delay={0.2}>
        <Balloon color="#fb7185" string="#9f1239" />
      </Floater>
      <Floater className="right-[2%] top-[48%] w-[4.6rem]" delay={0.15}>
        <SvgEnvelope />
      </Floater>
      <Floater className="bottom-[20%] right-[10%] w-12" delay={0.3}>
        <SvgRose />
      </Floater>
      <Floater className="bottom-[8%] right-[28%] w-8" delay={0.25}>
        <SvgHeart />
      </Floater>
    </>
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

const WISH_FRAME = '#f3a7bc'
const DEFAULT_WISH =
  "I hope your future brings you endless happiness, success, and peace in everything you do. May every dream you hold in your heart slowly come true and may you always have the strength and courage to keep moving forward no matter what happens. You deserve a beautiful life filled with love, laughter, and people who truly care about you. And no matter where life takes you, I'll always be here supporting you, believing in you, and wishing you nothing but the best."

function Sticker({ children, className, delay = 0, rotate = 0, size }) {
  return (
    <motion.div
      className={cn('pointer-events-none absolute z-20', className)}
      style={size ? { width: size, height: size } : undefined}
      initial={{ scale: 0, rotate: rotate - 12 }}
      animate={{ scale: 1, rotate, y: [0, -6, 0] }}
      transition={{
        scale: { type: 'spring', stiffness: 280, damping: 14, delay },
        rotate: { type: 'spring', stiffness: 180, damping: 12, delay },
        y: { duration: 2.6 + delay, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    >
      {children}
    </motion.div>
  )
}

function SvgCamera() {
  return (
    <svg viewBox="0 0 72 56" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      <rect x="8" y="16" width="56" height="34" rx="10" fill="#7edcc3" stroke="#fff" strokeWidth="3" />
      <rect x="26" y="7" width="18" height="12" rx="4" fill="#7edcc3" stroke="#fff" strokeWidth="2.5" />
      <circle cx="36" cy="33" r="13" fill="#fff" />
      <circle cx="36" cy="33" r="9.5" fill="#2b3350" />
      <path
        d="M36 37.4c-2.2-2-5.2-.7-5.2 1.5 0 2.8 5.2 5.2 5.2 5.2s5.2-2.4 5.2-5.2c0-2.2-3-3.5-5.2-1.5z"
        fill="#ff8fb4"
      />
      <circle cx="54" cy="24" r="3.2" fill="#ff9fbe" stroke="#fff" strokeWidth="1.4" />
    </svg>
  )
}

function SvgHearts() {
  return (
    <svg viewBox="0 0 72 56" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      <path
        d="M36 48C36 48 8 30 8 18.5 8 11 14 6 21 6c4.2 0 8 2.2 11 5.6C35 8.2 38.8 6 43 6c7 0 13 5 13 12.5C56 30 36 48 36 48z"
        fill="#ff8fb4"
        stroke="#e11d48"
        strokeWidth="2.2"
      />
      <path
        d="M18 22c0 0-8-6.2-8-10.2C10 9 12.4 7 15 7c1.6 0 3 .8 4 2 1-1.2 2.4-2 4-2 2.6 0 5 2 5 4.8 0 4-8 10.2-8 10.2s0 0 0 0z"
        fill="#ffb7cc"
        stroke="#e11d48"
        strokeWidth="1.6"
        transform="translate(38 -2)"
      />
      <path
        d="M12 16c0 0-6-4.6-6-7.6C6 6.4 7.8 5 9.6 5c1.2 0 2.2.6 3 1.5.8-.9 1.8-1.5 3-1.5 1.8 0 3.6 1.4 3.6 3.4 0 3-6 7.6-6 7.6z"
        fill="#ffd0dc"
        stroke="#e11d48"
        strokeWidth="1.4"
      />
    </svg>
  )
}

function SvgLollipop() {
  return (
    <svg viewBox="0 0 48 72" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      <rect x="21.2" y="34" width="5.2" height="34" rx="2.4" fill="#f4c84a" stroke="#fff" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="20" fill="#fff" />
      <circle cx="24" cy="24" r="17.5" fill="#ff8aa8" />
      <path
        d="M24 7.5c9 0 16.5 7.4 16.5 16.5 0 2.4-.5 4.6-1.4 6.6"
        fill="none"
        stroke="#ffe08a"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M10.2 18.5c2.2-5.2 7.2-9 13-9 2 0 3.8.4 5.5 1.1"
        fill="none"
        stroke="#fff"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path
        d="M24 24c4.8 0 8.8 3.8 8.8 8.6"
        fill="none"
        stroke="#ffe08a"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SvgCherries() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      <path d="M28 8 C22 22 14 30 14 38" fill="none" stroke="#2a2a2a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M28 8 C36 20 46 28 50 38" fill="none" stroke="#2a2a2a" strokeWidth="2.4" strokeLinecap="round" />
      <ellipse cx="36" cy="10" rx="10" ry="6" fill="#7dce6a" stroke="#fff" strokeWidth="2" transform="rotate(-18 36 10)" />
      <path d="M32 8c4 1 8 4 10 8" fill="none" stroke="#5aaa4c" strokeWidth="1.4" />
      <circle cx="14" cy="46" r="12" fill="#e11d2a" stroke="#fff" strokeWidth="2.4" />
      <circle cx="50" cy="48" r="12" fill="#d70f24" stroke="#fff" strokeWidth="2.4" />
      <ellipse cx="10" cy="42" rx="3.2" ry="2" fill="#fff" opacity="0.45" />
      <ellipse cx="46" cy="44" rx="3.2" ry="2" fill="#fff" opacity="0.45" />
    </svg>
  )
}

function SvgDaisy() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="8"
          ry="14"
          fill="#ff9fbe"
          stroke="#fff"
          strokeWidth="1.8"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="10" fill="#e11d2a" stroke="#fff" strokeWidth="2" />
      <circle cx="32" cy="32" r="4.5" fill="#ffd0dc" />
      <path d="M22 48 C18 56 14 60 10 62" fill="none" stroke="#5aaa4c" strokeWidth="2.2" />
      <path d="M42 48 C48 56 54 60 58 62" fill="none" stroke="#5aaa4c" strokeWidth="2.2" />
      <ellipse cx="16" cy="54" rx="8" ry="4.5" fill="#7dce6a" stroke="#fff" strokeWidth="1.4" transform="rotate(-30 16 54)" />
      <ellipse cx="48" cy="54" rx="8" ry="4.5" fill="#7dce6a" stroke="#fff" strokeWidth="1.4" transform="rotate(28 48 54)" />
    </svg>
  )
}

function SvgBow() {
  return (
    <svg viewBox="0 0 56 36" className="h-full w-full overflow-visible drop-shadow-[0_2px_0_#fff]">
      <path d="M28 18 L8 6 C2 18 2 22 8 30 Z" fill="#ff8fb4" stroke="#fff" strokeWidth="2" />
      <path d="M28 18 L48 6 C54 18 54 22 48 30 Z" fill="#ff8fb4" stroke="#fff" strokeWidth="2" />
      <circle cx="28" cy="18" r="6.5" fill="#e11d48" stroke="#fff" strokeWidth="2" />
    </svg>
  )
}

function SvgStar() {
  return (
    <svg viewBox="0 0 32 32" className="h-full w-full overflow-visible">
      <path
        d="M16 2.5l3.4 8.4 9.1.8-6.9 5.8 2.2 8.8L16 21.4 8.2 26.3l2.2-8.8L3.5 11.7l9.1-.8z"
        fill="#ffe08a"
        stroke="#fff"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function ClickMeHeart({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Click me"
      className="absolute bottom-1.5 right-1.5 z-30 h-[4.6rem] w-[4.6rem] sm:bottom-2 sm:right-2 sm:h-[5.25rem] sm:w-[5.25rem]"
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 1.15, repeat: Infinity, ease: 'easeInOut' }}
      whileTap={{ scale: 0.94 }}
    >
      <svg viewBox="0 0 120 110" className="h-full w-full drop-shadow-[0_4px_0_rgba(190,18,60,0.28)]">
        <path
          d="M60 98C60 98 8 64 8 38 8 22 20 10 36 10c8.8 0 16.6 4.4 24 12 7.4-7.6 15.2-12 24-12 16 0 28 12 28 28 0 26-52 60-52 60z"
          fill="#f47aa8"
          stroke="#fff"
          strokeWidth="4"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center pb-1 text-[9px] font-black uppercase leading-tight tracking-wide text-[#3b1d2a] sm:text-[10px]">
        Click
        <br />
        me
      </span>
    </motion.button>
  )
}

function CardWish({ name, message, sender, onNext }) {
  const wish = message?.trim() || DEFAULT_WISH
  const who = name && name !== 'You' ? name : 'you'

  return (
    <CardFrame>
      <div className="relative flex min-h-0 flex-1 flex-col px-0.5 pb-1 pt-1">
        <div
          className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.7rem] p-2 shadow-[0_14px_32px_rgba(190,18,60,0.22)] sm:rounded-[2rem] sm:p-2.5"
          style={{ background: WISH_FRAME }}
        >
          <div
            className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-7 py-5 sm:px-9 sm:py-6"
            style={{
              backgroundImage: `
                radial-gradient(circle at 0 12px, ${WISH_FRAME} 9px, transparent 9.6px),
                radial-gradient(circle at 100% 12px, ${WISH_FRAME} 9px, transparent 9.6px),
                linear-gradient(180deg, #fffefc 0%, #fff6f2 48%, #ffe9e4 100%)
              `,
              backgroundSize: '14px 24px, 14px 24px, 100% 100%',
              backgroundPosition: 'left 4px, right 4px, 0 0',
              backgroundRepeat: 'repeat-y, repeat-y, no-repeat',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  'radial-gradient(#f9c5d1 0.7px, transparent 0.8px), radial-gradient(#f9c5d1 0.7px, transparent 0.8px)',
                backgroundSize: '14px 14px',
                backgroundPosition: '0 0, 7px 7px',
              }}
              aria-hidden
            />
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center text-[clamp(1.05rem,4.4vw,1.55rem)] font-black uppercase tracking-[0.04em] text-[#e11d48]"
            >
              My wish for u
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="relative z-10 mt-0.5 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#e11d48]/70"
            >
              A little note for {who}
            </motion.p>
            <div className="relative z-10 mt-3 min-h-0 flex-1 overflow-y-auto px-0.5">
              <p
                className="text-center font-hand text-[clamp(1.02rem,3.6vw,1.28rem)] font-semibold leading-snug text-[#1f2a44]"
              >
                {wish}
              </p>
              {sender ? (
                <p className="mt-3 text-center font-hand text-lg font-bold text-[#e11d48]">— {sender}</p>
              ) : null}
            </div>
          </div>

          <Sticker className="left-[-2px] top-2 h-12 w-[3.6rem] sm:h-14 sm:w-16" delay={0.05} rotate={-12}>
            <SvgCamera />
          </Sticker>
          <Sticker className="right-1 top-1 h-12 w-[3.8rem] sm:h-14 sm:w-[4.4rem]" delay={0.12} rotate={10}>
            <SvgHearts />
          </Sticker>
          <Sticker className="left-0 top-[38%] h-16 w-11 sm:h-[4.5rem] sm:w-12" delay={0.18} rotate={-8}>
            <SvgLollipop />
          </Sticker>
          <Sticker className="bottom-2 left-1 h-12 w-12 sm:h-14 sm:w-14" delay={0.22} rotate={-6}>
            <SvgCherries />
          </Sticker>
          <Sticker className="bottom-10 right-[4.4rem] h-12 w-12 sm:bottom-12 sm:right-[5.1rem] sm:h-14 sm:w-14" delay={0.28} rotate={8}>
            <SvgDaisy />
          </Sticker>
          <Sticker className="right-[18%] top-[30%] h-7 w-11" delay={0.34} rotate={12}>
            <SvgBow />
          </Sticker>
          <Sticker className="left-[22%] top-1.5 h-6 w-6" delay={0.4} rotate={-16}>
            <SvgStar />
          </Sticker>
          <Sticker className="bottom-[42%] right-2 h-5 w-5" delay={0.46} rotate={20}>
            <SvgStar />
          </Sticker>
          <motion.span
            className="pointer-events-none absolute left-[46%] top-3 z-20 text-lg text-[#ffd36a]"
            animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5], rotate: [0, 20, 0] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            aria-hidden
          >
            ✦
          </motion.span>
          <motion.span
            className="pointer-events-none absolute bottom-[28%] left-[18%] z-20 text-sm text-white"
            animate={{ scale: [0.7, 1.15, 0.7], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.1, delay: 0.4, repeat: Infinity }}
            aria-hidden
          >
            ✧
          </motion.span>

          <ClickMeHeart onClick={onNext} />
        </div>
      </div>
    </CardFrame>
  )
}

function CardLove({ name, media, onNext }) {
  const photos = useMemo(() => {
    const extras = [media?.photoUrl].filter(Boolean)
    const pack = [
      '/gifts/mocha/hug.gif',
      '/gifts/mocha/wish.gif',
      '/gifts/mocha/finale.gif',
      '/gifts/mocha/intro.gif',
      '/gifts/mocha/no.gif',
    ]
    const merged = [...extras, ...pack]
    return merged.filter((src, i) => merged.indexOf(src) === i).slice(0, 5)
  }, [media?.photoUrl])

  const tilts = [-12, -6, 1, 7, -4]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative z-10 flex h-full min-h-0 w-full flex-col overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% -10%, #8f3550 0%, transparent 52%), repeating-linear-gradient(-22deg, transparent 0 22px, rgba(255,255,255,0.035) 22px 44px), #6a1d33',
        }}
        aria-hidden
      />

      <div className="relative flex min-h-0 flex-1 flex-col px-2 pt-3 sm:px-4 sm:pt-5">
        <div className="relative mx-auto w-full max-w-lg shrink-0 pt-3">
          <svg
            className="pointer-events-none absolute inset-x-0 top-5 h-8 w-full sm:top-6"
            viewBox="0 0 100 16"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M1 5 Q 50 15 99 5"
              fill="none"
              stroke="rgba(255,255,255,0.92)"
              strokeWidth="0.55"
              strokeLinecap="round"
            />
          </svg>

          <div className="relative flex items-start justify-center gap-[2px] px-0.5 sm:gap-1.5">
            {photos.map((src, i) => (
              <motion.div
                key={src + i}
                className="relative w-[19%] origin-top"
                initial={{ y: -28, opacity: 0, rotate: tilts[i] }}
                animate={{
                  opacity: 1,
                  y: [0, 5, 0],
                  rotate: [tilts[i], tilts[i] + 3.5, tilts[i] - 2.5, tilts[i]],
                }}
                transition={{
                  opacity: { duration: 0.45, delay: 0.08 * i },
                  y: { duration: 2.6 + i * 0.18, repeat: Infinity, ease: 'easeInOut', delay: 0.1 * i },
                  rotate: { duration: 3.1 + i * 0.2, repeat: Infinity, ease: 'easeInOut', delay: 0.1 * i },
                }}
              >
                <span className="absolute -top-2 left-1/2 z-10 h-3.5 w-2.5 -translate-x-1/2 rounded-[1px] bg-[#16325c] shadow-sm sm:h-4 sm:w-3" />
                <span className="absolute -top-[7px] left-1/2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#0f2342]" />
                <div className="rounded-[3px] bg-white p-[3px] pb-3 shadow-[0_8px_18px_rgba(0,0,0,0.28)] sm:p-1 sm:pb-4">
                  <div className="aspect-[3/4] overflow-hidden bg-[#b7d8ea]">
                    <motion.img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      draggable={false}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative mt-auto flex min-h-0 flex-1 flex-col items-center justify-end pb-3 sm:pb-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="pointer-events-none absolute text-[#ff8fb4]"
              style={{
                left: `${12 + i * 15}%`,
                top: `${8 + (i % 3) * 18}%`,
                fontSize: 10 + (i % 4) * 5,
              }}
              animate={{ y: [0, -8, 0], opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
              transition={{ duration: 2.2 + i * 0.2, delay: i * 0.15, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              ♥
            </motion.span>
          ))}

          <motion.p
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 14 }}
            className="px-3 text-center font-black leading-[0.92] tracking-wide"
            style={{
              fontSize: 'clamp(2.05rem, 11vw, 3.55rem)',
              backgroundImage:
                'radial-gradient(circle, rgba(255,255,255,0.95) 1.15px, #ff7aa8 1.35px)',
              backgroundSize: '8px 8px',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextStroke: '0.4px rgba(255,182,203,0.35)',
              filter: 'drop-shadow(0 3px 0 rgba(90,16,36,0.25))',
            }}
          >
            I LOVE YOU
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-2 max-w-sm px-4 text-center font-display text-[clamp(0.95rem,3.4vw,1.2rem)] italic text-white/95"
          >
            {name && name !== 'You'
              ? `${name}, you don’t know how much you mean to me`
              : "You don’t know how much you mean to me"}
          </motion.p>

          <div className="mt-4 flex w-full max-w-lg items-end justify-between px-3 sm:px-5">
            <motion.div
              className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden
            >
              <LoveCake />
            </motion.div>
            <motion.button
              type="button"
              onClick={onNext}
              className="flex flex-col items-center"
              animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="h-14 w-14 sm:h-16 sm:w-16">
                <LoveGift />
              </span>
              <span className="mt-1 text-[11px] font-semibold text-white sm:text-xs">Click here</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function LoveCake() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible drop-shadow-md">
      <ellipse cx="32" cy="58" rx="18" ry="4" fill="rgba(0,0,0,0.18)" />
      <rect x="12" y="38" width="40" height="18" rx="4" fill="#c4b5fd" />
      <path d="M12 42 q5 5 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="18" y="24" width="28" height="16" rx="4" fill="#f9a8d4" />
      <path d="M18 28 q4 4 8 0 t8 0 t8 0 t8 0" fill="none" stroke="#fff" strokeWidth="1.8" />
      <rect x="22" y="16" width="3" height="9" rx="1" fill="#fde68a" />
      <rect x="31" y="14" width="3" height="11" rx="1" fill="#fde68a" />
      <rect x="40" y="16" width="3" height="9" rx="1" fill="#fde68a" />
      <circle cx="23.5" cy="15" r="2.2" fill="#fb7185" />
      <circle cx="32.5" cy="13" r="2.2" fill="#fb7185" />
      <circle cx="41.5" cy="15" r="2.2" fill="#fb7185" />
    </svg>
  )
}

function LoveGift() {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible drop-shadow-md">
      <rect x="12" y="26" width="40" height="28" rx="4" fill="#fb7185" />
      <rect x="12" y="26" width="40" height="8" rx="3" fill="#f9a8d4" />
      <rect x="29" y="26" width="6" height="28" fill="#fff" />
      <rect x="12" y="36" width="40" height="5" fill="#fff" />
      <path d="M32 26 C24 10 16 18 32 26 C48 18 40 10 32 26" fill="#fff" />
      <circle cx="32" cy="22" r="4" fill="#fce7f3" />
    </svg>
  )
}

function CardCakeCut({ name, onNext }) {
  const [phase, setPhase] = useState('ready')
  const cutting = phase === 'cutting' || phase === 'done'

  function cutCake() {
    if (phase !== 'ready') return
    setPhase('cutting')
    window.setTimeout(() => {
      fireFinale()
      setPhase('done')
    }, 620)
  }

  return (
    <CardFrame>
      <div className="shrink-0">
        <ArcTitle>{phase === 'done' ? 'You cut the cake' : 'Cut the cake'}</ArcTitle>
        <Sub>
          {phase === 'done'
            ? 'Here’s your slice — saved just for you.'
            : 'Tap the cake. The knife will cut, then your slice pops out.'}
        </Sub>
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative h-[13.5rem] w-[15rem] sm:h-60 sm:w-64">
          {phase !== 'done' ? (
            <button
              type="button"
              onClick={cutCake}
              className="absolute inset-x-0 bottom-2 flex justify-center"
              aria-label="Cut the cake"
            >
              <motion.div
                className="h-36 w-36 sm:h-44 sm:w-44"
                animate={phase === 'ready' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                transition={{ duration: 1.1, repeat: Infinity }}
              >
                <PartyCake />
              </motion.div>
            </button>
          ) : (
            <div className="absolute inset-x-0 bottom-8 flex justify-center gap-3">
              <motion.div
                className="h-28 w-24 origin-bottom"
                initial={{ x: 0, rotate: 0 }}
                animate={{ x: -22, rotate: -10 }}
                transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              >
                <PartyCake />
              </motion.div>
              <motion.div
                className="h-28 w-24 origin-bottom"
                initial={{ x: 0, rotate: 0 }}
                animate={{ x: 22, rotate: 10 }}
                transition={{ type: 'spring', stiffness: 140, damping: 14 }}
              >
                <PartyCake />
              </motion.div>
            </div>
          )}

          <motion.div
            className="pointer-events-none absolute right-1 top-0 h-28 w-16 sm:h-32 sm:w-20"
            initial={{ x: 18, y: -8, rotate: 28, opacity: 1 }}
            animate={
              cutting
                ? { x: [-4, -72], y: [0, 52], rotate: [28, -38], opacity: phase === 'done' ? 0 : 1 }
                : { y: [0, 6, 0], rotate: [24, 32, 24] }
            }
            transition={
              cutting
                ? { duration: 0.55, ease: 'easeIn' }
                : { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <CakeKnife />
          </motion.div>
        </div>

        <AnimatePresence>
          {phase === 'done' ? (
            <motion.div
              key="slice"
              initial={{ y: 50, opacity: 0, scale: 0.6 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              className="mt-1 flex flex-col items-center"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#be123c]">
                Here is your slice
              </p>
              <div className="mt-1 h-16 w-20 sm:h-[4.5rem] sm:w-24">
                <CakeSlice />
              </div>
              {name && name !== 'You' ? (
                <p className="mt-1 font-hand text-lg font-bold text-[#e11d48]">For {name}</p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {phase === 'done' ? <NextBar onClick={onNext} /> : <div className="h-4 shrink-0" />}
    </CardFrame>
  )
}

function PartyCake() {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible drop-shadow-lg">
      <ellipse cx="60" cy="112" rx="38" ry="6" fill="rgba(0,0,0,0.16)" />
      <path d="M22 78 h76 v22 a10 10 0 0 1 -10 10 H32 a10 10 0 0 1 -10 -10 z" fill="#c4b5fd" />
      <path d="M22 84 q8 8 16 0 t16 0 t16 0 t16 0 t12 0" fill="none" stroke="#fff" strokeWidth="3.2" />
      <path d="M32 52 h56 v28 a8 8 0 0 1 -8 8 H40 a8 8 0 0 1 -8 -8 z" fill="#f9a8d4" />
      <path d="M32 58 q7 7 14 0 t14 0 t14 0 t14 0" fill="none" stroke="#fff" strokeWidth="2.8" />
      <rect x="42" y="28" width="5" height="26" rx="2" fill="#fde68a" />
      <rect x="58" y="22" width="5" height="32" rx="2" fill="#fde68a" />
      <rect x="74" y="28" width="5" height="26" rx="2" fill="#fde68a" />
      <circle cx="44.5" cy="26" r="4" fill="#fb7185" />
      <circle cx="60.5" cy="20" r="4" fill="#fb7185" />
      <circle cx="76.5" cy="26" r="4" fill="#fb7185" />
      <path d="M44.5 22 c0-6 4-8 0-10" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M60.5 16 c0-6 4-8 0-10" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
      <path d="M76.5 22 c0-6 4-8 0-10" fill="none" stroke="#fbbf24" strokeWidth="1.6" />
    </svg>
  )
}

function CakeKnife() {
  return (
    <svg viewBox="0 0 48 140" className="h-full w-full overflow-visible drop-shadow-md">
      <rect x="18" y="4" width="12" height="42" rx="4" fill="#e11d48" />
      <rect x="16" y="40" width="16" height="8" rx="2" fill="#9f1239" />
      <path d="M20 48 L28 48 L30 132 L18 132 Z" fill="#e8eef5" stroke="#cbd5e1" strokeWidth="1.2" />
      <path d="M20 48 L24 132" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.7" />
    </svg>
  )
}

function CakeSlice() {
  return (
    <svg viewBox="0 0 80 70" className="h-full w-full overflow-visible drop-shadow-md">
      <path d="M8 58 L40 12 L72 58 Z" fill="#f9a8d4" />
      <path d="M8 58 L40 12 L44 14 L14 58 Z" fill="#c4b5fd" />
      <path d="M40 12 L72 58 L8 58" fill="none" stroke="#fff" strokeWidth="2" />
      <path d="M18 50 q8 6 14 0 t14 0 t14 0" fill="none" stroke="#fff" strokeWidth="2" />
      <rect x="37" y="6" width="4" height="14" rx="1" fill="#fde68a" />
      <circle cx="39" cy="6" r="3" fill="#fb7185" />
    </svg>
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
export function MilkMochaInteractive({ name = 'You', sender, message, media, preview, fullscreen }) {
  const [step, setStep] = useState('intro')
  const dateLabel = useMemo(formatCardDate, [])
  const cardNumber =
    { intro: 1, no: 2, birthday: 3, wish: 4, hug: 5, cake: 6, finale: 7 }[step] || 1
  const loveCard = step === 'hug'

  return (
    <div
      className={cn(
        'relative isolate flex w-full flex-col overflow-hidden',
        fullscreen ? 'h-full min-h-0' : 'min-h-[70svh]',
      )}
      style={{ background: loveCard ? '#6a1d33' : PINK }}
    >
      {loveCard ? null : (
        <>
          <HeartWallpaper />
          <RisingBits />
          <BalloonSky />
        </>
      )}
      {preview ? (
        <div className="pointer-events-none absolute left-2 top-2 z-30 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-hm-primary sm:left-3 sm:top-3 sm:text-[10px]">
          Full demo
        </div>
      ) : null}
      <p
        className={cn(
          'relative z-10 shrink-0 px-2 pt-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] sm:pt-2 sm:text-[11px]',
          loveCard ? 'text-white/80' : 'text-[#be123c]',
        )}
      >
        ft. Tuji Bunny · interactive
      </p>
      <p
        className={cn(
          'relative z-10 mb-1 shrink-0 text-center text-[10px] font-bold uppercase tracking-[0.16em]',
          loveCard ? 'text-white/60' : 'text-[#be123c]/70',
        )}
      >
        Card {cardNumber}/7
      </p>
      <div className="relative z-10 flex min-h-0 flex-1 items-stretch">
        <SideColumn side="left" step={step} />
        <div className="relative z-10 flex h-full min-h-0 min-w-0 flex-1 justify-center">
          <div className={cn('flex h-full min-h-0 w-full justify-center', loveCard ? 'max-w-none' : 'max-w-lg')}>
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
            {step === 'hug' ? (
              <CardLove key="hug" name={name} media={media} onNext={() => setStep('cake')} />
            ) : null}
            {step === 'cake' ? (
              <CardCakeCut key="cake" name={name} onNext={() => setStep('finale')} />
            ) : null}
            {step === 'finale' ? (
              <CardFinale key="finale" dateLabel={dateLabel} sender={sender} name={name} />
            ) : null}
          </AnimatePresence>
          </div>
        </div>
        <SideColumn side="right" step={step} />
      </div>
    </div>
  )
}
