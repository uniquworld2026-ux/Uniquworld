import { socialLinks } from '@/storefront/config/social'
import { cn } from '@/shared/utils/cn'

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 8h2.5V4.5H14c-2.48 0-4.5 2.02-4.5 4.5v2H7v3.5h2.5V20H13v-5.5h2.35L16 11H13V9c0-.55.45-1 1-1Z" />
    </svg>
  )
}

function TwitterIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 3h2.8l-6.1 7 7.2 11h-5.6l-4.4-6.7L6 21H3.2l6.5-7.4L3 3h5.8l4 6.1L17.5 3Zm-1 16.2h1.6L7.6 4.7H6L16.5 19.2Z" />
    </svg>
  )
}

function LinkedinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 4a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92ZM20.44 20h-3.37v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.69V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.2-1.75 3.42 0 4.06 2.25 4.06 5.18V20Z" />
    </svg>
  )
}

function YoutubeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8ZM10 15.2V8.8L15.5 12 10 15.2Z" />
    </svg>
  )
}

const icons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  youtube: YoutubeIcon,
}

/**
 * Social media icon row — used in footer + About.
 */
export function SocialLinks({ className, iconClassName, variant = 'light' }) {
  const tone =
    variant === 'dark'
      ? 'border-white/25 text-white/80 hover:border-white hover:bg-white/10 hover:text-white'
      : 'border-hm-border text-hm-text-muted hover:border-hm-accent hover:bg-hm-muted hover:text-hm-primary'

  return (
    <ul className={cn('flex flex-wrap items-center gap-2.5', className)}>
      {socialLinks.map((item) => {
        const Icon = icons[item.id] || InstagramIcon
        return (
          <li key={item.id}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              title={item.label}
              className={cn(
                'inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border transition',
                tone,
                iconClassName,
              )}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        )
      })}
    </ul>
  )
}
