import { Link } from 'react-router-dom'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'
import {
  useStorefrontCategories,
  useStorefrontProducts,
} from '@/shared/catalog/useLiveCatalog'

export function CategoriesPage() {
  const categories = useStorefrontCategories()
  const products = useStorefrontProducts()

  return (
    <div>
      <PageHero
        eyebrow="Shop"
        title="Shop by category"
        description="Browse collections managed from the Uniquworld catalog."
        actions={
          <Link to="/products">
            <Button variant="primary">View all products</Button>
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl space-y-14 px-5 py-12 sm:px-8">
        {categories.length === 0 ? (
          <p className="py-16 text-center text-sm text-hm-text-muted">
            No active categories yet. Add them in Admin → Categories.
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={cat.path}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={cat.image}
                alt=""
                className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-2xl">{cat.title}</p>
                <p className="text-sm text-white/75">
                  {cat.subtitle || `${cat.productCount} product${cat.productCount === 1 ? '' : 's'}`}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.name)
          if (catProducts.length === 0) return null
          return (
            <section key={`list-${cat.id}`}>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-3xl text-hm-text">{cat.title}</h2>
                  <p className="mt-1 text-sm text-hm-text-muted">
                    {catProducts.length} product{catProducts.length === 1 ? '' : 's'}
                  </p>
                </div>
                <Link to={cat.path} className="text-sm font-medium text-hm-accent hover:underline">
                  View all
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {catProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

/** @deprecated use PersonalizedPage from features/personalized */
export function PersonalizedGiftsPage() {
  return null
}

export function BulkOrdersPage() {
  return (
    <div>
      <PageHero
        eyebrow="Bulk orders"
        title="Order 10+ gifts with ease"
        description="Share quantity, budget, and deadline — we’ll reply with options and pricing."
      />
      <div className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
        <form
          className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-6"
          onSubmit={(e) => {
            e.preventDefault()
            window.location.href = '/order-success'
          }}
        >
          <Field label="Company name" name="company" required />
          <Field label="Work email" name="email" type="email" required />
          <Field label="Phone" name="phone" type="tel" />
          <Field label="Quantity" name="qty" type="number" required />
          <Field label="Budget per gift (₹)" name="budget" type="number" />
          <label className="block space-y-1.5">
            <span className="text-xs font-medium text-hm-text-muted">Notes</span>
            <textarea
              name="notes"
              rows={4}
              className="w-full rounded-xl border border-hm-border bg-hm-bg px-3 py-2 text-sm outline-none focus:border-hm-accent"
              placeholder="Occasion, branding needs, city…"
            />
          </label>
          <Button type="submit" variant="primary" className="w-full">
            Submit enquiry
          </Button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', required }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-hm-text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent"
      />
    </label>
  )
}
