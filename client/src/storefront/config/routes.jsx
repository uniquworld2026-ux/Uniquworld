import { Navigate, Route, useLocation } from 'react-router-dom'
import { HomePage } from '@/storefront/pages/HomePage'
import { CartPage } from '@/storefront/pages/CartPage'
import { ProductsPage } from '@/storefront/pages/ProductsPage'
import { ProductDetailsPage } from '@/storefront/pages/ProductDetailsPage'
import { BulkOrdersPage } from '@/storefront/pages/ShopPages'
import { PersonalizedPage } from '@/storefront/features/personalized'
import {
  BlogPage,
  BlogPostPage,
  FaqPage,
  ContactPage,
} from '@/storefront/pages/ContentPages'
import { AboutPage } from '@/storefront/pages/AboutPage'
import {
  LoginPage,
  SignupPage,
  ForgotPasswordPage,
  WishlistPage,
  CheckoutPage,
  OrderSuccessPage,
} from '@/storefront/pages/AuthCheckoutPages'
import {
  AccountLayout,
  AccountOverviewPage,
  AccountOrdersPage,
  AccountOrderDetailPage,
  AccountProfilePage,
  AccountAddressesPage,
  AccountNotificationsPage,
  AccountReturnsPage,
} from '@/storefront/pages/AccountPages'
import { RequireAuth } from '@/storefront/auth/RequireAuth'
import { ModulePlaceholderPage } from '@/storefront/pages/ModulePlaceholderPage'
import {
  CorporateHubPage,
  FunctionsHubPage,
  CelebrationsHubPage,
  FestivalsHubPage,
  ThankYouHubPage,
  RelationshipsHubPage,
  SurpriseHubPage,
  LocalSurprisePage,
  DigitalSurprisePage,
  DiscoverHubPage,
  CategorySlugPage,
  SearchPage,
  GiftIdeasPage,
  TrackOrderPage,
} from '@/storefront/pages/ModuleHubPages'
import {
  DigitalSurpriseCustomizePage,
  DigitalSurpriseLivePage,
} from '@/storefront/pages/DigitalSurprisePages'
import { DigitalSurpriseDemoPage } from '@/storefront/pages/DigitalSurpriseDemoPage'
import { StoreHubPage } from '@/storefront/pages/StoreCatalogPage'
import { StoreProductDetailsPage } from '@/storefront/pages/StoreProductDetailsPage'
import { HandmadePage } from '@/storefront/pages/HandmadePage'
import { StorefrontLayout } from '@/storefront/layouts/StorefrontLayout'
import { NotFoundPage } from '@/storefront/pages/NotFoundPage'

/** Planned leaf routes → lightweight placeholders */
const plannedLeaves = [
  // Personalized
  ['personalized/name', 'Custom Name Gifts'],
  ['personalized/photo', 'Photo Gifts'],
  ['personalized/audio-qr', 'Audio QR Gifts'],
  ['personalized/video-qr', 'Video QR Gifts'],
  ['personalized/engraving', 'Custom Engraving'],
  ['personalized/message', 'Custom Message'],
  ['personalized/logo', 'Logo Printing'],
  ['personalized/box', 'Gift Box Personalization'],
  ['personalized/studio', 'Live Preview Studio'],
  // Handmade
  ['handmade/sell', 'Sell Handmade'],
  ['handmade/makers', 'Maker Stories'],
  // Corporate
  ['corporate/welcome-kits', 'Employee Welcome Kits'],
  ['corporate/joining-kits', 'Joining Kits'],
  ['corporate/merchandise', 'Corporate Merchandise'],
  ['corporate/executive', 'Executive Gifts'],
  ['corporate/office', 'Office Accessories'],
  ['corporate/promo', 'Promotional Products'],
  ['corporate/bulk', 'Bulk Ordering'],
  ['corporate/quote', 'Request Quotation'],
  ['corporate/branding', 'Branding Service'],
  ['corporate/packaging', 'Custom Packaging'],
  // Functions
  ['functions/wedding', 'Wedding'],
  ['functions/engagement', 'Engagement'],
  ['functions/reception', 'Reception'],
  ['functions/housewarming', 'Housewarming'],
  ['functions/baby-shower', 'Baby Shower'],
  ['functions/naming-ceremony', 'Naming Ceremony'],
  ['functions/retirement', 'Retirement'],
  ['functions/farewell', 'Farewell'],
  ['functions/graduation', 'Graduation'],
  ['functions/office-events', 'Office Events'],
  ['functions/school-events', 'School Events'],
  ['functions/college-events', 'College Events'],
  // Celebrations
  ['celebrations/birthday', 'Birthday'],
  ['celebrations/anniversary', 'Anniversary'],
  ['celebrations/congratulations', 'Congratulations'],
  ['celebrations/promotion', 'Promotion'],
  ['celebrations/achievement', 'Achievement'],
  ['celebrations/new-job', 'New Job'],
  ['celebrations/new-business', 'New Business'],
  ['celebrations/success-party', 'Success Party'],
  // Festivals
  ['festivals/diwali', 'Diwali'],
  ['festivals/pongal', 'Pongal'],
  ['festivals/christmas', 'Christmas'],
  ['festivals/new-year', 'New Year'],
  ['festivals/eid', 'Eid'],
  ['festivals/ramzan', 'Ramzan'],
  ['festivals/holi', 'Holi'],
  ['festivals/raksha-bandhan', 'Raksha Bandhan'],
  ['festivals/valentines', "Valentine's Day"],
  ['festivals/mothers-day', "Mother's Day"],
  ['festivals/fathers-day', "Father's Day"],
  ['festivals/teachers-day', "Teacher's Day"],
  ['festivals/childrens-day', "Children's Day"],
  // Thank you
  ['thank-you/employee', 'Employee Thank You'],
  ['thank-you/customer', 'Customer Thank You'],
  ['thank-you/teacher', 'Teacher Thank You'],
  ['thank-you/doctor', 'Doctor Thank You'],
  ['thank-you/friend', 'Friend Thank You'],
  ['thank-you/boss', 'Boss Thank You'],
  ['thank-you/client', 'Client Thank You'],
  ['thank-you/partner', 'Partner Thank You'],
  // Relationships
  ['relationships/father', 'For Father'],
  ['relationships/mother', 'For Mother'],
  ['relationships/brother', 'For Brother'],
  ['relationships/sister', 'For Sister'],
  ['relationships/husband', 'For Husband'],
  ['relationships/wife', 'For Wife'],
  ['relationships/boyfriend', 'For Boyfriend'],
  ['relationships/girlfriend', 'For Girlfriend'],
  ['relationships/best-friend', 'For Best Friend'],
  ['relationships/kids', 'For Kids'],
  ['relationships/grandparents', 'For Grandparents'],
  ['relationships/teacher', 'For Teacher'],
  ['relationships/boss', 'For Boss'],
  ['relationships/employee', 'For Employee'],
  ['relationships/client', 'For Client'],
  ['relationships/partner', 'For Partner'],
  // Store
  ['store/wholesale', 'Wholesale Orders'],
  ['store/dealer', 'Dealer Pricing'],
  ['store/distributor', 'Distributor Registration'],
  ['store/vendor', 'Vendor Registration'],
  ['store/marketplace', 'Marketplace'],
  ['store/gift-box-builder', 'Gift Box Builder'],
  ['store/hamper-builder', 'Build Your Own Hamper'],
  ['store/packaging', 'Packaging Options'],
  ['store/branding', 'Custom Branding'],
  // Extras
  ['ai/recommend', 'AI Gift Recommendation'],
  ['ai/quiz', 'AI Gift Finder Quiz'],
  ['reminders', 'Gift Reminder'],
  ['calendar', 'Occasion Calendar'],
  ['registry', 'Gift Registry'],
  ['subscription', 'Gift Subscription'],
  ['gift-cards', 'Gift Cards'],
  ['coupons', 'Coupons'],
  ['refer', 'Refer & Earn'],
  ['loyalty', 'Loyalty Points'],
]

/** Preserve query string when redirecting /products → /categories */
function ProductsToCategoriesRedirect() {
  const { search } = useLocation()
  return <Navigate to={`/categories${search}`} replace />
}

/**
 * Storefront route tree under StorefrontLayout.
 * Used as a child of <Routes> in AppRouter.
 */
export const storefrontRouteTree = (
  <Route element={<StorefrontLayout />}>
    <Route index element={<HomePage />} />

    {/* Catalog — Category page lives at /categories; details stay at /products/:id */}
    <Route path="categories" element={<ProductsPage />} />
    <Route path="categories/:slug" element={<CategorySlugPage />} />
    <Route path="products" element={<ProductsToCategoriesRedirect />} />
    <Route path="products/:id" element={<ProductDetailsPage />} />
    <Route path="search" element={<SearchPage />} />
    <Route path="wishlist" element={<WishlistPage />} />
    <Route path="uniquworld" element={<Navigate to="/categories?tag=uniquworld" replace />} />

    {/* Module hubs */}
    <Route path="personalized" element={<PersonalizedPage />} />
    <Route path="handmade" element={<HandmadePage />} />
    <Route path="corporate" element={<CorporateHubPage />} />
    <Route path="functions" element={<FunctionsHubPage />} />
    <Route path="celebrations" element={<CelebrationsHubPage />} />
    <Route path="festivals" element={<FestivalsHubPage />} />
    <Route path="thank-you" element={<ThankYouHubPage />} />
    <Route path="relationships" element={<RelationshipsHubPage />} />
    <Route path="surprise" element={<SurpriseHubPage />} />
    <Route path="surprise/local" element={<LocalSurprisePage />} />
    <Route path="surprise/digital" element={<DigitalSurprisePage />} />
    <Route path="surprise/digital/:occasionSlug" element={<DigitalSurpriseCustomizePage />} />
    <Route path="store" element={<StoreHubPage />} />
    <Route path="store/p/:slug" element={<StoreProductDetailsPage />} />
    <Route path="store/bulk" element={<BulkOrdersPage />} />
    <Route path="discover" element={<DiscoverHubPage />} />
    <Route path="gift-ideas" element={<GiftIdeasPage />} />
    <Route path="track-order" element={<TrackOrderPage />} />

    {/* Legacy redirects */}
    <Route path="personalized-gifts" element={<Navigate to="/personalized" replace />} />
    <Route path="corporate-gifts" element={<Navigate to="/corporate" replace />} />
    <Route path="bulk-orders" element={<Navigate to="/store/bulk" replace />} />

    {/* Content */}
    <Route path="about" element={<AboutPage />} />
    <Route path="blog" element={<BlogPage />} />
    <Route path="blog/:id" element={<BlogPostPage />} />
    <Route path="faq" element={<FaqPage />} />
    <Route path="contact" element={<ContactPage />} />

    {/* Commerce */}
    <Route path="cart" element={<CartPage />} />
    <Route path="checkout" element={<CheckoutPage />} />
    <Route path="order-success" element={<OrderSuccessPage />} />
    <Route path="login" element={<LoginPage />} />
    <Route path="signup" element={<SignupPage />} />
    <Route path="forgot-password" element={<ForgotPasswordPage />} />
    <Route
      path="account"
      element={
        <RequireAuth>
          <AccountLayout />
        </RequireAuth>
      }
    >
      <Route index element={<AccountOverviewPage />} />
      <Route path="orders" element={<AccountOrdersPage />} />
      <Route path="orders/:orderId" element={<AccountOrderDetailPage />} />
      <Route path="returns" element={<AccountReturnsPage />} />
      <Route path="profile" element={<AccountProfilePage />} />
      <Route path="addresses" element={<AccountAddressesPage />} />
      <Route path="notifications" element={<AccountNotificationsPage />} />
    </Route>

    {/* Planned module leaves */}
    {plannedLeaves.map(([path, title]) => (
      <Route
        key={path}
        path={path}
        element={
          <ModulePlaceholderPage
            title={title}
            nextModule={title}
            description="This page is reserved in the sitemap and will be built in its module pass."
          />
        }
      />
    ))}

    <Route path="*" element={<NotFoundPage />} />
  </Route>
)

/** Full-screen surprise pages — no header/footer/install overlay */
export const surpriseFullscreenRoutes = (
  <>
    <Route path="/surprise/digital/:occasionSlug/demo" element={<DigitalSurpriseDemoPage />} />
    <Route path="/surprise/s/:slug" element={<DigitalSurpriseLivePage />} />
  </>
)
