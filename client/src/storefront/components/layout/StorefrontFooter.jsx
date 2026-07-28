import { Link } from 'react-router-dom'
import { BrandLogo } from '@/storefront/components/brand/BrandLogo'
import { SocialLinks } from '@/storefront/components/layout/SocialLinks'

const footerColumns = [
  {
    title: 'Policy Info',
    links: [
      { label: 'Terms & Conditions', path: '/terms' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Use', path: '/terms-of-use' },
      { label: 'Disclaimer', path: '/disclaimer' },
    ],
  },
  {
    title: 'About Company',
    links: [
      { label: 'About Us', path: '/about' },
      { label: 'Uniquworld Team', path: '/about#team' },
      { label: 'Careers', path: '/careers' },
      { label: 'Testimonials', path: '/testimonials' },
      { label: 'News Room', path: '/news' },
      { label: 'Blog', path: '/blog' },
    ],
  },
  {
    title: 'Uniquworld Business',
    links: [
      { label: 'Decorator Services', path: '/surprise/local' },
      { label: 'Corporate Service', path: '/corporate' },
      { label: 'Affiliate Program', path: '/affiliate' },
      { label: 'Retail Stores', path: '/store' },
      { label: 'Franchise', path: '/franchise' },
    ],
  },
  {
    title: 'Need Help ?',
    links: [
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQs', path: '/faq' },
    ],
  },
]

export function StorefrontFooter() {
  return (
    <footer
      id="footer"
      className="relative mt-10 overflow-hidden border-t border-hm-border bg-gradient-to-br from-hm-primary via-[#8f2448] to-[#c44536] text-white"
    >
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-hm-teal/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-hm-gold/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-14 sm:px-8 lg:grid-cols-5 lg:gap-10">
        <div className="col-span-2 lg:col-span-1">
          <BrandLogo
            imgClassName="h-10 rounded-lg bg-white px-2 py-1 sm:h-11"
            className="rounded-lg"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            India&apos;s premium gifting experience — personalized, corporate, and surprise.
          </p>
          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
              Follow us
            </p>
            <SocialLinks className="mt-3" variant="dark" />
          </div>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              {col.title}
            </p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((item) => (
                <li key={`${item.path}-${item.label}`}>
                  <Link
                    to={item.path}
                    className="inline-flex min-h-9 items-center text-sm text-white/80 hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            {col.title === 'Need Help ?' ? (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                  Our Partner
                </p>
                <a
                  href="https://www.techackode.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center rounded-lg bg-white px-3 py-2 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                  aria-label="Techackode — visit www.techackode.com"
                >
                  <img
                    src="/brand/thk.webp"
                    alt="Techackode"
                    width={140}
                    height={40}
                    className="h-8 w-auto object-contain sm:h-9"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="relative border-t border-white/15 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-xs text-white/60 sm:text-left">
            © {new Date().getFullYear()} Uniquworld · Crafted for memorable moments
          </p>
          <SocialLinks variant="dark" className="justify-center" />
        </div>
      </div>
    </footer>
  )
}
