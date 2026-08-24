import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin, Phone } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

const THEMES = {
  'inv-wed-classic': {
    shell: 'bg-[#f7f2ea] text-[#1a2d4d]',
    frame: 'border-[#c4a574]/50',
    accent: 'text-[#8b6914]',
    kicker: 'Wedding celebration',
  },
  'inv-wed-garden': {
    shell: 'bg-[#f3f6f0] text-[#1f3d2e]',
    frame: 'border-[#7d9b76]/40',
    accent: 'text-[#4a6b42]',
    kicker: 'With love & blooms',
  },
  'inv-wed-midnight': {
    shell: 'bg-[#0c1424] text-[#f5e6c8]',
    frame: 'border-[#c4a574]/35',
    accent: 'text-[#d4af37]',
    kicker: 'Evening ceremony',
  },
  'inv-wed-mandala': {
    shell: 'bg-[#1a1210] text-[#f0e4d4]',
    frame: 'border-[#c45c26]/40',
    accent: 'text-[#e8b86d]',
    kicker: 'Sacred celebration',
  },
  'inv-bd-confetti': {
    shell: 'bg-[#0f2a28] text-[#e8fff8]',
    frame: 'border-teal-300/30',
    accent: 'text-teal-200',
    kicker: 'You’re invited',
  },
  'inv-bd-balloon': {
    shell: 'bg-[#e8f4fb] text-[#0a2d4d]',
    frame: 'border-sky-300/50',
    accent: 'text-sky-700',
    kicker: 'Party invite',
  },
  'inv-bd-neon': {
    shell: 'bg-[#0a0612] text-[#f5e9ff]',
    frame: 'border-fuchsia-400/30',
    accent: 'text-fuchsia-300',
    kicker: 'Night bash',
  },
  'inv-bd-story': {
    shell: 'bg-[#faf8f5] text-[#1a1a1a]',
    frame: 'border-[#1a2d4d]/20',
    accent: 'text-[#0a2d4d]',
    kicker: 'Birthday celebration',
  },
  'inv-hw-keys': {
    shell: 'bg-[#eef5f0] text-[#1f4e3d]',
    frame: 'border-emerald-700/25',
    accent: 'text-emerald-800',
    kicker: 'Housewarming',
  },
  'inv-hw-hearth': {
    shell: 'bg-[#1c1612] text-[#f3e8d8]',
    frame: 'border-amber-700/35',
    accent: 'text-amber-200',
    kicker: 'Come home with us',
  },
  'inv-hw-garden': {
    shell: 'bg-[#f0f5ec] text-[#243528]',
    frame: 'border-lime-800/20',
    accent: 'text-lime-900',
    kicker: 'Open house',
  },
  'inv-hw-minimal': {
    shell: 'bg-white text-[#111827]',
    frame: 'border-gray-300',
    accent: 'text-gray-600',
    kicker: 'You’re invited',
  },
  'inv-bs-cloud': {
    shell: 'bg-[#f4f6fa] text-[#334155]',
    frame: 'border-slate-300/60',
    accent: 'text-slate-500',
    kicker: 'Baby shower',
  },
  'inv-bs-bloom': {
    shell: 'bg-[#faf5f7] text-[#4a3040]',
    frame: 'border-rose-200',
    accent: 'text-rose-700/80',
    kicker: 'A little one arrives',
  },
  'inv-bs-star': {
    shell: 'bg-[#121826] text-[#e8eef8]',
    frame: 'border-indigo-300/25',
    accent: 'text-indigo-200',
    kicker: 'Twinkle invite',
  },
  'inv-bs-letter': {
    shell: 'bg-[#f7f1e8] text-[#3d2c1e]',
    frame: 'border-[#c4a574]/40',
    accent: 'text-[#6b4f2a]',
    kicker: 'Baby shower',
  },
}

function DetailRow({ icon: Icon, label, value, className }) {
  if (!value) return null
  return (
    <div className={cn('flex items-start gap-3 text-left', className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 opacity-70" aria-hidden />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] opacity-60">{label}</p>
        <p className="mt-0.5 text-sm leading-snug sm:text-base">{value}</p>
      </div>
    </div>
  )
}

/**
 * Full-screen digital invitation card.
 * recipientName = honoree / couple / birthday star
 * senderName = hosts
 * media may include eventDate, eventTime, venue, rsvpContact, photoUrl
 */
export function InvitationExperience({
  templateId,
  occasionTitle = 'You’re invited',
  recipientName = 'Our guests',
  senderName = '',
  message = '',
  media = {},
  className,
}) {
  const theme = THEMES[templateId] || THEMES['inv-bd-story']
  const eventDate = media?.eventDate || ''
  const eventTime = media?.eventTime || ''
  const venue = media?.venue || ''
  const rsvp = media?.rsvpContact || ''
  const photo = media?.photoUrl || ''

  return (
    <div className={cn('relative min-h-svh w-full overflow-hidden', theme.shell, className)}>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, currentColor 1px, transparent 1px), radial-gradient(circle at 80% 60%, currentColor 1px, transparent 1px)',
          backgroundSize: '28px 28px, 36px 36px',
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-svh max-w-lg flex-col justify-center px-5 py-12 sm:px-8">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'relative overflow-hidden rounded-[1.75rem] border px-6 py-10 text-center shadow-2xl sm:px-10 sm:py-12',
            theme.frame,
            'bg-black/[0.03] backdrop-blur-[2px]',
          )}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.22em' }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className={cn('text-[11px] font-semibold uppercase', theme.accent)}
          >
            {theme.kicker}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.65 }}
            className="mt-4 font-display text-4xl leading-tight sm:text-5xl"
          >
            {recipientName}
          </motion.h1>

          <p className="mt-3 text-sm opacity-75 sm:text-base">{occasionTitle}</p>

          {photo ? (
            <motion.img
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              src={photo}
              alt=""
              className="mx-auto mt-6 h-40 w-40 rounded-full object-cover shadow-lg ring-2 ring-current/10 sm:h-48 sm:w-48"
            />
          ) : null}

          {message ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mx-auto mt-6 max-w-sm text-sm leading-relaxed opacity-85 sm:text-[15px]"
            >
              {message}
            </motion.p>
          ) : null}

          <div className="mx-auto mt-8 max-w-sm space-y-4 border-t border-current/15 pt-6">
            <DetailRow icon={Calendar} label="Date" value={eventDate} />
            <DetailRow icon={Clock} label="Time" value={eventTime} />
            <DetailRow icon={MapPin} label="Venue" value={venue} />
            <DetailRow icon={Phone} label="RSVP" value={rsvp} />
          </div>

          {senderName ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className={cn('mt-8 text-xs font-semibold uppercase tracking-[0.16em]', theme.accent)}
            >
              Hosted by {senderName}
            </motion.p>
          ) : null}
        </motion.article>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.18em] opacity-50">
          Uniquworld · Digital Invitation
        </p>
      </div>
    </div>
  )
}
