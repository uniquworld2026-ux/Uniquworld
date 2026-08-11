# UniqWorld — Complete Product Documentation

**Product name:** UniqWorld / Uniquworld  
**Domain:** [uniquworld.com](https://uniquworld.com)  
**Document type:** Complete product documentation (brand, pillars, features, tech, roadmap)  
**Last updated:** August 2026  

### Related documents

| Document | Purpose |
|----------|---------|
| [UNIQWORLD_5_PILLARS_PLAN.md](./UNIQWORLD_5_PILLARS_PLAN.md) | Delivery plan per pillar (scope, phases, ownership) |
| [UNIQWORLD_5_PILLARS_PROJECTIONS.md](./UNIQWORLD_5_PILLARS_PROJECTIONS.md) | Workflow, revenue, profit, reach, timeline, cost, success rate |
| `server/docs/ARCHITECTURE.md` | Backend architecture |
| `server/docs/ER_DIAGRAM.md` | Data model / ER diagram |

---

## 1. Executive summary

UniqWorld is a **premium, India-focused celebration and gifting platform**. It helps people and businesses gift thoughtfully for weddings, festivals, birthdays, thank-yous, and relationships — with category shopping, personalisation, handmade creators, local and digital surprises, and digital tools for local stores.

### One-line definition

**UniqWorld = Category commerce + Personalised occasions + Handmade creators + Local & digital surprises + In-store digital sales — one celebration brand.**

### Platform surfaces

| Surface | Audience | Entry |
|---------|----------|--------|
| **Storefront** | Consumers & corporate buyers | `uniquworld.com` |
| **Digital Surprise** | Gift senders & recipients | `/surprise/s/:slug` |
| **Handmade marketplace** | Makers & buyers | `/handmade` |
| **In Store / Partner portal** | Shop & business owners | `/store/partner` |
| **Admin ERP** | Ops, catalog, commerce staff | `/admin` |

### Primary navigation (5 pillars)

| # | Nav | Pillar |
|---|-----|--------|
| 1 | **Category** | Category-wise products & custom product sales |
| 2 | **Personalized** | Personalised gifts for every occasion & relationship |
| 3 | **Handmade** | Work-from-home creators sell unique handmade products |
| 4 | **Surprise** | Local celebration directory + digital surprise templates |
| 5 | **Store** | In Store — inventory, sales, billing & digital catalogue for local shops |

---

## 2. Brand & positioning

| Item | Detail |
|------|--------|
| **Positioning** | Premium curated gifts, crafted with intention |
| **Vision** | Be the most trusted gifting brand for celebrating the joy of giving |
| **Mission** | Wow every customer, every time — through premium products, personalisation, and a people-first experience |
| **Market** | India (INR, COD, pan-India delivery; local surprise expanding from Chennai) |
| **Experience pillars** | Thoughtful gifts · Scheduled delivery · Personalised for them |

### Brand story

| Year | Milestone |
|------|-----------|
| 2019 | Studio beginnings — intentional, handcrafted gifts |
| 2021 | Personalisation studio — photo gifts, engraving, custom messaging |
| 2023 | Corporate & surprise — welcome kits, bulk gifting, local experiences |
| 2025 | Pan-India reach — premium catalogue and nationwide delivery |
| 2026 | One celebration brand — all five product pillars under one roof |

### Leadership

| Role | Name |
|------|------|
| CEO | Gayathri B |
| COO | Surendar B |
| CTO | Ranjith Kumar C |

### Brand stats (marketing)

- 1M+ moments gifted  
- 200+ cities served  
- 50+ celebration themes  
- 100% care in every box  

---

## 3. Target users & roles

### Personas

| Persona | Needs | Primary pillar(s) |
|---------|--------|-------------------|
| **Consumer shopper** | Occasion gifts, COD/online checkout, tracking | 1, 2, 4 |
| **Corporate buyer** | Bulk / welcome kits, quotations, branding | 1, 2 |
| **Handmade maker** | Upload unique crafts, sell nationwide, earn | 3 |
| **Store / shop owner** | Inventory, billing, digital catalogue, online sales | 5 |
| **Surprise partner** | List celebration places / experiences, get bookings | 4 |
| **Admin / ops** | Catalog, orders, partners, CMS, payouts | All |
| **Super admin** | Full RBAC and platform control | All |

### Application roles

| Role | Capabilities |
|------|----------------|
| `customer` | Account, cart, orders, wishlist, digital surprise |
| `corporate` | Corporate enquiry / quote flows |
| `store_owner` | Partner portal: products, sales, earnings, withdrawals |
| `admin` | Admin ERP (limited vs super admin) |
| `super_admin` | Full permissions including roles management |

Staff also use a dedicated **admin users** table with OTP login for `/admin`.  
*(Handmade makers may use `store_owner` or a dedicated maker role as the marketplace matures.)*

---

## 4. The 5 major product pillars

### Pillar overview

| # | Pillar | Goal | Primary users |
|---|--------|------|----------------|
| **1** | Category & custom sales | Shop by category; sell made-to-order custom products | Shoppers, UniqWorld ops |
| **2** | Personalized gifts | Gifts for every function, celebration, festival, thank-you & relationship | Shoppers, corporate |
| **3** | Handmade | India’s leading handmade creativity marketplace — anyone can upload & sell | Makers, artisans |
| **4** | Surprises | Pan-India local celebration directory + shareable digital surprise templates | Families, partners |
| **5** | In Store | Local shops manage inventory, products, sales/billing & digital sharing | Shop / business owners |

Full delivery detail → [5 Pillars Plan](./UNIQWORLD_5_PILLARS_PLAN.md)  
Numbers (revenue, cost, success rate) → [Projections](./UNIQWORLD_5_PILLARS_PROJECTIONS.md)

---

### Pillar 1 — Category-wise products & custom product sales

**Goal:** Make UniqWorld the default place to browse gifts by category and order custom / made-to-order products.

**Includes**
- Master categories & subcategories (admin-managed)
- Category pages: `/categories`, `/categories/:slug`
- Product detail, variants, filters, search, wishlist, cart, checkout
- Custom / made-to-order products (options, lead time, production queue)
- Admin catalog ERP (products, categories, inventory)

**Workflow**

```
Browse category → Filter / search → Product detail
  → (If custom) options / notes → Cart → Checkout (COD / Razorpay)
  → Fulfil (stock or custom production) → Ship → Deliver → Review
```

**Status:** Core commerce live; category slug filters, search, and richer custom options in progress / planned.

---

### Pillar 2 — Personalized gifts (occasions & relationships)

**Goal:** Every celebration path leads to a personalised, one-of-one gift.

**Occasion & relationship map**

| Group | Examples |
|-------|----------|
| **Functions** | Wedding, engagement, reception, housewarming, baby shower, naming, retirement, farewell, graduation, office / school / college events |
| **Celebrations** | Birthday, anniversary, congratulations, promotion, achievement, new job, new business, success party |
| **Festivals** | Diwali, Pongal, Christmas, New Year, Eid, Ramzan, Holi, Raksha Bandhan, Valentine’s, Mother’s / Father’s / Teacher’s / Children’s Day |
| **Thank You** | Employee, customer, teacher, doctor, friend, boss, client, partner |
| **Relationships** | Father, mother, brother, sister, husband, wife, boyfriend, girlfriend, best friend, kids, grandparents, teacher, boss, employee, client, partner |

**Personalisation types**

| Type | Path (planned) |
|------|----------------|
| Custom name | `/personalized/name` |
| Photo gifts | `/personalized/photo` |
| Audio QR | `/personalized/audio-qr` |
| Video QR | `/personalized/video-qr` |
| Engraving | `/personalized/engraving` |
| Custom message | `/personalized/message` |
| Logo print | `/personalized/logo` |
| Gift box personalise | `/personalized/box` |
| Live preview studio | `/personalized/studio` |

**Workflow**

```
Pick Function / Celebration / Festival / Thank You / Relationship
  → Curated gifts → Personalise → Preview → Checkout
  → Production queue → QC → Ship → Deliver
```

**Status:** Personalized hub live; occasion hubs scaffolded; deep personalisation types & studio planned.

---

### Pillar 3 — Handmade (creators marketplace)

**Goal:** Become India’s **#1 handmade creativity initiative** — anyone working from home or as an artisan can upload unique handmade products and sell on UniqWorld.

**Includes**
- Maker registration & approval
- Product upload (photos, story, materials, price, stock)
- Handmade hub `/handmade`, sell flow `/handmade/sell`, maker stories `/handmade/makers`
- Earnings & withdrawals (marketplace fee model ~10%)
- Verified maker / handmade authentic trust badges

**Workflow**

```
Maker: Register → Verify → Upload unique product → Admin approve
  → Listed → Order → Ship → Earn → Withdraw

Buyer: Handmade hub → Maker / product → Buy → Receive unique craft
```

**Status:** Landing scaffolded; full sell / makers marketplace planned (build on store-partner patterns).

---

### Pillar 4 — Surprises (Local directory + Digital templates)

**Goal:** Own the surprise moment — (A) local celebration places & partners across India, (B) digital surprise templates people create and share.

#### 4A — Local Surprise Directory

- Pan-India directory of celebration venues and surprise partners
- City → place / partner list → profile → enquire / book
- Expand Chennai pilot → multi-city → pan-India

```
Surprise → Local → City → Places / partners → Profile → Book → Experience
```

#### 4B — Digital Surprises

- Paid shareable micro-sites (typically **₹49**, **~30-day expiry**)
- Template → customize → preview → Razorpay → share `/surprise/s/:slug`

```
Pick template → Customize → Preview → Pay ₹49 → Share link → Recipient opens
```

**Status:** Digital Surprise create/pay/share live; Local Surprise hub live (Chennai); booking & pan-India directory planned.

---

### Pillar 5 — In Store (local store owners)

**Goal:** Give local shop and business owners a UniqWorld **In Store** system — separate inventory, product management, sales & billing, and digital catalogue sharing — while selling on the platform.

**Includes**
- Store registration & admin approval (`/store/vendor`, `/store/partner`)
- Per-store inventory & product management
- Online sales on UniqWorld (~10% platform fee)
- Sales reports, earnings, withdrawals
- Digital sharing: store link, QR, WhatsApp catalogue (planned)
- Billing / invoice for counter sales (planned)
- Wholesale / dealer pricing (later)

**Workflow**

```
Register → Approve → Add inventory & products
  → Sell online and/or bill in shop → Share digital catalogue
  → Track sales → Withdraw
```

**Status:** Partner register, dashboard, products, sales, earnings, withdrawals live; billing & digital share planned.

---

## 5. Product surfaces (detail)

### 5.1 Consumer storefront

Live content & commerce: Home, About, Blog, FAQ, Contact, Cart, Checkout, Account, Login/Signup, Wishlist, Product details.

Also: Corporate hub (scaffold), Discover / extras (scaffold), Track order (scaffold).

### 5.2 Admin ERP

| Group | Modules |
|-------|---------|
| **Overview** | Dashboard |
| **Catalog** | Products, categories, purchases, suppliers, vendors, vendor services, inventory, fulfillment, stores, store products, store withdrawals |
| **ERP** | Orders, payments, shipping, customers, admin users |
| **Commerce** | Corporate enquiries, quotations, personalized orders, reviews, coupons |
| **Content** | Banners, media, blog, CMS, notifications |
| **Insights** | Reports, analytics |
| **System** | Settings, roles, audit logs |

---

## 6. Feature status

### Live / implemented

- Auth: register, login, logout, refresh, OTP verify, forgot/reset password, Google login ready  
- Public catalog: products, categories, reviews  
- Cart, wishlist, addresses, checkout  
- Orders: place, Razorpay verify, track, cancel, returns  
- COD + online; shipping ₹49; free shipping ≥ ₹999  
- Account notifications  
- Digital Surprise create → pay → share  
- Store partner portal + admin store ops  
- Admin ERP for catalog, inventory, commerce, CMS  
- Marketing pages: About, Blog, FAQ, Contact  
- PWA-capable web manifest  

### Scaffold (route / shell ready)

Corporate; Functions, Celebrations, Festivals, Thank You, Relationships hubs; Handmade landing; Store wholesale/bulk; Discover; Track order; Search; Category slug pages; Digital Surprise hub UI.

### Planned

Deep personalisation types & studio; corporate kits & quote UX; occasion leaf pages; gift box / hamper builders; handmade sell/makers; local surprise booking + pan-India directory; In Store billing & digital share; AI gift recommend/quiz; reminders, calendar, registry, subscriptions, gift cards, loyalty, refer & earn.

---

## 7. Key user flows (all pillars)

| # | Flow | Steps |
|---|------|--------|
| 1 | **Category purchase** | Signup → OTP → Browse category → Product → Cart → Checkout → Track |
| 2 | **Custom product** | Category/product → Custom options → Checkout → Custom production queue → Ship |
| 3 | **Personalized / occasion** | Occasion hub → Gift → Personalise → Preview → Checkout → Production → Ship |
| 4 | **Corporate** | Corporate hub → Enquiry → Quotation → Approve → Fulfil |
| 5 | **Handmade** | Maker upload → Approve → Buyer purchases → Maker fulfils → Withdraw |
| 6 | **Digital Surprise** | Template → Customize → Pay ₹49 → Share `/surprise/s/:slug` |
| 7 | **Local Surprise** | City directory → Partner → Book → Experience day |
| 8 | **In Store** | Store register → Inventory → Online sell / bill / share → Earnings → Withdraw |
| 9 | **Admin ops** | Admin OTP login → Dashboard → Catalog / Orders / Shipments / Partners → Payouts |

---

## 8. Information architecture (storefront)

Source of truth: `client/src/storefront/config/sitemap.js`

| Module | Path | Status | Pillar |
|--------|------|--------|--------|
| Home | `/` | live | — |
| Categories | `/categories` | live | 1 |
| Product | `/products/:id` | live | 1 |
| Personalized | `/personalized` | live | 2 |
| Functions | `/functions` | scaffold | 2 |
| Celebrations | `/celebrations` | scaffold | 2 |
| Festivals | `/festivals` | scaffold | 2 |
| Thank You | `/thank-you` | scaffold | 2 |
| Relationships | `/relationships` | scaffold | 2 |
| Corporate | `/corporate` | scaffold | 2 |
| Handmade | `/handmade` | scaffold | 3 |
| Sell Handmade | `/handmade/sell` | planned | 3 |
| Maker stories | `/handmade/makers` | planned | 3 |
| Surprise | `/surprise` | live | 4 |
| Local Surprise | `/surprise/local` | live | 4 |
| Digital Surprise hub | `/surprise/digital` | scaffold | 4 |
| Digital share page | `/surprise/s/:slug` | live | 4 |
| Store | `/store` | scaffold | 5 |
| Vendor register | `/store/vendor` | live | 5 |
| Partner portal | `/store/partner` | live | 5 |
| Cart / Checkout / Account | `/cart`, `/checkout`, `/account` | live | 1–5 |
| About / Blog / FAQ / Contact | content paths | live | — |

---

## 9. Business snapshot (Base case)

> Planning estimates only. Full tables → [UNIQWORLD_5_PILLARS_PROJECTIONS.md](./UNIQWORLD_5_PILLARS_PROJECTIONS.md)

### Portfolio

| Year | Combined GMV | Net revenue | Contribution profit |
|------|--------------|-------------|---------------------|
| **Y1** | ₹1.8 – 2.4 Cr | ₹45 – 70 L | ₹8 – 20 L |
| **Y2** | ₹6 – 9 Cr | ₹1.6 – 2.5 Cr | ₹40 – 80 L |
| **Y3** | ₹18 – 28 Cr | ₹4.5 – 7 Cr | ₹1.2 – 2.2 Cr |

### Per pillar (Base, summary)

| Pillar | Ready by | Y1 GMV | Y1 profit | Y3 GMV | Success vs Y1 Base |
|--------|----------|--------|-----------|--------|--------------------|
| 1 Category & custom | M4 | ₹90 L | ₹4–8 L | ₹8 Cr | 65–70% |
| 2 Personalized | M6 | ₹70 L | ₹2–6 L | ₹8 Cr | 60–65% |
| 3 Handmade | M5 | ₹45 L | −₹6 to −₹2 L | ₹7 Cr | 55–60% |
| 4 Surprises | M7 | ₹28 L | −₹5 to 0 | ₹5 Cr | ~60% |
| 5 In Store | M7 | ₹55 L | −₹8 to −₹3 L | ₹9 Cr | 55–60% |

### Commerce defaults

| Setting | Default |
|---------|---------|
| Currency | INR |
| Default shipping | ₹49 |
| Free shipping threshold | ₹999 |
| COD | Enabled |
| Store / marketplace platform fee | 10% |
| Digital Surprise | ₹49 · ~30-day live window |
| Own-inventory gross margin (typical) | ~25–35% |

---

## 10. Technical architecture

### 10.1 Repository layout

```
Uniquworld/
├── client/          # Storefront + Admin ERP (Vite SPA)
├── server/          # REST API + migrations / seeds
├── netlify.toml     # Client deploy (Netlify)
├── UNIQWORLD_PRODUCT_DOCUMENTATION.md
├── UNIQWORLD_5_PILLARS_PLAN.md
└── UNIQWORLD_5_PILLARS_PROJECTIONS.md
```

### 10.2 Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 8, React Router 7, TanStack Query/Table, Tailwind CSS 4, Framer Motion, Axios, React Hook Form + Zod |
| **Backend** | Node.js ≥18, Express 4, Zod, Helmet, CORS, rate limit, Winston, Swagger |
| **Database** | Supabase PostgreSQL (`pg` pool) |
| **Storage** | Supabase Storage (`uniquworld-assets`) + Sharp |
| **Auth** | JWT access + hashed refresh; OTP; Google OAuth ready |
| **Payments** | Razorpay (Uniquworld-branded checkout UI) |
| **Shipping** | Shiprocket (optional) |
| **Email** | Resend (preferred) / SMTP fallback |
| **Client host** | Netlify (`uniquworld.com`) |
| **API host** | Render (`uniquworld-server.onrender.com`) |

### 10.3 Backend layering

```
Client → Routes → Middleware → Controller → Service → Repository → PostgreSQL
                                              ↘ Email / Razorpay / Shiprocket / Storage
```

- Thin controllers; SQL only in repositories  
- Parameterized queries; transactions for multi-table writes  
- RBAC permissions middleware  
- Soft deletes where appropriate  

### 10.4 API overview

**Base:** `/api/v1` · **Swagger:** `/api/docs` · **Health:** `GET /api/v1/health`

| Mount | Purpose |
|-------|---------|
| `/auth` | Register, login, OTP, refresh, Google, me |
| `/account` | Profile, addresses, wishlist, cart, notifications, orders |
| `/catalog` | Public products, categories, reviews |
| `/store` | Public store products |
| `/store-partners` | Partner + admin store APIs |
| `/digital-surprises` | Occasions, create, checkout, verify, preview, slug |
| `/erp` | Admin auth, dashboard, module CRUD, commerce ops |

Admin access: `x-admin-key` **or** JWT with `admin` / `super_admin`.

### 10.5 Data model highlights

Migrations: `server/src/database/migrations/`

| Area | Examples |
|------|----------|
| **Identity** | users, roles, permissions, refresh_tokens, otps, admin_users |
| **Catalog** | categories, products / catalog_products, images, variants, inventory |
| **Commerce** | carts, wishlist, addresses, coupons, orders, payments, returns, shipments |
| **ERP** | suppliers, purchase_orders, vendors, fulfillment_tasks, stores, store_products |
| **Partners** | store_earnings, store_withdrawals, platform fee fields |
| **Surprise** | digital_surprises (slug, media JSONB, Razorpay ids, expiry) |
| **Content** | blogs, cms_pages, faqs, banners, notifications, audit_logs, settings |
| **B2B** | corporate_enquiries, quotations |

See `server/docs/ER_DIAGRAM.md`.

---

## 11. Integrations

| Integration | Role |
|-------------|------|
| **Supabase Postgres** | Primary database (use **pooler** port 6543 on Render) |
| **Supabase Storage** | Product / brand assets |
| **Razorpay** | Checkout & Digital Surprise payments |
| **Shiprocket** | Shipment creation / tracking (optional) |
| **Resend / SMTP** | OTP and transactional email |
| **Google OAuth** | Social login (API ready) |
| **Sharp** | Image processing before upload |

**Not used:** Stripe. **Planned:** AI gift finder / quiz.

---

## 12. Security

- Helmet, CORS allowlist, compression  
- Global + auth-specific rate limiting  
- XSS sanitisation + Zod validation  
- bcrypt password hashing  
- JWT access (short-lived) + refresh tokens hashed at rest  
- RBAC permission checks  
- Admin OTP login for ERP  

---

## 13. Local development & deployment

```bash
# API
cd server
cp .env.example .env   # DATABASE_URL, JWT, email, Razorpay, etc.
npm install && npm run migrate && npm run seed && npm run dev
# → http://localhost:5000/api/v1

# Client
cd client
npm install && npm run dev
# → http://localhost:5173
```

| App | Host |
|-----|------|
| Client SPA | Netlify (`netlify.toml`, Node 20, SPA redirects) |
| API | Render (Supabase pooler required) |

CORS: `uniquworld.com`, `www.uniquworld.com`, local Vite ports.

---

## 14. Roadmap (aligned to 5 pillars)

### Build waves

| Wave | Focus | Why |
|------|--------|-----|
| **Wave 1** | Pillar 1 + Pillar 2 hubs | Revenue from catalogue + occasion discovery |
| **Wave 2** | Pillar 4 Digital + Pillar 5 core | Differentiator + store GMV |
| **Wave 3** | Pillar 3 Handmade | Creator growth & #1 handmade initiative |
| **Wave 4** | Pillar 4 Local pan-India + Pillar 2 deep personalisation | Surprise network + studio |
| **Wave 5** | In Store billing + Handmade growth + AI discovery | Moat & retention |

### 18-month timeline

```
M1–M2   Pillar 1 core + Pillar 2 hubs + Digital Surprise expand
M3–M4   Pillar 1 custom ready | Handmade onboarding start
M5–M6   Pillar 3 marketplace ready | Pillar 2 personalise core ready
M7      Pillar 4 local book + Pillar 5 share/billing core ready
M8–M12  Festival scale, pan-city local, maker growth, store density
M13–M18 Profit focus: ads efficiency, fee mix, SaaS billing, corporate
```

### Near / mid / longer term themes

| Horizon | Themes |
|---------|--------|
| **Near-term** | Category filters & custom options; occasion hubs; personalisation core; Digital Surprise templates |
| **Mid-term** | Handmade marketplace; local surprise booking; In Store share & billing; corporate kits |
| **Longer-term** | Gift box / hamper builders; AI quiz/recommend; reminders, registry, subscriptions, loyalty |

---

## 15. Related internal docs

| Document | Path |
|----------|------|
| **5 Pillars Plan** | `UNIQWORLD_5_PILLARS_PLAN.md` |
| **5 Pillars Projections** | `UNIQWORLD_5_PILLARS_PROJECTIONS.md` |
| Server README | `server/README.md` |
| Backend architecture | `server/docs/ARCHITECTURE.md` |
| ER diagram | `server/docs/ER_DIAGRAM.md` |
| Storefront sitemap | `client/src/storefront/config/sitemap.js` |
| Storefront architecture | `client/src/storefront/config/architecture.js` |
| Admin navigation | `client/src/admin/config/navigation.js` |
| Env template | `server/.env.example` |

---

## 16. Summary

| # | Pillar | One sentence |
|---|--------|--------------|
| **1** | Category & custom | Sell every gift by category and support made-to-order custom products end-to-end. |
| **2** | Personalized | Map every function, celebration, festival, thank-you, and relationship to personalised gifts. |
| **3** | Handmade | Let anyone upload unique handmade creativity and sell on UniqWorld — India’s #1 handmade initiative. |
| **4** | Surprises | List celebration places & partners across India; let anyone create and share digital surprise templates. |
| **5** | In Store | Give local shop owners inventory, product, sales & billing tools and digital catalogue sharing on UniqWorld. |

**UniqWorld is a multi-surface gifting commerce platform for India** — category & custom sales, personalised occasions, handmade creators, local & digital surprises, and In Store digital tools for local shops — backed by Express + Supabase Postgres, Razorpay, Shiprocket, and Resend, with a Vite SPA on Netlify and API on Render.
