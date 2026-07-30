/**
 * Homepage content — collections, rails, social proof.
 * Swap for CMS / API later without touching section components.
 */

export { primaryNav as storefrontNav, megaMenu } from '@/storefront/config/sitemap'

export const trendingCollections = [
  {
    id: 'wedding-edit',
    title: 'Wedding Edit',
    subtitle: 'Favours & keepsakes',
    path: '/functions/wedding',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'diwali-glow',
    title: 'Diwali Glow',
    subtitle: 'Lights & hampers',
    path: '/festivals/diwali',
    image:
      'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'love-notes',
    title: 'Love Notes',
    subtitle: 'Personalized stories',
    path: '/personalized',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'surprise-local',
    title: 'Local Surprise',
    subtitle: 'Experiences nearby',
    path: '/surprise/local',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
  },
]

export const featuredCategories = [
  {
    id: 'personalized',
    title: 'Personalized',
    subtitle: 'Monograms & keepsakes',
    path: '/personalized',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'corporate',
    title: 'Corporate',
    subtitle: 'Curated for teams',
    path: '/corporate',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'uniquworld',
    title: 'Premium Uniquworld',
    subtitle: 'Artisan crafted',
    path: '/categories?tag=uniquworld',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'boxes',
    title: 'Luxury Gift Boxes',
    subtitle: 'Unboxing moments',
    path: '/store/gift-box-builder',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wedding',
    title: 'Wedding',
    subtitle: 'Ceremony & favours',
    path: '/functions/wedding',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'festival',
    title: 'Festivals',
    subtitle: 'Seasonal edits',
    path: '/festivals',
    image:
      'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=1200&q=80',
  },
]

export const occasionCollections = [
  {
    id: 'birthday',
    title: 'Birthday',
    description: 'Joy, wrapped with intention.',
    path: '/celebrations/birthday',
    image:
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'anniversary',
    title: 'Anniversary',
    description: 'Years marked in quiet luxury.',
    path: '/celebrations/anniversary',
    image:
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'thankyou',
    title: 'Thank You',
    description: 'Gratitude that feels considered.',
    path: '/thank-you',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'relationships',
    title: 'Relationships',
    description: 'Gifts matched to who they are.',
    path: '/relationships',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=1000&q=80',
  },
]

export const surprisePaths = [
  {
    id: 'local',
    title: 'Local Surprise',
    hint: 'Book décor, dinners & proposals at real Chennai locations — map included',
    cta: 'Explore Chennai',
    path: '/surprise/local',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=80',
  },
  {
    id: 'digital',
    title: 'Digital Surprise',
    hint: 'Girlfriends Day, Birthday & Diwali — interactive pages from ₹49, 30-day private link',
    cta: 'Create digital',
    path: '/surprise/digital',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80',
  },
]

export const productRails = {
  bestSellers: [
    {
      id: '1',
      name: 'Walnut Serving Tray',
      price: 2890,
      compareAt: 3290,
      tag: 'Bestseller',
      occasion: 'Housewarming favourite',
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '2',
      name: 'Brass Candle Set',
      price: 1650,
      compareAt: 1890,
      tag: 'Trending',
      occasion: 'Evening rituals',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '3',
      name: 'Linen Gift Wrap Kit',
      price: 890,
      compareAt: null,
      tag: 'New',
      occasion: 'Ready to personalize',
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '4',
      name: 'Corporate Welcome Hamper',
      price: 4590,
      compareAt: 5200,
      tag: 'Corporate',
      occasion: 'Client & team gifts',
      rating: 5.0,
      image:
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    },
  ],
  newArrivals: [
    {
      id: '5',
      name: 'Hand-thrown Ceramic Mug',
      price: 780,
      tag: 'New',
      occasion: 'Daily ritual',
      rating: 4.6,
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '6',
      name: 'Scented Soy Trio',
      price: 1290,
      tag: 'New',
      occasion: 'Self-care',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '7',
      name: 'Engraved Brass Bookmark',
      price: 490,
      tag: 'New',
      occasion: 'For readers',
      rating: 4.5,
      image:
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '8',
      name: 'Mini Succulent Garden',
      price: 980,
      tag: 'New',
      occasion: 'Desk joy',
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=80',
    },
  ],
  trending: [
    {
      id: '9',
      name: 'Photo Memory Frame',
      price: 1890,
      tag: 'Trending',
      occasion: 'Photo gifts',
      rating: 4.9,
      image:
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '10',
      name: 'Custom Name Necklace',
      price: 2490,
      tag: 'Trending',
      occasion: 'Personalized',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '2',
      name: 'Brass Candle Set',
      price: 1650,
      tag: 'Trending',
      occasion: 'Evening rituals',
      rating: 4.8,
      image:
        'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '4',
      name: 'Corporate Welcome Hamper',
      price: 4590,
      tag: 'Corporate',
      occasion: 'Client & team gifts',
      rating: 5.0,
      image:
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    },
  ],
  deals: [
    {
      id: '11',
      name: 'Festival Light Box',
      price: 1490,
      compareAt: 2190,
      tag: "Today's Deal",
      occasion: 'Limited hours',
      rating: 4.6,
      image:
        'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '12',
      name: 'Tea Ritual Set',
      price: 999,
      compareAt: 1390,
      tag: "Today's Deal",
      occasion: 'Ends tonight',
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '3',
      name: 'Linen Gift Wrap Kit',
      price: 690,
      compareAt: 890,
      tag: "Today's Deal",
      occasion: 'Flash offer',
      rating: 4.7,
      image:
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
    },
    {
      id: '5',
      name: 'Hand-thrown Ceramic Mug',
      price: 590,
      compareAt: 780,
      tag: "Today's Deal",
      occasion: 'Today only',
      rating: 4.6,
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
    },
  ],
}

/** Back-compat aliases */
export const bestSellers = productRails.bestSellers
export const shopPaths = surprisePaths

export const occasions = [
  { id: 'birthday', label: 'Birthday', path: '/celebrations/birthday' },
  { id: 'wedding', label: 'Wedding', path: '/functions/wedding' },
  { id: 'anniversary', label: 'Anniversary', path: '/celebrations/anniversary' },
  { id: 'festival', label: 'Festival', path: '/festivals' },
  { id: 'thankyou', label: 'Thank you', path: '/thank-you' },
  { id: 'corporate', label: 'Corporate', path: '/corporate' },
  { id: 'surprise', label: 'Surprise', path: '/surprise' },
]

export const corporateClients = [
  'Infosys',
  'Tata',
  'Wipro',
  'Flipkart',
  'Zomato',
  'Swiggy',
  'Nykaa',
  'Razorpay',
]

export const reviews = [
  {
    id: 'r1',
    quote: 'Every piece felt intentional — packaging, note, and the gift itself.',
    name: 'Ananya R.',
    place: 'Bengaluru',
    rating: 5,
  },
  {
    id: 'r2',
    quote: 'Our client hampers arrived flawlessly. Quiet luxury done right.',
    name: 'Vikram S.',
    place: 'Mumbai',
    rating: 5,
  },
  {
    id: 'r3',
    quote: 'The personalized tray became our wedding favour highlight.',
    name: 'Meera & Arjun',
    place: 'Chennai',
    rating: 5,
  },
]

export const instagramPosts = [
  {
    id: 'ig1',
    image:
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ig2',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ig3',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ig4',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ig5',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ig6',
    image:
      'https://images.unsplash.com/photo-1600618528240-fb9fc964b853?auto=format&fit=crop&w=600&q=80',
  },
]

export const blogPosts = [
  {
    id: 'b1',
    title: 'How to gift like a connoisseur',
    excerpt: 'Less noise, more meaning — a quiet guide to memorable presents.',
    path: '/blog/b1',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'b2',
    title: 'Corporate gifting that feels human',
    excerpt: 'Welcome kits and festival hampers without the generic trap.',
    path: '/blog/b2',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'b3',
    title: 'Planning a local surprise in your city',
    excerpt: 'From décor to musicians — how Uniquworld partners bring it to life.',
    path: '/blog/b3',
    image:
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80',
  },
]

export const giftIdeas = [
  { id: 'g1', label: 'Under ₹999', path: '/categories?max=999' },
  { id: 'g2', label: 'For her', path: '/relationships/girlfriend' },
  { id: 'g3', label: 'For him', path: '/relationships/boyfriend' },
  { id: 'g4', label: 'Last-minute', path: '/surprise/digital' },
  { id: 'g5', label: 'Luxury hampers', path: '/store/hamper-builder' },
  { id: 'g6', label: 'Photo gifts', path: '/personalized/photo' },
]

export const howSteps = [
  {
    step: '01',
    title: 'Choose the moment',
    text: 'Occasion, relationship, or surprise — start where the story begins.',
  },
  {
    step: '02',
    title: 'Personalize or book',
    text: 'Engrave, upload, or reserve a local experience with partners.',
  },
  {
    step: '03',
    title: 'Deliver delight',
    text: 'We pack, gift-wrap, and make the reveal unforgettable.',
  },
]

export const heroProducts = productRails.bestSellers.slice(0, 3)
