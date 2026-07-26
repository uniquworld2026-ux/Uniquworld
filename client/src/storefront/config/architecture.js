/**
 * Uniquworld storefront folder architecture
 *
 * client/src/
 * ├── app/                         App shell, router, providers
 * ├── design-system/               Tokens + global CSS
 * ├── shared/                      Cross-app UI, hooks, utils
 * │   └── components/ui/           Button, Badge, Modal, Avatar…
 * └── storefront/                  Customer-facing website
 *     ├── config/
 *     │   ├── sitemap.js           IA source of truth
 *     │   ├── routes.jsx           Storefront route tree
 *     │   └── architecture.js      This file
 *     ├── layouts/                 StorefrontLayout
 *     ├── pages/                   Route-level pages + hubs
 *     ├── data/                    Static content / mocks
 *     ├── hooks/                   Cart, wishlist, recently viewed
 *     ├── components/
 *     │   ├── ui/                  Container, Section, Reveal, Glass…
 *     │   ├── layout/              Header, Footer, PageHero
 *     │   ├── home/                Homepage sections
 *     │   ├── product/             ProductCard, QuickView…
 *     │   └── cart/
 *     └── features/                Domain modules (built pass-by-pass)
 *         ├── home/
 *         ├── category/
 *         ├── personalized/
 *         ├── corporate/
 *         ├── functions/
 *         ├── celebrations/
 *         ├── festivals/
 *         ├── thank-you/
 *         ├── relationships/
 *         ├── surprise/
 *         │   ├── local/
 *         │   └── digital/
 *         ├── store/
 *         └── extras/
 *
 * Build order (agreed):
 * 1. Foundation (sitemap, routes, UI kit, homepage layout) ← current
 * 2. Category / catalog
 * 3. Personalized
 * 4. Corporate
 * 5. Occasions (functions, celebrations, festivals, thank-you, relationships)
 * 6. Surprise (local + digital)
 * 7. Store / wholesale
 * 8. Extra features
 */

export const buildOrder = [
  'foundation',
  'category',
  'personalized',
  'corporate',
  'occasions',
  'surprise',
  'store',
  'extras',
]

export const featureModules = [
  'home',
  'category',
  'personalized',
  'corporate',
  'functions',
  'celebrations',
  'festivals',
  'thank-you',
  'relationships',
  'surprise',
  'store',
  'extras',
]
