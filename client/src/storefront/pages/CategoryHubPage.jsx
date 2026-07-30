import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { giftCategoryDirectory } from '@/storefront/data/giftCategoryDirectory'
import { cn } from '@/shared/utils/cn'

/**
 * Category hub — left sidebar of sections + 4-column subcategory cards.
 * Links into /products?category=… for shopping.
 */
export function CategoryHubPage() {
  const [params] = useSearchParams()
  const filterCategory = params.get('category')
  const [activeId, setActiveId] = useState(giftCategoryDirectory[0]?.id || '')
  const [query, setQuery] = useState('')

  // Legacy deep-links with ?category= still open the product listing
  if (filterCategory) {
    return <Navigate to={`/products?category=${encodeURIComponent(filterCategory)}`} replace />
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return giftCategoryDirectory
    return giftCategoryDirectory
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [query])

  useEffect(() => {
    if (!filtered.length) return
    if (!filtered.some((s) => s.id === activeId)) {
      setActiveId(filtered[0].id)
    }
  }, [filtered, activeId])

  useEffect(() => {
    const nodes = filtered.map((s) => document.getElementById(`cat-section-${s.id}`)).filter(Boolean)
    if (!nodes.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id.replace('cat-section-', ''))
        }
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.1 },
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [filtered])

  function scrollToSection(id) {
    setActiveId(id)
    document.getElementById(`cat-section-${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-[70svh] bg-hm-bg">
      <div className="border-b border-hm-border bg-hm-elevated">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-hm-accent">
              Browse gifts
            </p>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-hm-primary sm:text-4xl">
              Categories
            </h1>
            <p className="mt-2 max-w-xl text-sm text-hm-text-muted">
              Pick a collection — corporate kits, wedding favours, handmade crafts, and more.
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <span className="sr-only">Search categories</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hm-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories…"
              className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg pl-10 pr-3 text-sm outline-none focus:border-hm-accent focus:ring-2 focus:ring-hm-ring"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-0 lg:grid-cols-[220px_1fr]">
        {/* Side nav */}
        <aside className="border-b border-hm-border lg:border-b-0 lg:border-r lg:border-hm-border">
          <div className="sticky top-[var(--hm-header-offset,7.5rem)] max-h-[calc(100svh-var(--hm-header-offset,7.5rem))] overflow-y-auto p-3 sm:p-4">
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-hm-text-subtle">
              Sections
            </p>
            <nav className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none lg:flex-col lg:overflow-visible lg:pb-0">
              {filtered.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full',
                    activeId === section.id
                      ? 'bg-hm-primary text-white'
                      : 'text-hm-text-muted hover:bg-hm-muted hover:text-hm-primary',
                  )}
                >
                  <span className="text-base leading-none" aria-hidden>
                    {section.emoji}
                  </span>
                  <span className="truncate font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
            <Link
              to="/products"
              className="mt-4 hidden items-center gap-1 px-2 text-xs font-semibold text-hm-accent hover:underline lg:inline-flex"
            >
              View all products
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </aside>

        {/* Cards — 4 per row */}
        <div className="space-y-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {filtered.length === 0 ? (
            <p className="py-16 text-center text-sm text-hm-text-muted">
              No categories match “{query}”.
            </p>
          ) : null}

          {filtered.map((section) => (
            <section
              key={section.id}
              id={`cat-section-${section.id}`}
              className="scroll-mt-[calc(var(--hm-header-offset,7.5rem)+1rem)]"
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {section.emoji}
                </span>
                <h2 className="font-display text-2xl tracking-tight text-hm-primary sm:text-3xl">
                  {section.title}
                </h2>
                <span className="ml-1 rounded-full bg-hm-muted px-2 py-0.5 text-[11px] font-semibold text-hm-text-muted">
                  {section.items.length}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                {section.items.map((item) => (
                  <Link
                    key={`${section.id}-${item.slug}`}
                    to={item.path}
                    className="group overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated shadow-hm-soft transition duration-300 hover:-translate-y-0.5 hover:border-hm-accent/40 hover:shadow-hm-card"
                  >
                    <div className="aspect-[5/4] overflow-hidden bg-hm-muted">
                      <img
                        src={item.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-3.5 sm:py-3">
                      <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-hm-primary sm:text-sm">
                        {item.name}
                      </p>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-hm-text-muted transition group-hover:translate-x-0.5 group-hover:text-hm-accent" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
