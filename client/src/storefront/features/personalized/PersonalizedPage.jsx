import { Link } from 'react-router-dom'
import { PageHero } from '@/storefront/components/layout/PageHero'
import { getStorefrontProducts } from '@/shared/catalog/liveCatalog'
import { ProductCard } from '@/storefront/components/product/ProductCard'
import { Button } from '@/shared/components/ui/Button'
import { Container } from '@/storefront/components/ui/Container'
import { Chip } from '@/storefront/components/ui/Chip'

/** Personalized gift types — shown as collection cards */
export const personalizedTypes = [
  {
    id: 'name',
    title: 'Custom Name Gifts',
    subtitle: 'Monograms & nameplates',
    path: '/personalized/name',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'photo',
    title: 'Photo Gifts',
    subtitle: 'Frames, albums & prints',
    path: '/personalized/photo',
    image:
      'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'audio-qr',
    title: 'Audio QR Gifts',
    subtitle: 'A voice note they can replay',
    path: '/personalized/audio-qr',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'video-qr',
    title: 'Video QR Gifts',
    subtitle: 'Memories in a scan',
    path: '/personalized/video-qr',
    image:
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'engraving',
    title: 'Custom Engraving',
    subtitle: 'Brass, wood & keepsakes',
    path: '/personalized/engraving',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'message',
    title: 'Custom Message',
    subtitle: 'Notes that feel handwritten',
    path: '/personalized/message',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'logo',
    title: 'Logo Printing',
    subtitle: 'Brand it for teams & clients',
    path: '/personalized/logo',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'box',
    title: 'Gift Box Personalization',
    subtitle: 'Unboxing made theirs',
    path: '/personalized/box',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
  },
]

export function PersonalizedPage() {
  const products = getStorefrontProducts().filter(
    (p) => p.category === 'Personalized Gifts' || p.personalization?.customText,
  )

  return (
    <div>
      <PageHero
        eyebrow="Personalized"
        title="Make it unmistakably theirs"
        description="Custom names, photo keepsakes, audio & video QR, engraving, and live preview — personalization without the chaos."
        actions={
          <>
            <Link to="/personalized/studio">
              <Button variant="primary">Live preview studio</Button>
            </Link>
            <Link to="/categories?category=Personalized%20Gifts">
              <Button variant="outline">Shop all personalized</Button>
            </Link>
          </>
        }
      />

      <Container className="py-10 sm:py-12">
        <div className="mb-6 flex flex-wrap gap-2">
          {['Name', 'Photo', 'Audio QR', 'Video QR', 'Engraving', 'Logo'].map((label) => (
            <Chip key={label} to="/personalized" className="bg-hm-elevated">
              {label}
            </Chip>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {personalizedTypes.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={item.image}
                alt=""
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-1 text-sm text-white/75">{item.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="mt-14">
            <h2 className="font-display text-3xl text-hm-text sm:text-4xl">Ready to personalize</h2>
            <p className="mt-2 text-sm text-hm-text-muted">
              Pick a gift — add name, note, or logo at checkout.
            </p>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{ ...p, image: p.images[0], occasion: p.occasion?.[0] }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </div>
  )
}
