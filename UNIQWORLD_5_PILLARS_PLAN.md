# UniqWorld — 5 Major Pillars Plan

**Product:** UniqWorld / Uniquworld  
**Document type:** Product & delivery plan  
**Purpose:** Define the five core business pillars, what we build, for whom, and in what order  
**Related:** [UNIQWORLD_PRODUCT_DOCUMENTATION.md](./UNIQWORLD_PRODUCT_DOCUMENTATION.md) · [UNIQWORLD_5_PILLARS_PROJECTIONS.md](./UNIQWORLD_5_PILLARS_PROJECTIONS.md) (workflow, revenue, profit, reach, timeline, cost, success rate)  
**Last updated:** August 2026  

---

## Vision (one line)

UniqWorld becomes India’s most trusted celebration platform by uniting **category commerce**, **personalised gifting**, **handmade creators**, **local + digital surprises**, and **in-store digital sales tools** under one brand.

---

## The 5 major pillars

| # | Pillar | Tagline | Primary users |
|---|--------|---------|----------------|
| 1 | **Category & Custom Sales** | Shop by category + sell custom products | Shoppers, UniqWorld ops |
| 2 | **Personalized Gifts** | Gifts for every occasion & relationship | Shoppers, corporate buyers |
| 3 | **Handmade** | Work-from-home creators sell unique crafts | Makers, artisans, hobby sellers |
| 4 | **Surprises** | Local celebration places + digital share templates | Couples, families, surprise partners |
| 5 | **In Store** | Local shops list, manage inventory, sell & bill digitally | Shop / business owners |

These map to the storefront primary nav: **Category · Personalized · Handmade · Surprise · Store**.

---

# Pillar 1 — Category-wise products & custom product sales

## Goal

Make UniqWorld the default place to **browse gifts by category** and to **order / sell custom products** with clear catalogue, filters, and fulfilment.

## Scope

### Category-wise products
- Master categories and subcategories (admin-managed)
- Category landing pages (`/categories`, `/categories/:slug`)
- Filters: price, occasion, material, rating, new / bestseller
- Product detail, variants, images, reviews, wishlist, cart
- Search and (later) compare

### Custom product sales
- Products marked as **custom** or **made-to-order**
- Custom options: text, colour, size, packaging notes
- Lead time and pricing rules
- Order flows into admin **Personalized / Custom Orders** for production
- Corporate / bulk custom runs (linked to quotations)

## Key features

| Feature | Description | Priority |
|---------|-------------|----------|
| Category tree | Nested categories with SEO-friendly slugs | P0 |
| Product catalogue | Images, variants, stock, pricing | P0 |
| Custom product flag | Made-to-order with option schema | P0 |
| Filters & search | Fast discovery | P0 |
| Cart → checkout | COD + Razorpay | P0 |
| Admin catalog ERP | Products, categories, inventory | P0 |
| Custom order queue | Ops workflow for custom jobs | P1 |

## User flows

```
Browse category → Product → (optional custom options) → Cart → Checkout → Fulfilment
```

```
Admin creates category / product → Publish → Appears on storefront
```

## Success metrics

- % of orders from category browse vs search  
- Custom product conversion rate  
- Average order value (AOV) by category  

## Delivery phases

| Phase | Deliverables |
|-------|----------------|
| **1.1** | Live categories, PDP, cart, checkout (strengthen what exists) |
| **1.2** | Category slug pages, search, filters |
| **1.3** | Custom product options + admin custom-order queue |
| **1.4** | Merchandising (bestsellers, deals, collections) |

---

# Pillar 2 — Personalized gifts (occasions & relationships)

## Goal

Every celebration path — **Functions, Celebrations, Festivals, Thank You, Relationships** — leads to personalised gifts that feel one-of-one (name, photo, message, engraving, logo).

## Occasion & relationship map

### Functions
Wedding · Engagement · Reception · Housewarming · Baby shower · Naming ceremony · Retirement · Farewell · Graduation · Office / school / college events

### Celebrations
Birthday · Anniversary · Congratulations · Promotion · Achievement · New job · New business · Success party

### Festivals
Diwali · Pongal · Christmas · New Year · Eid · Ramzan · Holi · Raksha Bandhan · Valentine’s Day · Mother’s / Father’s / Teacher’s / Children’s Day

### Thank You
Employee · Customer · Teacher · Doctor · Friend · Boss · Client · Partner

### Relationships
Father · Mother · Brother · Sister · Husband · Wife · Boyfriend · Girlfriend · Best friend · Kids · Grandparents · Teacher · Boss · Employee · Client · Partner

## Personalisation types

| Type | Path (planned) | Notes |
|------|----------------|-------|
| Custom name | `/personalized/name` | Text / calligraphy on product |
| Photo gifts | `/personalized/photo` | Upload photos |
| Audio QR | `/personalized/audio-qr` | QR → voice message |
| Video QR | `/personalized/video-qr` | QR → video |
| Engraving | `/personalized/engraving` | Metal / wood / acrylic |
| Custom message | `/personalized/message` | Cards / prints |
| Logo print | `/personalized/logo` | Corporate branding |
| Gift box personalise | `/personalized/box` | Sleeve / insert |
| Live preview studio | `/personalized/studio` | See design before buy |

## Key features

| Feature | Priority |
|---------|----------|
| Occasion hubs with curated collections | P0 |
| Relationship hubs with curated collections | P0 |
| Personalisation hub + type landings | P0 |
| Upload media + preview | P0 |
| Personalized order pipeline in admin | P0 |
| Corporate branding + bulk personalisation | P1 |
| Live preview studio | P1 |

## User flows

```
Pick occasion / relationship → Browse curated gifts → Personalise
  → Preview → Checkout → Production → Ship
```

## Success metrics

- Personalised order share of total GMV  
- Completion rate of personalisation funnel  
- Repeat purchase for occasion reminders (later)  

## Delivery phases

| Phase | Deliverables |
|-------|----------------|
| **2.1** | Hub pages live (Functions, Celebrations, Festivals, Thank You, Relationships) |
| **2.2** | Leaf occasion pages + product tagging by occasion |
| **2.3** | Name / photo / message personalisation + admin queue |
| **2.4** | Engraving, QR audio/video, logo, studio preview |

---

# Pillar 3 — Handmade (creators marketplace)

## Goal

Become India’s **#1 initiative for handmade creativity sales** — anyone working from home or as an artisan can **upload unique handmade products** to UniqWorld ecommerce and sell nationwide.

## Positioning

- **Work from home** friendly seller onboarding  
- **Unique, one-of-a-kind** handmade products (not mass retail clones)  
- UniqWorld provides **trust, discovery, payments, shipping**  
- Brand promise: *Your creativity. Our marketplace. India’s celebrations.*

## Scope

### For makers (sellers)
- Easy signup as handmade creator  
- Upload products (photos, story, materials, price, stock)  
- Own mini storefront / maker profile  
- Orders, earnings, withdrawals  
- Guidance: packaging, quality, shipping  

### For buyers
- Handmade hub (`/handmade`)  
- Maker stories (`/handmade/makers`)  
- Filters: craft type, city, price, eco / traditional  
- Trust badges (verified maker, handmade authentic)  

### For UniqWorld
- Approval / moderation of makers and listings  
- Commission / platform fee model  
- Featured makers and collections  
- Quality & return policy for handmade  

## Key features

| Feature | Priority |
|---------|----------|
| Maker registration & KYC-lite | P0 |
| Product upload + media gallery | P0 |
| Approval workflow (admin) | P0 |
| Handmade catalogue on storefront | P0 |
| Maker profile / stories | P1 |
| Earnings & withdrawals | P0 (reuse store-partner patterns) |
| Sell Handmade landing (`/handmade/sell`) | P0 |
| Quality guidelines & dispute flow | P1 |

## User flows

```
Maker: Register → Verify → Upload unique handmade product → Approved
  → Listed on UniqWorld → Order → Fulfil → Earn → Withdraw
```

```
Buyer: Handmade hub → Maker / product → Buy → Receive unique craft
```

## Success metrics

- Active makers and listings  
- Handmade GMV and repeat makers  
- Approval turnaround time  
- NPS / reviews for handmade orders  

## Delivery phases

| Phase | Deliverables |
|-------|----------------|
| **3.1** | Handmade landing + “Sell Handmade” onboarding |
| **3.2** | Maker upload, admin approve, catalogue live |
| **3.3** | Maker profiles, stories, featured collections |
| **3.4** | Growth: campaigns, city hubs, “#1 handmade initiative” brand push |

---

# Pillar 4 — Surprises (Local directory + Digital templates)

## Goal

Own the **surprise moment**: (A) a **local directory of celebration places and surprise partners across India**, and (B) **digital surprise templates** people create and share.

## 4A — Local Surprise Directory

### What it is
A pan-India directory of **celebration / surprise venues and partners** — cafés, rooftops, decorators, experience partners, local agents — listed so customers can discover and book surprises.

### Scope
- Partner profiles: city, locality, photos, services, price range, ratings  
- Place lists: celebration spots by city / occasion  
- Search: city → occasion → partner type  
- Book now (enquiry → confirm → pay)  
- Expand from Chennai pilot → all major cities → pan-India  

### Key features

| Feature | Priority |
|---------|----------|
| City / place listings | P0 |
| Partner profile pages | P0 |
| Filters (city, budget, occasion) | P0 |
| Enquiry / book flow | P1 |
| Partner onboarding + admin approval | P0 |
| Reviews & ratings | P1 |
| Pan-India coverage rollout | P1 → P2 |

### User flow

```
Surprise → Local → Choose city → Browse places / partners
  → Partner profile → Book / enquire → Confirm → Experience day
```

## 4B — Digital Surprises

### What it is
Customers **create a digital surprise** from templates (photos, music, message, theme) and **share a private link** with someone they love.

### Scope (builds on current Digital Surprise)
- Template library by occasion (birthday, Diwali, Girlfriend’s Day, …)  
- Customize → preview → pay (e.g. ₹49) → share `/surprise/s/:slug`  
- Expiry window (e.g. 30 days)  
- Plans / packs (later)  

### Key features

| Feature | Priority |
|---------|----------|
| Occasion templates | P0 |
| Media + message editor | P0 |
| Preview + Razorpay checkout | P0 (exists — polish) |
| Shareable fullscreen page | P0 (exists — polish) |
| Template marketplace / more themes | P1 |
| Plans & multi-page surprises | P2 |

### User flow

```
Surprise → Digital → Pick template → Customize → Preview
  → Pay → Share link → Recipient opens surprise
```

## Success metrics

- Local: cities covered, partners listed, booking conversion  
- Digital: templates created, paid conversion, shares opened  

## Delivery phases

| Phase | Deliverables |
|-------|----------------|
| **4.1** | Digital Surprise polish + more templates |
| **4.2** | Local directory (Chennai → multi-city) + partner profiles |
| **4.3** | Booking / pay for local experiences |
| **4.4** | Pan-India partner network + digital plans |

---

# Pillar 5 — In Store (local store owners digital sales)

## Goal

Give **local shop and business owners** a UniqWorld **In Store** system: list products, manage **separate inventory**, run **sales & billing**, and keep their catalogue **digital and shareable** — while UniqWorld maintains platform sales standards.

## Positioning

- Not only marketplace listing — a **mini sales OS** for physical stores  
- Each store has **own inventory and product management**  
- Billing / sales tools for counter + online  
- Products maintained digitally; shareable store links / catalogues  
- UniqWorld brand trust + optional platform visibility  

## Scope

### For store owners
- Register business / shop  
- Separate store inventory (SKU, stock, price)  
- Product management (add, edit, hide, variants)  
- Sales & billing (invoice / bill, payment modes)  
- Online listing of store products on UniqWorld (optional / approved)  
- Digital sharing: store link, WhatsApp catalogue, QR to store page  
- Earnings, reports, withdrawals  

### For UniqWorld
- Store approval, fee model (~10% on platform sales)  
- Admin: stores, store products, withdrawals  
- Compliance and support  

### For customers
- Discover stores / store products  
- Buy online from partner inventory  
- Trust: verified store badge  

## Key features

| Feature | Priority |
|---------|----------|
| Store registration & approval | P0 (partially live) |
| Partner dashboard | P0 (partially live) |
| Product & stock management | P0 |
| Sales / order history | P0 |
| Billing / invoice module | P1 |
| Digital share (store link, QR, WhatsApp) | P1 |
| Separate inventory per store | P0 |
| Withdrawals & earnings | P0 |
| Wholesale / bulk / dealer pricing | P2 |

## User flows

```
Store owner: Register → Approve → Add inventory & products
  → Sell in shop (billing) and/or online on UniqWorld
  → Share digital catalogue → Track sales → Withdraw
```

```
Customer: Store / marketplace → Store product → Buy → Delivery / pickup
```

## Success metrics

- Active stores and SKUs  
- Online vs offline bill volume  
- Catalogue share → order conversion  
- Withdrawal success rate  

## Delivery phases

| Phase | Deliverables |
|-------|----------------|
| **5.1** | Strengthen partner portal (products, stock, sales, earnings) |
| **5.2** | Digital share (public store page, QR, WhatsApp) |
| **5.3** | Billing / invoice for shop counter use |
| **5.4** | Advanced: wholesale, dealer pricing, multi-branch inventory |

---

# Cross-cutting platform (supports all 5 pillars)

| Area | Must support |
|------|----------------|
| **Auth & roles** | Customer, maker, store_owner, corporate, admin, super_admin |
| **Payments** | Razorpay + COD where applicable |
| **Shipping** | Shiprocket / partner logistics |
| **Admin ERP** | Catalog, orders, partners, handmade makers, surprise partners, CMS |
| **Trust** | Reviews, verification badges, refunds / disputes |
| **Brand** | One UniqWorld experience across all five pillars |

---

# Recommended build order

| Wave | Focus | Why |
|------|--------|-----|
| **Wave 1** | Pillar 1 + Pillar 2 hubs | Revenue from catalogue + occasion discovery |
| **Wave 2** | Pillar 4 Digital + Pillar 5 core | Unique differentiator + store GMV |
| **Wave 3** | Pillar 3 Handmade | Creator growth & #1 handmade initiative |
| **Wave 4** | Pillar 4 Local pan-India + Pillar 2 deep personalisation | Scale surprise network + studio |
| **Wave 5** | In Store billing + Handmade growth + AI discovery | Moat & retention |

---

# Pillar ownership snapshot

| Pillar | Storefront paths | Admin / ops |
|--------|------------------|-------------|
| 1 Category & custom | `/categories`, `/products/:id` | Products, categories, inventory, custom orders |
| 2 Personalized | `/personalized`, occasion hubs | Personalized orders, corporate quotes |
| 3 Handmade | `/handmade`, `/handmade/sell`, `/handmade/makers` | Maker approval, handmade listings |
| 4 Surprises | `/surprise/local`, `/surprise/digital`, `/surprise/s/:slug` | Partners, places, digital templates |
| 5 In Store | `/store`, `/store/vendor`, `/store/partner` | Stores, store products, withdrawals, billing |

---

# Definition of done (per pillar)

A pillar is **production-ready** when:

1. End-to-end user flow works (discover → buy/book → pay → fulfil)  
2. Admin can approve, manage, and support that pillar  
3. Payments / fees / payouts are correct  
4. Mobile + desktop storefront quality meets brand bar  
5. Basic analytics exist (orders, GMV, conversion)  

---

# Summary

| # | Pillar | One-sentence plan |
|---|--------|-------------------|
| **1** | Category & custom | Sell every gift by category and support made-to-order custom products end-to-end. |
| **2** | Personalized | Map every function, celebration, festival, thank-you, and relationship to personalised gifts. |
| **3** | Handmade | Let anyone upload unique handmade creativity and sell on UniqWorld — India’s #1 handmade initiative. |
| **4** | Surprises | List celebration places & partners across India; let anyone create and share digital surprise templates. |
| **5** | In Store | Give local shop owners inventory, product, sales & billing tools and digital catalogue sharing on UniqWorld. |

**UniqWorld = Category commerce + Personalised occasions + Handmade creators + Local & digital surprises + In-store digital sales — one celebration brand.**
