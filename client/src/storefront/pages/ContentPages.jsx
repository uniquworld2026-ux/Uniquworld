import { Link } from 'react-router-dom'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { Button } from '@/shared/components/ui/Button'

const posts = [
  {
    id: '1',
    title: 'How to choose a corporate welcome gift',
    excerpt: 'A calm checklist for HR teams building onboarding kits.',
    date: '12 Jun 2026',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '2',
    title: 'The quiet luxury of linen wrapping',
    excerpt: 'Reusable wraps that feel as intentional as the gift inside.',
    date: '28 May 2026',
    image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: 'Festival gifting without the clutter',
    excerpt: 'Fewer pieces, better materials, lasting impressions.',
    date: '4 May 2026',
    image: 'https://images.unsplash.com/photo-1608756687911-aa1599ab3bd9?auto=format&fit=crop&w=900&q=80',
  },
]

const faqs = [
  {
    q: 'How long does delivery take?',
    a: 'Most ready-to-ship gifts dispatch in 1–2 days. Personalized and engraved items may take 2–4 days.',
  },
  {
    q: 'Can I add a logo for corporate orders?',
    a: 'Yes. Upload your logo on the product page or request branding help via Bulk Orders.',
  },
  {
    q: 'Do you offer gift wrap?',
    a: 'Complimentary gift wrap is available on most products. Notes can be added at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'Unused, unopened gifts can be returned within 7 days. Personalized items are final sale unless defective.',
  },
  {
    q: 'Do you ship pan-India?',
    a: 'Yes. Bulk corporate shipping is available to multiple addresses on request.',
  },
]

export function BlogPage() {
  return (
    <div>
      <PageHero eyebrow="Journal" title="Blog" description="Notes on gifting, craft, and calm rituals." />
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="overflow-hidden rounded-2xl border border-hm-border bg-hm-elevated"
          >
            <img src={post.image} alt="" className="aspect-[16/10] w-full object-cover" loading="lazy" />
            <div className="p-5">
              <p className="text-xs text-hm-text-subtle">{post.date}</p>
              <h2 className="mt-2 font-display text-2xl text-hm-text">{post.title}</h2>
              <p className="mt-2 text-sm text-hm-text-muted">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function BlogPostPage() {
  const post = posts[0]
  return (
    <div>
      <PageHero eyebrow="Journal" title={post.title} description={post.date} />
      <article className="mx-auto max-w-3xl space-y-4 px-5 py-12 text-sm leading-relaxed text-hm-text-muted sm:px-8 sm:text-base">
        <img src={post.image} alt="" className="mb-8 aspect-[16/9] w-full rounded-2xl object-cover" />
        <p>{post.excerpt}</p>
        <p>
          Start with the recipient, not the product. Choose one strong object, add a short note,
          and keep packaging calm. That’s the Uniquworld approach.
        </p>
        <Link to="/blog" className="inline-block text-hm-accent">← Back to blog</Link>
      </article>
    </div>
  )
}

export function FaqPage() {
  return (
    <div>
      <PageHero eyebrow="Help" title="FAQ" description="Quick answers before you order." />
      <div className="mx-auto max-w-3xl space-y-3 px-5 py-12 sm:px-8">
        {faqs.map((item) => (
          <details key={item.q} className="rounded-2xl border border-hm-border bg-hm-elevated px-5 py-4">
            <summary className="cursor-pointer list-none font-medium text-hm-text">{item.q}</summary>
            <p className="mt-3 text-sm text-hm-text-muted">{item.a}</p>
          </details>
        ))}
        <p className="pt-4 text-sm text-hm-text-muted">
          Still stuck? <Link to="/contact" className="text-hm-accent">Contact us</Link>
        </p>
      </div>
    </div>
  )
}

export function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Studio"
        title="Contact"
        description="Questions about an order, personalization, or corporate kits — write to us."
      />
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-2">
        <form
          className="space-y-4 rounded-2xl border border-hm-border bg-hm-elevated p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <input required placeholder="Name" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <input required type="email" placeholder="Email" className="h-11 w-full rounded-xl border border-hm-border bg-hm-bg px-3 text-sm outline-none focus:border-hm-accent" />
          <textarea required rows={5} placeholder="Message" className="w-full rounded-xl border border-hm-border bg-hm-bg px-3 py-2 text-sm outline-none focus:border-hm-accent" />
          <Button type="submit" variant="primary" className="w-full">Send message</Button>
        </form>
        <div className="space-y-4 text-sm text-hm-text-muted">
          <p><span className="font-medium text-hm-text">Email</span><br />hello@uniquworld.in</p>
          <p><span className="font-medium text-hm-text">Phone</span><br />+91 98765 43210</p>
          <p><span className="font-medium text-hm-text">Hours</span><br />Mon–Sat, 10:00–18:00 IST</p>
        </div>
      </div>
    </div>
  )
}
