/**
 * Customer-facing product catalog (storefront).
 * IDs are shared with home bestsellers for seamless navigation.
 */

export const CATALOG_CATEGORIES = [
  'All',
  'Personalized Gifts',
  'Corporate Gifts',
  'Home Décor',
  'Hampers',
  'Jewellery',
  'Stationery',
]

export const CATALOG_OCCASIONS = [
  'All',
  'Birthday',
  'Wedding',
  'Festival',
  'Welcome',
  'Thank you',
  'Corporate',
  'Housewarming',
]

const img = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const catalogProducts = [
  {
    id: '1',
    slug: 'walnut-serving-tray',
    name: 'Walnut Serving Tray',
    tag: 'Bestseller',
    category: 'Home Décor',
    subcategory: 'Serveware',
    brand: 'Uniquworld Atelier',
    occasion: ['Housewarming', 'Thank you', 'Wedding'],
    price: 2890,
    compareAt: 3290,
    rating: 4.9,
    reviewCount: 128,
    stock: 42,
    shortDescription: 'Hand-finished walnut tray with brass handles — hosting, ready.',
    description:
      'Crafted from solid walnut with a soft oil finish and brushed brass handles. Perfect for cheese boards, tea service, or as a housewarming keepsake. Optional monogram engraving on the handle plate.',
    features: ['Solid walnut', 'Brass handles', 'Food-safe finish', 'Gift-ready packaging'],
    images: [
      img('photo-1616486338812-3dadae4b4ace'),
      img('photo-1555041469-a586c61ea9bc'),
      img('photo-1586023492125-27b2c045efd7'),
    ],
    variants: {
      size: ['Standard', 'Large'],
      finish: ['Natural oil', 'Matte dark'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: true,
      maxChars: 24,
    },
    bulkPricing: [
      { minQty: 1, price: 2890 },
      { minQty: 10, price: 2690 },
      { minQty: 25, price: 2490 },
    ],
    shippingNote: 'Dispatches in 1–2 days · Free gift wrap',
    featured: true,
    trending: true,
  },
  {
    id: '2',
    slug: 'brass-candle-set',
    name: 'Brass Candle Set',
    tag: 'Trending',
    category: 'Home Décor',
    subcategory: 'Lighting',
    brand: 'Uniquworld Atelier',
    occasion: ['Birthday', 'Festival', 'Thank you'],
    price: 1650,
    compareAt: 1890,
    rating: 4.8,
    reviewCount: 96,
    stock: 18,
    shortDescription: 'Three brushed brass holders with soy wax votives.',
    description:
      'A trio of brushed brass candle holders with hand-poured soy votives. Soft, warm light for dinners and quiet evenings. Refills available.',
    features: ['Brushed brass', 'Soy wax included', 'Refillable', 'Gift boxed'],
    images: [
      img('photo-1602874801006-e0c3f490f3c7'),
      img('photo-1513519245088-0e12902e35a6'),
      img('photo-1572726729207-a78d6feb5e92'),
    ],
    variants: {
      size: ['Set of 3'],
      scent: ['Unscented', 'Sandalwood', 'Fig leaf'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: false,
      maxChars: 18,
    },
    bulkPricing: [
      { minQty: 1, price: 1650 },
      { minQty: 12, price: 1490 },
      { minQty: 30, price: 1350 },
    ],
    shippingNote: 'Dispatches in 24 hours · Free gift wrap',
    featured: false,
    trending: true,
  },
  {
    id: '3',
    slug: 'linen-gift-wrap-kit',
    name: 'Linen Gift Wrap Kit',
    tag: 'New',
    category: 'Personalized Gifts',
    subcategory: 'Wrapping',
    brand: 'Uniquworld',
    occasion: ['Birthday', 'Wedding', 'Thank you'],
    price: 890,
    compareAt: null,
    rating: 4.7,
    reviewCount: 64,
    stock: 120,
    shortDescription: 'Reusable linen wrap with botanical seal and monogram card.',
    description:
      'A sustainable wrapping ritual — soft linen, dried botanical seal, and a card ready for your message. Reusable for years of gifting.',
    features: ['Reusable linen', 'Botanical seal', 'Monogram card', 'Zero waste'],
    images: [
      img('photo-1513201099705-a9746e1e201f'),
      img('photo-1549465220-1a8b9238cd48'),
      img('photo-1513885535751-8b9238bd345a'),
    ],
    variants: {
      colour: ['Ivory', 'Sand', 'Moss'],
      size: ['Medium', 'Large'],
    },
    personalization: {
      customText: true,
      uploadImage: true,
      uploadLogo: false,
      maxChars: 40,
    },
    bulkPricing: [
      { minQty: 1, price: 890 },
      { minQty: 20, price: 790 },
      { minQty: 50, price: 690 },
    ],
    shippingNote: 'Same-day dispatch in major cities*',
    featured: true,
    trending: false,
  },
  {
    id: '4',
    slug: 'corporate-welcome-hamper',
    name: 'Corporate Welcome Hamper',
    tag: 'Corporate',
    category: 'Corporate Gifts',
    subcategory: 'Hampers',
    brand: 'Uniquworld Corp',
    occasion: ['Welcome', 'Corporate', 'Festival'],
    price: 4590,
    compareAt: 5200,
    rating: 5.0,
    reviewCount: 41,
    stock: 28,
    shortDescription: 'Notebook, ceramic mug, and artisanal treats — onboarding ready.',
    description:
      'A polished welcome kit for new joiners and clients. Includes linen notebook, speckled mug, gourmet bites, and space for your logo card.',
    features: ['Logo-ready', 'Bulk discounts', 'Pan-India shipping', 'Custom insert card'],
    images: [
      img('photo-1549465220-1a8b9238cd48'),
      img('photo-1513885535751-8b9238bd345a'),
      img('photo-1600880292089-90a7e086ee0c'),
    ],
    variants: {
      tier: ['Essential', 'Signature', 'Executive'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: true,
      maxChars: 60,
    },
    bulkPricing: [
      { minQty: 1, price: 4590 },
      { minQty: 10, price: 4290 },
      { minQty: 50, price: 3990 },
      { minQty: 100, price: 3690 },
    ],
    shippingNote: 'Bulk quotes in 24 hours · Branded packing available',
    featured: true,
    trending: true,
  },
  {
    id: '5',
    slug: 'handwoven-ceramic-mug',
    name: 'Handwoven Ceramic Mug',
    tag: 'Artisan',
    category: 'Home Décor',
    subcategory: 'Tableware',
    brand: 'Studio Clay',
    occasion: ['Birthday', 'Thank you', 'Housewarming'],
    price: 780,
    compareAt: 950,
    rating: 4.6,
    reviewCount: 88,
    stock: 55,
    shortDescription: 'Speckled stoneware mug with soft glaze — dishwasher safe.',
    description:
      'Thrown by hand with a speckled body and calm glaze. Holds 320ml. A daily ritual piece that also gifts beautifully.',
    features: ['Stoneware', 'Dishwasher safe', '320ml', 'Gift box'],
    images: [
      img('photo-1514228742587-6b1558fcca3d'),
      img('photo-1495474472287-4d71bcdd2085'),
      img('photo-1572116469696-31de0f17cc34'),
    ],
    variants: {
      glaze: ['Ivory speck', 'Clay blush', 'Charcoal'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: false,
      maxChars: 12,
    },
    bulkPricing: [
      { minQty: 1, price: 780 },
      { minQty: 24, price: 690 },
    ],
    shippingNote: 'Dispatches in 2 days',
    featured: false,
    trending: false,
  },
  {
    id: '6',
    slug: 'gold-tone-keepsake-box',
    name: 'Gold-Tone Keepsake Box',
    tag: 'Elegant',
    category: 'Jewellery',
    subcategory: 'Accessories',
    brand: 'Uniquworld Atelier',
    occasion: ['Wedding', 'Birthday', 'Thank you'],
    price: 2190,
    compareAt: 2490,
    rating: 4.8,
    reviewCount: 52,
    stock: 16,
    shortDescription: 'Velvet-lined box with brushed gold finish and engraving option.',
    description:
      'A brushed gold keepsake for rings, notes, and small treasures. Soft velvet lining. Optional lid engraving.',
    features: ['Velvet lined', 'Engravable lid', 'Gift ready', 'Compact'],
    images: [
      img('photo-1515562141207-7a88fb7ce338'),
      img('photo-1605100804763-247f67b3557e'),
      img('photo-1599643478518-a784e5dc4c8f'),
    ],
    variants: {
      size: ['Small', 'Medium'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: false,
      maxChars: 20,
    },
    bulkPricing: [
      { minQty: 1, price: 2190 },
      { minQty: 15, price: 1990 },
    ],
    shippingNote: 'Engraving adds 1 day',
    featured: true,
    trending: false,
  },
  {
    id: '7',
    slug: 'festival-diwali-kit',
    name: 'Festival Light Kit',
    tag: 'Festival',
    category: 'Hampers',
    subcategory: 'Seasonal',
    brand: 'Uniquworld',
    occasion: ['Festival', 'Corporate', 'Thank you'],
    price: 3290,
    compareAt: 3690,
    rating: 4.9,
    reviewCount: 73,
    stock: 34,
    shortDescription: 'Brass diya, sweets tin, and linen pouch — festive and refined.',
    description:
      'A calm festival edit: handcrafted brass diya, artisanal sweets tin, and a linen pouch. Ideal for teams and family gifting.',
    features: ['Seasonal edit', 'Bulk ready', 'Premium packing', 'Optional logo'],
    images: [
      img('photo-1608756687911-aa1599ab3bd9'),
      img('photo-1549465220-1a8b9238cd48'),
      img('photo-1513885535751-8b9238bd345a'),
    ],
    variants: {
      pack: ['Classic', 'Premium'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: true,
      maxChars: 40,
    },
    bulkPricing: [
      { minQty: 1, price: 3290 },
      { minQty: 25, price: 2990 },
      { minQty: 100, price: 2690 },
    ],
    shippingNote: 'Pre-order windows for festivals',
    featured: true,
    trending: true,
  },
  {
    id: '8',
    slug: 'monogram-notebook-set',
    name: 'Monogram Notebook Set',
    tag: 'Personalized',
    category: 'Stationery',
    subcategory: 'Journals',
    brand: 'Uniquworld',
    occasion: ['Corporate', 'Welcome', 'Birthday'],
    price: 1290,
    compareAt: 1490,
    rating: 4.7,
    reviewCount: 110,
    stock: 67,
    shortDescription: 'Linen-bound notebooks with foil monogram — set of two.',
    description:
      'Two linen-bound notebooks with optional foil initials. Smooth cream pages, ribbon marker, and a soft slipcase.',
    features: ['Foil monogram', 'Set of 2', 'Cream pages', 'Slipcase'],
    images: [
      img('photo-1531346680769-ebf95d342db7'),
      img('photo-1544716278-ca5e3f4abd8c'),
      img('photo-1512820790803-83ca734da794'),
    ],
    variants: {
      colour: ['Sand', 'Forest', 'Ink'],
    },
    personalization: {
      customText: true,
      uploadImage: false,
      uploadLogo: true,
      maxChars: 3,
    },
    bulkPricing: [
      { minQty: 1, price: 1290 },
      { minQty: 20, price: 1150 },
      { minQty: 50, price: 990 },
    ],
    shippingNote: 'Monogram ready in 2 days',
    featured: false,
    trending: true,
  },
]

export const productReviews = {
  1: [
    { id: 'rv1', name: 'Ananya R.', rating: 5, text: 'Beautiful tray — arrived gift-wrapped perfectly.', date: '12 Jun 2026' },
    { id: 'rv2', name: 'Karan M.', rating: 5, text: 'Solid walnut, not flimsy. Guests noticed.', date: '2 May 2026' },
  ],
  2: [
    { id: 'rv3', name: 'Meera K.', rating: 5, text: 'Warm glow, elegant finish.', date: '20 Jun 2026' },
  ],
  4: [
    { id: 'rv4', name: 'HR · Nexa', rating: 5, text: 'Ordered 80 kits — seamless branding.', date: '8 Jul 2026' },
  ],
}

export function getCatalogProduct(idOrSlug) {
  return (
    catalogProducts.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null
  )
}

export function getRelatedProducts(product, limit = 4) {
  if (!product) return []
  return catalogProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.occasion.some((o) => product.occasion.includes(o))),
    )
    .slice(0, limit)
}

export function getUnitPrice(product, qty) {
  const tiers = [...(product.bulkPricing || [])].sort((a, b) => b.minQty - a.minQty)
  const tier = tiers.find((t) => qty >= t.minQty)
  return tier?.price ?? product.price
}

export function filterCatalog({
  search = '',
  category = 'All',
  occasion = 'All',
  sort = 'featured',
  minPrice = 0,
  maxPrice = Infinity,
  onlyInStock = false,
} = {}) {
  let list = [...catalogProducts]

  if (category && category !== 'All') {
    list = list.filter((p) => p.category === category)
  }
  if (occasion && occasion !== 'All') {
    list = list.filter((p) => p.occasion.includes(occasion))
  }
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q),
    )
  }
  list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice)
  if (onlyInStock) list = list.filter((p) => p.stock > 0)

  switch (sort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      list.reverse()
      break
    default:
      list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
  }

  return list
}
