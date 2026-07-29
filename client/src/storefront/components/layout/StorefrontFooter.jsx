import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { SocialLinks } from '@/storefront/components/layout/SocialLinks'
import { cn } from '@/shared/utils/cn'

const shopLinks = [
  { label: 'All gifts', path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'Personalized', path: '/personalized' },
  { label: 'Corporate', path: '/corporate' },
  { label: 'Surprise experiences', path: '/surprise/local' },
  { label: 'Retail store', path: '/store' },
]

const companyLinks = [
  { label: 'About Us', path: '/about' },
  { label: 'Our team', path: '/about#team' },
  { label: 'Careers', path: '/careers' },
  { label: 'Blog', path: '/blog' },
  { label: 'News Room', path: '/news' },
  { label: 'Testimonials', path: '/testimonials' },
]

const businessLinks = [
  { label: 'Corporate service', path: '/corporate' },
  { label: 'Decorator services', path: '/surprise/local' },
  { label: 'Affiliate program', path: '/affiliate' },
  { label: 'Franchise', path: '/franchise' },
  { label: 'Bulk orders', path: '/bulk-orders' },
]

const helpLinks = [
  { label: 'Contact Us', path: '/contact' },
  { label: 'FAQs', path: '/faq' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Privacy Policy', path: '/privacy' },
  { label: 'Terms of Use', path: '/terms-of-use' },
  { label: 'Disclaimer', path: '/disclaimer' },
]

const columns = [
  { title: 'Shop', links: shopLinks },
  { title: 'Company', links: companyLinks },
  { title: 'Business', links: businessLinks },
  { title: 'Help', links: helpLinks },
]

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group/link inline-flex min-h-9 items-center gap-1 text-[0.9375rem] text-hm-text-muted transition-colors duration-200 hover:text-hm-primary"
    >
      <span className="relative">
        {children}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-hm-accent transition-transform duration-300 group-hover/link:scale-x-100" />
      </span>
    </Link>
  )
}

/**
 * Storefront footer — brand-led composition with shop / company / help links.
 */
export function StorefrontFooter() {
  const year = new Date().getFullYear()

  return (
    <footer id="footer" className="relative mt-16 text-hm-text">
      {/* Atmosphere wash */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(217,44,43,0.08),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_20%,rgba(10,45,77,0.08),transparent_50%),linear-gradient(180deg,var(--hm-bg)_0%,var(--hm-elevated)_38%,#e8eef5_100%)]"
      />

      {/* Brand banner */}
      <div className="border-y border-hm-border/80 bg-hm-elevated/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:py-12">
          <div className="max-w-xl">
            <BrandLogo
              imgClassName="h-11 sm:h-12"
              className="origin-left transition-transform duration-500 hover:scale-[1.02]"
            />
            <p className="mt-5 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1] tracking-tight text-hm-primary">
              Make a Moment,
              <br />
              <span className="text-hm-accent">Unique the world.</span>
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-hm-text-muted sm:text-[0.9375rem]">
              Personalized keepsakes, corporate gifting, and surprise experiences — crafted across
              India.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            <div className="flex flex-wrap gap-2.5">
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-hm-primary px-5 text-sm font-semibold text-white transition duration-300 hover:bg-hm-primary-hover"
              >
                Talk to us
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-hm-border bg-hm-elevated px-5 text-sm font-semibold text-hm-primary transition duration-300 hover:border-hm-accent hover:text-hm-accent"
              >
                Browse gifts
              </Link>
            </div>
            <SocialLinks className="justify-start lg:justify-end" iconClassName="min-h-10 min-w-10" />
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {columns.map((col, index) => (
            <div
              key={col.title}
              className={cn(
                'animate-[hm-fade-up_0.5s_ease-out_both]',
                index === 1 && '[animation-delay:60ms]',
                index === 2 && '[animation-delay:120ms]',
                index === 3 && '[animation-delay:180ms]',
              )}
            >
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-hm-primary">
                <span className="inline-block h-1 w-5 rounded-full bg-hm-accent" aria-hidden />
                {col.title}
              </p>
              <ul className="mt-4 flex flex-col gap-0.5">
                {col.links.map((item) => (
                  <li key={`${col.title}-${item.path}-${item.label}`}>
                    <FooterLink to={item.path}>{item.label}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip — not cards; one purpose */}
        <div className="mt-12 grid gap-6 border-t border-hm-border pt-10 sm:grid-cols-3">
          <a
            href="mailto:hello@uniquworld.in"
            className="group flex items-start gap-3 transition duration-300 hover:translate-x-0.5"
          >
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hm-accent/10 text-hm-accent">
              <Mail className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                Email
              </span>
              <span className="mt-1 block text-sm font-medium text-hm-primary group-hover:text-hm-accent">
                hello@uniquworld.in
              </span>
            </span>
          </a>
          <a
            href="tel:+919876543210"
            className="group flex items-start gap-3 transition duration-300 hover:translate-x-0.5"
          >
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hm-primary/10 text-hm-primary">
              <Phone className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                Call
              </span>
              <span className="mt-1 block text-sm font-medium text-hm-primary group-hover:text-hm-accent">
                +91 98765 43210
              </span>
            </span>
          </a>
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-hm-primary/10 text-hm-primary">
              <MapPin className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-hm-text-subtle">
                Based in
              </span>
              <span className="mt-1 block text-sm font-medium text-hm-primary">
                India · Delivering nationwide
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-hm-border bg-hm-primary text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-center text-xs leading-relaxed text-white/65 sm:text-left">
            © {year} Uniquworld. Crafted for memorable moments.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/45">
                Partner
              </span>
              <a
                href="https://www.techackode.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                aria-label="Techackode — visit www.techackode.com"
              >
                <img
                  src="/brand/thk.webp"
                  alt="Techackode"
                  width={120}
                  height={36}
                  className="h-6 w-auto max-w-[6.5rem] object-contain object-left sm:h-7"
                  loading="lazy"
                  decoding="async"
                />
              </a>
            </div>
            <nav
              aria-label="Legal"
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-white/60"
            >
              <Link to="/privacy" className="transition hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="transition hover:text-white">
                Terms
              </Link>
              <Link to="/disclaimer" className="transition hover:text-white">
                Disclaimer
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
