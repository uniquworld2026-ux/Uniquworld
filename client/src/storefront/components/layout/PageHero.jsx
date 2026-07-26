import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

export function PageHero({ eyebrow, title, description, actions, className }) {
  return (
    <section className={cn('border-b border-hm-border bg-hm-muted/40 py-10', className)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 font-display text-4xl tracking-tight text-hm-text sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm text-hm-text-muted sm:text-base">{description}</p>
        ) : null}
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  )
}

export function AccountNav() {
  const links = [
    { to: '/account', label: 'Overview', end: true },
    { to: '/account/orders', label: 'Orders' },
    { to: '/account/profile', label: 'Profile' },
    { to: '/account/addresses', label: 'Addresses' },
    { to: '/account/notifications', label: 'Notifications' },
    { to: '/wishlist', label: 'Wishlist' },
  ]

  return (
    <nav className="flex flex-wrap gap-2 border-b border-hm-border pb-4">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="rounded-full border border-hm-border px-3.5 py-1.5 text-xs font-semibold text-hm-text-muted hover:border-hm-accent hover:text-hm-text"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
