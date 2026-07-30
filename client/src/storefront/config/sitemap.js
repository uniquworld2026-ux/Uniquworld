/**
 * Uniquworld Storefront Sitemap
 * Source of truth for IA, routing, and navigation.
 *
 * Module status:
 *   live        — page implemented
 *   scaffold    — route + layout shell ready
 *   planned     — reserved path for a future module
 */

export const sitemap = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    status: 'live',
    module: 'home',
    sections: [
      'hero',
      'trending-collections',
      'featured-categories',
      'personalized-gifts',
      'corporate-gifts',
      'wedding',
      'birthday',
      'anniversary',
      'festival',
      'thank-you',
      'relationships',
      'premium-uniquworld',
      'luxury-gift-boxes',
      'best-sellers',
      'new-arrivals',
      'trending-products',
      'todays-deals',
      'corporate-clients',
      'reviews',
      'instagram',
      'blogs',
      'gift-ideas',
      'newsletter',
      'footer',
    ],
  },

  /* ── Category / Catalog ─────────────────────────────────────────────── */
  {
    id: 'shop',
    label: 'Category',
    path: '/categories',
    status: 'live',
    module: 'category',
    children: [
      { id: 'product-details', label: 'Product Details', path: '/products/:id', status: 'live' },
      { id: 'category-slug', label: 'Category Filter', path: '/categories/:slug', status: 'scaffold' },
      { id: 'search', label: 'Search', path: '/search', status: 'scaffold' },
      { id: 'compare', label: 'Compare', path: '/compare', status: 'planned' },
      { id: 'wishlist', label: 'Wishlist', path: '/wishlist', status: 'live' },
    ],
  },

  /* ── Personalized ───────────────────────────────────────────────────── */
  {
    id: 'personalized',
    label: 'Personalized',
    path: '/personalized',
    status: 'live',
    module: 'personalized',
    children: [
      { id: 'custom-name', label: 'Custom Name Gifts', path: '/personalized/name', status: 'planned' },
      { id: 'photo-gifts', label: 'Photo Gifts', path: '/personalized/photo', status: 'planned' },
      { id: 'audio-qr', label: 'Audio QR Gifts', path: '/personalized/audio-qr', status: 'planned' },
      { id: 'video-qr', label: 'Video QR Gifts', path: '/personalized/video-qr', status: 'planned' },
      { id: 'engraving', label: 'Custom Engraving', path: '/personalized/engraving', status: 'planned' },
      { id: 'message', label: 'Custom Message', path: '/personalized/message', status: 'planned' },
      { id: 'logo-print', label: 'Logo Printing', path: '/personalized/logo', status: 'planned' },
      { id: 'box-personalize', label: 'Gift Box Personalization', path: '/personalized/box', status: 'planned' },
      { id: 'studio', label: 'Live Preview Studio', path: '/personalized/studio', status: 'planned' },
    ],
  },

  /* ── Corporate ──────────────────────────────────────────────────────── */
  {
    id: 'corporate',
    label: 'Corporate',
    path: '/corporate',
    status: 'scaffold',
    module: 'corporate',
    children: [
      { id: 'welcome-kits', label: 'Employee Welcome Kits', path: '/corporate/welcome-kits', status: 'planned' },
      { id: 'joining-kits', label: 'Joining Kits', path: '/corporate/joining-kits', status: 'planned' },
      { id: 'merchandise', label: 'Corporate Merchandise', path: '/corporate/merchandise', status: 'planned' },
      { id: 'executive', label: 'Executive Gifts', path: '/corporate/executive', status: 'planned' },
      { id: 'office', label: 'Office Accessories', path: '/corporate/office', status: 'planned' },
      { id: 'promo', label: 'Promotional Products', path: '/corporate/promo', status: 'planned' },
      { id: 'bulk', label: 'Bulk Ordering', path: '/corporate/bulk', status: 'planned' },
      { id: 'quote', label: 'Request Quotation', path: '/corporate/quote', status: 'planned' },
      { id: 'branding', label: 'Branding Service', path: '/corporate/branding', status: 'planned' },
      { id: 'packaging', label: 'Custom Packaging', path: '/corporate/packaging', status: 'planned' },
    ],
  },

  /* ── Functions ──────────────────────────────────────────────────────── */
  {
    id: 'functions',
    label: 'Functions',
    path: '/functions',
    status: 'scaffold',
    module: 'functions',
    children: [
      { id: 'wedding', label: 'Wedding', path: '/functions/wedding', status: 'planned' },
      { id: 'engagement', label: 'Engagement', path: '/functions/engagement', status: 'planned' },
      { id: 'reception', label: 'Reception', path: '/functions/reception', status: 'planned' },
      { id: 'housewarming', label: 'Housewarming', path: '/functions/housewarming', status: 'planned' },
      { id: 'baby-shower', label: 'Baby Shower', path: '/functions/baby-shower', status: 'planned' },
      { id: 'naming', label: 'Naming Ceremony', path: '/functions/naming-ceremony', status: 'planned' },
      { id: 'retirement', label: 'Retirement', path: '/functions/retirement', status: 'planned' },
      { id: 'farewell', label: 'Farewell', path: '/functions/farewell', status: 'planned' },
      { id: 'graduation', label: 'Graduation', path: '/functions/graduation', status: 'planned' },
      { id: 'office-events', label: 'Office Events', path: '/functions/office-events', status: 'planned' },
      { id: 'school-events', label: 'School Events', path: '/functions/school-events', status: 'planned' },
      { id: 'college-events', label: 'College Events', path: '/functions/college-events', status: 'planned' },
    ],
  },

  /* ── Celebrations ───────────────────────────────────────────────────── */
  {
    id: 'celebrations',
    label: 'Celebrations',
    path: '/celebrations',
    status: 'scaffold',
    module: 'celebrations',
    children: [
      { id: 'birthday', label: 'Birthday', path: '/celebrations/birthday', status: 'planned' },
      { id: 'anniversary', label: 'Anniversary', path: '/celebrations/anniversary', status: 'planned' },
      { id: 'congratulations', label: 'Congratulations', path: '/celebrations/congratulations', status: 'planned' },
      { id: 'promotion', label: 'Promotion', path: '/celebrations/promotion', status: 'planned' },
      { id: 'achievement', label: 'Achievement', path: '/celebrations/achievement', status: 'planned' },
      { id: 'new-job', label: 'New Job', path: '/celebrations/new-job', status: 'planned' },
      { id: 'new-business', label: 'New Business', path: '/celebrations/new-business', status: 'planned' },
      { id: 'success-party', label: 'Success Party', path: '/celebrations/success-party', status: 'planned' },
    ],
  },

  /* ── Festivals ──────────────────────────────────────────────────────── */
  {
    id: 'festivals',
    label: 'Festivals',
    path: '/festivals',
    status: 'scaffold',
    module: 'festivals',
    children: [
      { id: 'diwali', label: 'Diwali', path: '/festivals/diwali', status: 'planned' },
      { id: 'pongal', label: 'Pongal', path: '/festivals/pongal', status: 'planned' },
      { id: 'christmas', label: 'Christmas', path: '/festivals/christmas', status: 'planned' },
      { id: 'new-year', label: 'New Year', path: '/festivals/new-year', status: 'planned' },
      { id: 'eid', label: 'Eid', path: '/festivals/eid', status: 'planned' },
      { id: 'ramzan', label: 'Ramzan', path: '/festivals/ramzan', status: 'planned' },
      { id: 'holi', label: 'Holi', path: '/festivals/holi', status: 'planned' },
      { id: 'raksha-bandhan', label: 'Raksha Bandhan', path: '/festivals/raksha-bandhan', status: 'planned' },
      { id: 'valentines', label: "Valentine's Day", path: '/festivals/valentines', status: 'planned' },
      { id: 'mothers-day', label: "Mother's Day", path: '/festivals/mothers-day', status: 'planned' },
      { id: 'fathers-day', label: "Father's Day", path: '/festivals/fathers-day', status: 'planned' },
      { id: 'teachers-day', label: "Teacher's Day", path: '/festivals/teachers-day', status: 'planned' },
      { id: 'childrens-day', label: "Children's Day", path: '/festivals/childrens-day', status: 'planned' },
    ],
  },

  /* ── Thank You ──────────────────────────────────────────────────────── */
  {
    id: 'thank-you',
    label: 'Thank You',
    path: '/thank-you',
    status: 'scaffold',
    module: 'thank-you',
    children: [
      { id: 'employee', label: 'Employee', path: '/thank-you/employee', status: 'planned' },
      { id: 'customer', label: 'Customer', path: '/thank-you/customer', status: 'planned' },
      { id: 'teacher', label: 'Teacher', path: '/thank-you/teacher', status: 'planned' },
      { id: 'doctor', label: 'Doctor', path: '/thank-you/doctor', status: 'planned' },
      { id: 'friend', label: 'Friend', path: '/thank-you/friend', status: 'planned' },
      { id: 'boss', label: 'Boss', path: '/thank-you/boss', status: 'planned' },
      { id: 'client', label: 'Client', path: '/thank-you/client', status: 'planned' },
      { id: 'partner', label: 'Partner', path: '/thank-you/partner', status: 'planned' },
    ],
  },

  /* ── Relationships ──────────────────────────────────────────────────── */
  {
    id: 'relationships',
    label: 'Relationships',
    path: '/relationships',
    status: 'scaffold',
    module: 'relationships',
    children: [
      { id: 'father', label: 'Father', path: '/relationships/father', status: 'planned' },
      { id: 'mother', label: 'Mother', path: '/relationships/mother', status: 'planned' },
      { id: 'brother', label: 'Brother', path: '/relationships/brother', status: 'planned' },
      { id: 'sister', label: 'Sister', path: '/relationships/sister', status: 'planned' },
      { id: 'husband', label: 'Husband', path: '/relationships/husband', status: 'planned' },
      { id: 'wife', label: 'Wife', path: '/relationships/wife', status: 'planned' },
      { id: 'boyfriend', label: 'Boyfriend', path: '/relationships/boyfriend', status: 'planned' },
      { id: 'girlfriend', label: 'Girlfriend', path: '/relationships/girlfriend', status: 'planned' },
      { id: 'best-friend', label: 'Best Friend', path: '/relationships/best-friend', status: 'planned' },
      { id: 'kids', label: 'Kids', path: '/relationships/kids', status: 'planned' },
      { id: 'grandparents', label: 'Grandparents', path: '/relationships/grandparents', status: 'planned' },
      { id: 'teacher-rel', label: 'Teacher', path: '/relationships/teacher', status: 'planned' },
      { id: 'boss-rel', label: 'Boss', path: '/relationships/boss', status: 'planned' },
      { id: 'employee-rel', label: 'Employee', path: '/relationships/employee', status: 'planned' },
      { id: 'client-rel', label: 'Client', path: '/relationships/client', status: 'planned' },
      { id: 'partner-rel', label: 'Partner', path: '/relationships/partner', status: 'planned' },
    ],
  },

  /* ── Surprise (unique) ──────────────────────────────────────────────── */
  {
    id: 'surprise',
    label: 'Surprise',
    path: '/surprise',
    status: 'live',
    module: 'surprise',
    children: [
      {
        id: 'local-surprise',
        label: 'Local Surprise',
        path: '/surprise/local',
        status: 'live',
        children: [
          { id: 'local-chennai', label: 'Chennai Locations', path: '/surprise/local', status: 'live' },
          { id: 'partner-profile', label: 'Partner Profile', path: '/surprise/local/partner/:id', status: 'planned' },
          { id: 'book-surprise', label: 'Book Now', path: '/surprise/local/book/:id', status: 'planned' },
        ],
      },
      {
        id: 'digital-surprise',
        label: 'Digital Surprise',
        path: '/surprise/digital',
        status: 'scaffold',
        children: [
          { id: 'digital-plans', label: 'Plans', path: '/surprise/digital/plans', status: 'planned' },
          { id: 'digital-customize', label: 'Customize', path: '/surprise/digital/customize/:planId', status: 'planned' },
          { id: 'digital-preview', label: 'Preview', path: '/surprise/digital/preview/:id', status: 'planned' },
        ],
      },
    ],
  },

  /* ── Handmade (makers marketplace — coming soon) ───────────────────── */
  {
    id: 'handmade',
    label: 'Handmade',
    path: '/handmade',
    status: 'scaffold',
    module: 'handmade',
    children: [
      { id: 'handmade-sell', label: 'Sell Handmade', path: '/handmade/sell', status: 'planned' },
      { id: 'handmade-makers', label: 'Maker Stories', path: '/handmade/makers', status: 'planned' },
    ],
  },

  /* ── Store / Wholesale ───────────────────────────────────────────────── */
  {
    id: 'store',
    label: 'Store',
    path: '/store',
    status: 'scaffold',
    module: 'store',
    children: [
      { id: 'bulk-orders', label: 'Bulk Orders', path: '/store/bulk', status: 'scaffold' },
      { id: 'wholesale', label: 'Wholesale', path: '/store/wholesale', status: 'planned' },
      { id: 'dealer', label: 'Dealer Pricing', path: '/store/dealer', status: 'planned' },
      { id: 'distributor', label: 'Distributor Registration', path: '/store/distributor', status: 'planned' },
      { id: 'vendor', label: 'Vendor Registration', path: '/store/vendor', status: 'planned' },
      { id: 'marketplace', label: 'Marketplace', path: '/store/marketplace', status: 'planned' },
      { id: 'gift-box-builder', label: 'Gift Box Builder', path: '/store/gift-box-builder', status: 'planned' },
      { id: 'hamper-builder', label: 'Build Your Own Hamper', path: '/store/hamper-builder', status: 'planned' },
      { id: 'packaging', label: 'Packaging Options', path: '/store/packaging', status: 'planned' },
      { id: 'custom-branding', label: 'Custom Branding', path: '/store/branding', status: 'planned' },
    ],
  },

  /* ── Extra features ─────────────────────────────────────────────────── */
  {
    id: 'extras',
    label: 'Discover',
    path: '/discover',
    status: 'scaffold',
    module: 'extras',
    children: [
      { id: 'ai-recommend', label: 'AI Gift Recommendation', path: '/ai/recommend', status: 'planned' },
      { id: 'ai-quiz', label: 'AI Gift Finder Quiz', path: '/ai/quiz', status: 'planned' },
      { id: 'reminders', label: 'Gift Reminder', path: '/reminders', status: 'planned' },
      { id: 'calendar', label: 'Occasion Calendar', path: '/calendar', status: 'planned' },
      { id: 'registry', label: 'Gift Registry', path: '/registry', status: 'planned' },
      { id: 'subscription', label: 'Gift Subscription', path: '/subscription', status: 'planned' },
      { id: 'gift-cards', label: 'Gift Cards', path: '/gift-cards', status: 'planned' },
      { id: 'coupons', label: 'Coupons', path: '/coupons', status: 'planned' },
      { id: 'refer', label: 'Refer & Earn', path: '/refer', status: 'planned' },
      { id: 'loyalty', label: 'Loyalty Points', path: '/loyalty', status: 'planned' },
      { id: 'track', label: 'Track Order', path: '/track-order', status: 'scaffold' },
    ],
  },

  /* ── Content & Commerce ─────────────────────────────────────────────── */
  {
    id: 'content',
    label: 'Content',
    path: null,
    status: 'live',
    module: 'content',
    children: [
      { id: 'about', label: 'About', path: '/about', status: 'live' },
      { id: 'blog', label: 'Blog', path: '/blog', status: 'live' },
      { id: 'blog-post', label: 'Blog Post', path: '/blog/:id', status: 'live' },
      { id: 'faq', label: 'FAQs', path: '/faq', status: 'live' },
      { id: 'contact', label: 'Contact', path: '/contact', status: 'live' },
      { id: 'gift-ideas', label: 'Gift Ideas', path: '/gift-ideas', status: 'scaffold' },
    ],
  },

  {
    id: 'commerce',
    label: 'Commerce',
    path: null,
    status: 'live',
    module: 'commerce',
    children: [
      { id: 'cart', label: 'Cart', path: '/cart', status: 'live' },
      { id: 'checkout', label: 'Checkout', path: '/checkout', status: 'live' },
      { id: 'order-success', label: 'Order Success', path: '/order-success', status: 'live' },
      { id: 'login', label: 'Login', path: '/login', status: 'live' },
      { id: 'signup', label: 'Sign Up', path: '/signup', status: 'live' },
      { id: 'forgot', label: 'Forgot Password', path: '/forgot-password', status: 'live' },
      { id: 'account', label: 'Account', path: '/account', status: 'live' },
    ],
  },
]

/** Primary header links (keep lean) */
export const primaryNav = [
  { label: 'Category', path: '/categories' },
  { label: 'Personalized', path: '/personalized' },
  { label: 'Handmade', path: '/handmade' },
  { label: 'Uniquworld', path: '/uniquworld' },
  { label: 'Surprise', path: '/surprise' },
  { label: 'Store', path: '/store' },
]

/** Mega-menu groups for desktop discovery */
export const megaMenu = [
  {
    title: 'Occasions',
    links: [
      { label: 'Birthday', path: '/celebrations/birthday' },
      { label: 'Anniversary', path: '/celebrations/anniversary' },
      { label: 'Wedding', path: '/functions/wedding' },
      { label: 'Thank You', path: '/thank-you' },
    ],
  },
  {
    title: 'Surprise',
    links: [
      { label: 'Local Surprise', path: '/surprise/local' },
      { label: 'Digital Surprise', path: '/surprise/digital' },
      { label: 'AI Gift Finder', path: '/ai/quiz' },
    ],
  },
  {
    title: 'Business',
    links: [
      { label: 'Corporate Gifts', path: '/corporate' },
      { label: 'Bulk Orders', path: '/store/bulk' },
      { label: 'Gift Box Builder', path: '/store/gift-box-builder' },
    ],
  },
]

/** Flatten all paths for router generation */
export function flattenSitemap(nodes = sitemap, acc = []) {
  for (const node of nodes) {
    if (node.path && !node.path.includes(':')) {
      acc.push(node)
    } else if (node.path?.includes(':')) {
      acc.push(node)
    }
    if (node.children?.length) flattenSitemap(node.children, acc)
  }
  return acc
}

export function getModuleRoutes(status = 'scaffold') {
  return flattenSitemap().filter((n) => n.status === status)
}
