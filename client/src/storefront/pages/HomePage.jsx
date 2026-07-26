import { HeroBanner } from '@/storefront/components/home/HeroBanner'
import { HomeEnquiryPopup } from '@/storefront/components/home/HomeEnquiryPopup'
import {
  BestSellers,
  BlogsSection,
  CorporateBand,
  CorporateClients,
  FeaturedCategories,
  GiftIdeasStrip,
  InstagramGallery,
  NewsletterBand,
  NewArrivals,
  OccasionCollections,
  PersonalizedBand,
  ReviewsSection,
  SurpriseDual,
  TodaysDeals,
  TrendingProducts,
} from '@/storefront/components/home/HomeSections'

/**
 * Home — premium multi-section layout.
 * Modules below are wired for IA; deeper pages ship module-by-module.
 */
export function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <PersonalizedBand />
      <CorporateBand />
      <OccasionCollections />
      <SurpriseDual />
      <BestSellers />
      <NewArrivals />
      <TrendingProducts />
      <TodaysDeals />
      <CorporateClients />
      <ReviewsSection />
      <InstagramGallery />
      <BlogsSection />
      <GiftIdeasStrip />
      <NewsletterBand />
      <HomeEnquiryPopup />
    </>
  )
}
