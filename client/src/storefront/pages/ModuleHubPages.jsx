import { Navigate, useParams } from 'react-router-dom'
import { ModulePlaceholderPage } from '@/storefront/pages/ModulePlaceholderPage'
import { sitemap } from '@/storefront/config/sitemap'
import { useStorefrontCategories } from '@/shared/catalog/useLiveCatalog'

function hubLinks(moduleId) {
  const mod = sitemap.find((m) => m.id === moduleId)
  return (mod?.children || [])
    .filter((c) => c.path && !c.path.includes(':'))
    .slice(0, 8)
    .map((c) => ({ label: c.label, path: c.path }))
}

export function PersonalizedHubPage() {
  return (
    <ModulePlaceholderPage
      title="Personalized Gifts"
      eyebrow="Make it theirs"
      description="Custom names, photo keepsakes, audio & video QR gifts, engraving, and live preview — crafted to feel one-of-one."
      nextModule="Personalized — Live Preview Studio"
      links={hubLinks('personalized')}
    />
  )
}

export function CorporateHubPage() {
  return (
    <ModulePlaceholderPage
      title="Corporate Gifting"
      eyebrow="Enterprise ready"
      description="Welcome kits, executive gifts, branded merchandise, GST invoicing, and a dedicated account manager for every campaign."
      nextModule="Corporate — Request Quotation"
      links={hubLinks('corporate')}
    />
  )
}

export function FunctionsHubPage() {
  return (
    <ModulePlaceholderPage
      title="Functions"
      eyebrow="Milestone moments"
      description="Wedding to farewell — curated collections for every ceremony and gathering."
      nextModule="Functions — Wedding Collections"
      links={hubLinks('functions')}
    />
  )
}

export function CelebrationsHubPage() {
  return (
    <ModulePlaceholderPage
      title="Celebrations"
      eyebrow="Everyday magic"
      description="Birthdays, anniversaries, promotions, and success parties — gifts that match the moment."
      nextModule="Celebrations — Birthday Collection"
      links={hubLinks('celebrations')}
    />
  )
}

export function FestivalsHubPage() {
  return (
    <ModulePlaceholderPage
      title="Festivals"
      eyebrow="India's calendar"
      description="Diwali to Eid, Pongal to Valentine's — seasonal edits designed for every celebration."
      nextModule="Festivals — Diwali Edit"
      links={hubLinks('festivals')}
    />
  )
}

export function ThankYouHubPage() {
  return (
    <ModulePlaceholderPage
      title="Thank You Gifts"
      eyebrow="Gratitude, elevated"
      description="Thoughtful thank-yous for employees, teachers, doctors, clients, and partners."
      nextModule="Thank You — Employee Collection"
      links={hubLinks('thank-you')}
    />
  )
}

export function RelationshipsHubPage() {
  return (
    <ModulePlaceholderPage
      title="For Every Relationship"
      eyebrow="Gifts with context"
      description="Father, mother, partner, best friend, boss — curated by who they are to you."
      nextModule="Relationships — For Her / For Him"
      links={hubLinks('relationships')}
    />
  )
}

export {
  SurpriseHubPage,
  LocalSurprisePage,
  DigitalSurprisePage,
} from '@/storefront/pages/SurprisePages'

export function StoreHubPage() {
  return (
    <ModulePlaceholderPage
      title="Store & Wholesale"
      eyebrow="Scale with Uniquworld"
      description="Bulk orders, dealer pricing, distributors, vendors, gift box builders, and custom branding."
      nextModule="Store — Gift Box Builder"
      links={hubLinks('store')}
    />
  )
}

export function DiscoverHubPage() {
  return (
    <ModulePlaceholderPage
      title="Discover"
      eyebrow="Extra features"
      description="AI gift finder, reminders, registries, subscriptions, gift cards, loyalty, and more."
      nextModule="Extras — AI Gift Finder Quiz"
      links={hubLinks('extras')}
    />
  )
}

export function CategorySlugPage() {
  const { slug } = useParams()
  const { categories } = useStorefrontCategories()
  const key = String(slug || '')
    .trim()
    .toLowerCase()
  const cat = categories.find(
    (c) =>
      String(c.slug || '').toLowerCase() === key ||
      String(c.name || '')
        .toLowerCase()
        .replace(/\s+/g, '-') === key,
  )
  if (cat) {
    return <Navigate to={`/products?category=${encodeURIComponent(cat.name)}`} replace />
  }
  return <Navigate to="/categories" replace />
}

export function SearchPage() {
  return (
    <ModulePlaceholderPage
      title="Search"
      eyebrow="Find anything"
      description="Unified search across products, occasions, surprises, and gift ideas."
      nextModule="Search — Instant Results"
    />
  )
}

export function GiftIdeasPage() {
  return (
    <ModulePlaceholderPage
      title="Gift Ideas"
      eyebrow="Inspiration"
      description="Editorial gift guides curated by occasion, budget, and relationship."
      nextModule="Gift Ideas — Editorial Hub"
    />
  )
}

export function TrackOrderPage() {
  return (
    <ModulePlaceholderPage
      title="Track Order"
      eyebrow="Peace of mind"
      description="Live order tracking with delivery milestones will live here."
      nextModule="Track Order — Live Status"
    />
  )
}
