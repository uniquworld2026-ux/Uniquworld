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

function ColumnHeading({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
      {children}
    </p>
  )
}

export function StorefrontFooter() {
  return (
    <footer
      id="footer"
      className="relative mt-10 overflow-hidden border-t border-hm-border bg-gradient-to-br from-hm-primary via-[#0d3a63] to-[#123f6b] text-white"
    >
      <div className="pointer-events-none absolute -right-16 top-0 h-56 w-56 rounded-full bg-hm-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-12 lg:gap-x-8">
          {/* Brand */}
          <div className="col-span-2 flex flex-col sm:col-span-3 lg:col-span-3">
            <BrandLogo
              imgClassName="h-10 rounded-md bg-white px-2 py-1 sm:h-11"
              className="self-start rounded-md"
            />
            <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-white/75">
              India&apos;s premium gifting experience — personalized, corporate, and surprise.
            </p>
            <div className="mt-5">
              <ColumnHeading>Follow us</ColumnHeading>
              <SocialLinks
                className="mt-3 flex-nowrap"
                variant="dark"
                iconClassName="min-h-9 min-w-9"
              />
            </div>
          </div>

          {/* Link columns — equal width on desktop */}
          {footerColumns.map((col) => (
            <div
              key={col.title}
              className={`flex flex-col ${
                col.title === 'Need Help ?'
                  ? 'col-span-2 sm:col-span-1 lg:col-span-2'
                  : 'col-span-1 lg:col-span-2'
              }`}
            >
              <ColumnHeading>{col.title}</ColumnHeading>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((item) => (
                  <li key={`${item.path}-${item.label}`}>
                    <Link
                      to={item.path}
                      className="inline-flex min-h-8 items-center text-sm leading-snug text-white/80 transition hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {col.title === 'Need Help ?' ? (
                <div className="mt-8 flex flex-col">
                  <ColumnHeading>Our Partner</ColumnHeading>
                  <a
                    href="https://www.techackode.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-fit max-w-full items-center self-start rounded-md bg-white px-2.5 py-1.5 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    aria-label="Techackode — visit www.techackode.com"
                  >
                    <img
                      src="/brand/thk.webp"
                      alt="Techackode"
                      width={120}
                      height={36}
                      className="h-7 w-auto max-w-[7.5rem] object-contain object-left sm:h-8"
                      loading="lazy"
                      decoding="async"
                    />
                  </a>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/15">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:justify-between sm:px-8">
          <p className="text-center text-xs leading-none text-white/60 sm:text-left">
            © {new Date().getFullYear()} Uniquworld · Crafted for memorable moments
          </p>
        </div>
      </div>
    </footer>
  )
}
