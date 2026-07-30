/**
 * Gift collection taxonomy for the Personalized hub.
 * Large category cards + 4-up subcategory cards.
 */

function slug(label) {
  return String(label || '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function item(label, path) {
  return {
    id: slug(label),
    label,
    path: path || `/categories?q=${encodeURIComponent(label)}`,
  }
}

export const giftCollectionGroups = [
  {
    id: 'corporate',
    emoji: '🏢',
    title: 'Corporate Gifts',
    description: 'Welcome kits, client gifts, and branded merchandise for teams.',
    path: '/corporate',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Employee Welcome Kits', '/corporate/welcome-kits'),
      item('Joining Kits', '/corporate/joining-kits'),
      item('Client Gifts', '/corporate'),
      item('Executive Gifts', '/corporate/executive'),
      item('Promotional Gifts', '/corporate/promo'),
      item('Office Accessories', '/corporate/office'),
      item('Corporate Gift Hampers', '/corporate'),
      item('Conference Kits', '/corporate'),
      item('Event Merchandise', '/corporate/merchandise'),
      item('Awards & Trophies', '/corporate'),
      item('Eco-Friendly Gifts', '/categories?q=Eco-Friendly'),
    ],
  },
  {
    id: 'wedding',
    emoji: '💍',
    title: 'Wedding Gifts',
    description: 'Sets, return gifts, and keepsakes for the big day.',
    path: '/functions/wedding',
    image:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Wedding Gift Sets', '/functions/wedding'),
      item('Return Gifts', '/functions/wedding'),
      item('Bride Gifts', '/functions/wedding'),
      item('Groom Gifts', '/functions/wedding'),
      item('Bridesmaid Gifts', '/functions/wedding'),
      item('Groomsmen Gifts', '/functions/wedding'),
      item('Wedding Hampers', '/functions/wedding'),
      item('Invitation Gifts', '/functions/wedding'),
    ],
  },
  {
    id: 'birthday',
    emoji: '🎂',
    title: 'Birthday Gifts',
    description: 'Boxes, sweets, flowers, and personalized surprises.',
    path: '/celebrations/birthday',
    image:
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Birthday Gift Boxes', '/celebrations/birthday'),
      item('Cakes', '/celebrations/birthday'),
      item('Chocolates', '/celebrations/birthday'),
      item('Flowers', '/celebrations/birthday'),
      item('Soft Toys', '/celebrations/birthday'),
      item('Personalized Birthday Gifts', '/personalized'),
      item('Surprise Boxes', '/surprise'),
    ],
  },
  {
    id: 'anniversary',
    emoji: '❤️',
    title: 'Anniversary Gifts',
    description: 'Romantic picks for couples and shared memories.',
    path: '/celebrations/anniversary',
    image:
      'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Couple Gifts', '/celebrations/anniversary'),
      item('Personalized Frames', '/personalized/photo'),
      item('Memory Albums', '/personalized/photo'),
      item('Romantic Gift Boxes', '/celebrations/anniversary'),
      item('Flowers & Chocolates', '/celebrations/anniversary'),
    ],
  },
  {
    id: 'baby',
    emoji: '👶',
    title: 'Baby Gifts',
    description: 'Soft, sweet, and personalized for little ones.',
    path: '/functions/baby-shower',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4f8?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Baby Shower Gifts', '/functions/baby-shower'),
      item('Newborn Gift Sets', '/functions/baby-shower'),
      item('Kids Toys', '/categories?q=Toys'),
      item('Baby Essentials', '/functions/baby-shower'),
      item('Personalized Baby Gifts', '/personalized'),
    ],
  },
  {
    id: 'home',
    emoji: '🏠',
    title: 'Home & Living',
    description: 'Decor, aroma, plants, and handmade home accents.',
    path: '/categories?q=Home',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae25e6cd?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Home Decor'),
      item('Wall Art'),
      item('Resin Art', '/handmade'),
      item('Candles'),
      item('Aroma Products'),
      item('Indoor Plants'),
      item('Decorative Lights'),
    ],
  },
  {
    id: 'handmade-crafts',
    emoji: '🌸',
    title: 'Handmade Crafts',
    description: 'Cards, paintings, crochet, resin, clay, and wood.',
    path: '/handmade',
    image:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Handmade Cards', '/handmade'),
      item('Handmade Paintings', '/handmade'),
      item('Crochet Products', '/handmade'),
      item('Resin Crafts', '/handmade'),
      item('Clay Art', '/handmade'),
      item('Macrame', '/handmade'),
      item('Wooden Crafts', '/handmade'),
    ],
  },
  {
    id: 'hampers',
    emoji: '🍫',
    title: 'Gift Hampers',
    description: 'Chocolate, dry fruit, healthy, luxury, and festival baskets.',
    path: '/store/hamper-builder',
    image:
      'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Chocolate Hampers'),
      item('Dry Fruit Hampers'),
      item('Healthy Hampers'),
      item('Luxury Hampers'),
      item('Festival Hampers', '/festivals'),
      item('Corporate Hampers', '/corporate'),
    ],
  },
  {
    id: 'fashion',
    emoji: '💎',
    title: 'Fashion & Accessories',
    description: 'Jewelry, watches, bags, and finishing touches.',
    path: '/categories?q=Fashion',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Jewelry'),
      item('Watches'),
      item('Wallets'),
      item('Handbags'),
      item('Sunglasses'),
      item('Perfumes'),
      item('Belts'),
    ],
  },
  {
    id: 'tech',
    emoji: '📱',
    title: 'Tech Gifts',
    description: 'Gadgets and accessories they will actually use.',
    path: '/categories?q=Tech',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Smart Gadgets'),
      item('Bluetooth Speakers'),
      item('Headphones'),
      item('Power Banks'),
      item('Smart Watches'),
      item('Mobile Accessories'),
    ],
  },
  {
    id: 'kitchen',
    emoji: '🍽️',
    title: 'Kitchen & Dining',
    description: 'Mugs, bottles, and everyday kitchen favorites.',
    path: '/categories?q=Kitchen',
    image:
      'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Coffee Mugs'),
      item('Bottles'),
      item('Lunch Boxes'),
      item('Kitchen Accessories'),
      item('Tea & Coffee Sets'),
    ],
  },
  {
    id: 'kids',
    emoji: '🧸',
    title: 'Kids & Toys',
    description: 'Play, learn, and soft cuddles for little ones.',
    path: '/categories?q=Kids',
    image:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4f8?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Educational Toys'),
      item('Soft Toys'),
      item('Activity Kits'),
      item('Puzzles'),
      item('Stationery'),
    ],
  },
  {
    id: 'eco',
    emoji: '🌿',
    title: 'Eco-Friendly Gifts',
    description: 'Sustainable picks with a lighter footprint.',
    path: '/categories?q=Eco',
    image:
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Bamboo Products'),
      item('Seed Pens'),
      item('Plant Kits'),
      item('Jute Bags'),
      item('Recycled Gifts'),
    ],
  },
  {
    id: 'festival',
    emoji: '🎉',
    title: 'Festival Gifts',
    description: 'Seasonal edits for every celebration on the calendar.',
    path: '/festivals',
    image:
      'https://images.unsplash.com/photo-1604608672516-f1b9b1d37076?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Diwali Gifts', '/festivals/diwali'),
      item('Pongal Gifts', '/festivals/pongal'),
      item('Christmas Gifts', '/festivals/christmas'),
      item('New Year Gifts', '/festivals/new-year'),
      item('Holi Gifts', '/festivals/holi'),
      item('Eid Gifts', '/festivals/eid'),
      item('Raksha Bandhan Gifts', '/festivals/raksha-bandhan'),
      item("Valentine's Gifts", '/festivals/valentines'),
    ],
  },
  {
    id: 'relationship',
    emoji: '💖',
    title: 'Relationship Gifts',
    description: 'Thoughtful finds for every person who matters.',
    path: '/relationships',
    image:
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Gifts for Mother', '/relationships/mother'),
      item('Gifts for Father', '/relationships/father'),
      item('Gifts for Husband', '/relationships/husband'),
      item('Gifts for Wife', '/relationships/wife'),
      item('Gifts for Boyfriend', '/relationships/boyfriend'),
      item('Gifts for Girlfriend', '/relationships/girlfriend'),
      item('Gifts for Brother', '/relationships/brother'),
      item('Gifts for Sister', '/relationships/sister'),
      item('Gifts for Friends', '/relationships/best-friend'),
      item('Gifts for Grandparents', '/relationships/grandparents'),
      item('Gifts for Teachers', '/relationships/teacher'),
      item('Gifts for Boss', '/relationships/boss'),
    ],
  },
  {
    id: 'thank-you',
    emoji: '🙏',
    title: 'Thank You Gifts',
    description: 'Say thank you with something they will keep.',
    path: '/thank-you',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Thank You Teacher', '/thank-you/teacher'),
      item('Thank You Doctor', '/thank-you/doctor'),
      item('Thank You Customer', '/thank-you/customer'),
      item('Thank You Employee', '/thank-you/employee'),
      item('Thank You Friend', '/thank-you/friend'),
      item('Thank You Boss', '/thank-you/boss'),
    ],
  },
  {
    id: 'celebration',
    emoji: '🎈',
    title: 'Celebration Gifts',
    description: 'Milestones, promotions, and big life moments.',
    path: '/celebrations',
    image:
      'https://images.unsplash.com/photo-1530103861634-7bde0407bf21?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Congratulations Gifts', '/celebrations/congratulations'),
      item('Promotion Gifts', '/celebrations/promotion'),
      item('Graduation Gifts', '/functions/graduation'),
      item('Housewarming Gifts', '/functions/housewarming'),
      item('Retirement Gifts', '/functions/retirement'),
      item('Farewell Gifts', '/functions/farewell'),
      item('Achievement Gifts', '/celebrations/achievement'),
    ],
  },
  {
    id: 'party',
    emoji: '🎊',
    title: 'Party Supplies',
    description: 'Balloons, décor, props, and return-gift ready bags.',
    path: '/categories?q=Party',
    image:
      'https://images.unsplash.com/photo-1530103861634-7bde0407bf21?auto=format&fit=crop&w=900&q=80',
    items: [
      item('Balloons'),
      item('Decorations'),
      item('Party Props'),
      item('Cake Toppers'),
      item('Return Gift Bags'),
    ],
  },
]
