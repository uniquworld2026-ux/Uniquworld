# UniqWorld — 5 Pillars: Workflow, Revenue, Profit, Reach, Timeline, Cost & Success Rate

**Related:** [UNIQWORLD_5_PILLARS_PLAN.md](./UNIQWORLD_5_PILLARS_PLAN.md) · [UNIQWORLD_PRODUCT_DOCUMENTATION.md](./UNIQWORLD_PRODUCT_DOCUMENTATION.md)  
**Type:** Business & delivery projections (planning estimates)  
**Currency:** INR  
**Last updated:** August 2026  

---

## How to read this document

| Term | Meaning |
|------|---------|
| **GMV** | Gross Merchandise Value — total customer spend on the pillar |
| **Net revenue** | What UniqWorld keeps (product margin and/or platform fee / take rate) |
| **Profit** | Net revenue − direct costs (COGS, fees, logistics share, partner payouts) − allocated pillar opex |
| **Reach** | Cities, users, makers, stores, or partners touched |
| **Success rate** | Planning probability of hitting **Base** targets if Wave delivery + marketing execute as planned |
| **Timeline** | From “start build” to “production-ready” then scale |

### Shared planning assumptions (Base case)

| Assumption | Value |
|------------|--------|
| India gifting market context | ~₹61,000–65,000 Cr (2026); personalised segment high growth |
| Payment | Razorpay + COD; gateway ~2% |
| Platform fee (marketplace / store / handmade) | ~10% on platform sales |
| Own-inventory gift margin (category / personalised) | ~25–35% gross after COGS |
| Digital Surprise price | ₹49 (high volume, high margin) |
| Marketing | Progressive; festival peaks (Diwali, Valentine’s, Rakhi) drive 30–40% of year |
| Scenario band | **Conservative / Base / Optimistic** |

> These are **planning forecasts**, not guarantees. Revisit after 90 days of live metrics.

### Portfolio snapshot (Base case, combined)

| Year | Combined GMV | UniqWorld net revenue | Est. contribution profit* |
|------|--------------|------------------------|---------------------------|
| **Y1** | ₹1.8 – 2.4 Cr | ₹45 – 70 L | ₹8 – 20 L |
| **Y2** | ₹6 – 9 Cr | ₹1.6 – 2.5 Cr | ₹40 – 80 L |
| **Y3** | ₹18 – 28 Cr | ₹4.5 – 7 Cr | ₹1.2 – 2.2 Cr |

\*Before heavy brand ads and central HQ overhead; pillar contribution only.

### Shared build budget (platform core — once)

| Item | Est. cost |
|------|-----------|
| Shared auth, cart, checkout, admin ERP hardening | ₹8 – 12 L |
| Infra (Render, Supabase, storage, email) Y1 | ₹1.5 – 3 L |
| Contingency | ₹2 L |

*(Pillar-specific build costs below are **incremental** on top of shared core.)*

---

# Pillar 1 — Category-wise products & custom product sales

## 1. Workflow

```
Customer
  Discover category → Filter / search → Product detail
  → (If custom) select options / upload notes → Add to cart
  → Checkout (COD / Razorpay) → Order confirmed
  → Warehouse / custom production → Ship (Shiprocket) → Deliver
  → Review / return if needed

Admin / ops
  Create categories & products → Set stock / custom flags
  → Receive order → Fulfil (pick or make) → Dispatch → Close
```

## 2. Timeline

| Milestone | Month |
|-----------|-------|
| Category pages + filters + search live | M1–M2 |
| Custom product options + admin queue | M2–M3 |
| Merchandising (bestsellers, deals) | M3–M4 |
| **Production-ready** | **M4** |
| Scale / SEO / festival catalogue | M5–M12 |

## 3. Cost (incremental)

| Item | Est. |
|------|------|
| Build (UI + API polish, custom options) | ₹4 – 6 L |
| Inventory seed / samples | ₹3 – 8 L |
| Packaging & first-mile ops setup | ₹1 – 2 L |
| Paid ads / SEO Y1 (allocated) | ₹4 – 8 L |
| **Y1 pillar cost total** | **₹12 – 24 L** |

## 4. Predicted revenue (GMV & net)

| Scenario | Y1 GMV | Y2 GMV | Y3 GMV | Y1 net rev* | Y3 net rev* |
|----------|--------|--------|--------|-------------|-------------|
| Conservative | ₹60 L | ₹2.0 Cr | ₹5 Cr | ₹15 L | ₹1.3 Cr |
| **Base** | **₹90 L** | **₹3.2 Cr** | **₹8 Cr** | **₹23 L** | **₹2.2 Cr** |
| Optimistic | ₹1.4 Cr | ₹5 Cr | ₹12 Cr | ₹35 L | ₹3.4 Cr |

\*Own inventory ~28% blend margin on GMV; custom lines slightly higher.

## 5. Profit (contribution)

| Scenario | Y1 | Y2 | Y3 |
|----------|----|----|-----|
| Conservative | −₹2 L to +₹3 L | ₹18 L | ₹55 L |
| **Base** | **₹4 – 8 L** | **₹35 L** | **₹90 L** |
| Optimistic | ₹12 L | ₹60 L | ₹1.5 Cr |

*Y1 tight because inventory + ads; profitable from late Y1 if festival conversion holds.*

## 6. Reach

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| Cities served (delivery) | 80–120 | 150–200 | 250+ |
| Active SKUs | 300–600 | 1,000+ | 2,500+ |
| Monthly buyers (avg) | 400–700 | 1,500–2,500 | 4,000–7,000 |
| Categories live | 15–25 | 40+ | 60+ |

## 7. Success rate

| Funnel / outcome | Target rate |
|------------------|-------------|
| Visit → product view | 45–55% |
| Product → add to cart | 8–12% |
| Cart → paid order | 35–45% |
| Custom order completion (no cancel) | 85–90% |
| **Hit Base Y1 GMV** | **~65–70%** probability with dedicated merchandising + Diwali push |

---

# Pillar 2 — Personalized gifts (occasions & relationships)

## 1. Workflow

```
Customer
  Pick path: Function / Celebration / Festival / Thank You / Relationship
  → Browse curated gifts → Choose personalisation type
    (name / photo / message / engraving / QR / logo)
  → Upload / enter details → Live preview (when ready)
  → Checkout → Production studio queue → QC → Ship → Deliver

Corporate
  Enquiry → Quotation → Approve → Bulk personalise → Deliver
```

## 2. Timeline

| Milestone | Month |
|-----------|-------|
| All 5 hub pages + tagging | M1–M2 |
| Name / photo / message personalisation | M2–M4 |
| Engraving + QR audio/video | M4–M6 |
| Live preview studio | M6–M8 |
| **Production-ready (core)** | **M6** |
| Full studio + corporate bulk | M8–M12 |

## 3. Cost (incremental)

| Item | Est. |
|------|------|
| Build (hubs, personalise UI, admin queue, studio) | ₹8 – 14 L |
| Production tools / sample engraver / print partners | ₹2 – 5 L |
| Creative assets (occasion photography) | ₹2 – 4 L |
| Marketing (occasion campaigns) Y1 | ₹5 – 10 L |
| **Y1 pillar cost total** | **₹17 – 33 L** |

## 4. Predicted revenue

| Scenario | Y1 GMV | Y2 GMV | Y3 GMV | Y1 net rev | Y3 net rev |
|----------|--------|--------|--------|------------|------------|
| Conservative | ₹40 L | ₹1.8 Cr | ₹5 Cr | ₹12 L | ₹1.6 Cr |
| **Base** | **₹70 L** | **₹2.8 Cr** | **₹8 Cr** | **₹22 L** | **₹2.6 Cr** |
| Optimistic | ₹1.2 Cr | ₹4.5 Cr | ₹14 Cr | ₹38 L | ₹4.5 Cr |

*Higher AOV than plain catalogue (₹1,200–2,500 typical personalised order).*

## 5. Profit (contribution)

| Scenario | Y1 | Y2 | Y3 |
|----------|----|----|-----|
| Conservative | −₹5 L to 0 | ₹22 L | ₹70 L |
| **Base** | **₹2 – 6 L** | **₹45 L** | **₹1.1 Cr** |
| Optimistic | ₹10 L | ₹80 L | ₹2 Cr |

*Gross margin often 30–40% after personalisation labour; studio investment front-loaded.*

## 6. Reach

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| Occasion leaf pages live | 20–30 | 50+ | 70+ (full IA) |
| Personalised orders / month (avg) | 150–300 | 800–1,500 | 2,500–4,000 |
| Corporate accounts | 10–25 | 60–100 | 200+ |
| Relationship / festival campaigns / year | 8–12 | 15+ | 20+ |

## 7. Success rate

| Funnel / outcome | Target rate |
|------------------|-------------|
| Hub → product | 40–50% |
| Start personalise → complete design | 55–65% |
| Design → paid | 40–50% |
| Production defect / remake | &lt;5% |
| **Hit Base Y1 GMV** | **~60–65%** (depends on studio UX + festival timing) |

---

# Pillar 3 — Handmade (creators marketplace)

## 1. Workflow

```
Maker (work-from-home / artisan)
  Register → Verify → Upload unique handmade product + story
  → Admin review → Approved → Listed on UniqWorld Handmade
  → Order received → Pack & ship (or UniqWorld logistics assist)
  → Earn → Withdraw

Buyer
  Handmade hub → Filter craft / city → Maker story → Buy → Receive unique piece
```

## 2. Timeline

| Milestone | Month |
|-----------|-------|
| Sell Handmade landing + onboarding | M1–M2 |
| Upload + approval + catalogue | M2–M4 |
| Maker profiles & stories | M4–M5 |
| **Marketplace production-ready** | **M5** |
| City hubs + “#1 handmade initiative” campaign | M6–M12 |

## 3. Cost (incremental)

| Item | Est. |
|------|------|
| Build (reuse store-partner patterns + handmade UX) | ₹5 – 9 L |
| Maker acquisition & onboarding events | ₹2 – 5 L |
| Moderation / QC staff (part-time Y1) | ₹3 – 6 L |
| Marketing (creator + buyer) Y1 | ₹3 – 7 L |
| **Y1 pillar cost total** | **₹13 – 27 L** |

## 4. Predicted revenue

*UniqWorld take rate ~10% of GMV (platform fee). Maker keeps product amount.*

| Scenario | Y1 GMV | Y2 GMV | Y3 GMV | Y1 net rev (fee) | Y3 net rev |
|----------|--------|--------|--------|------------------|------------|
| Conservative | ₹25 L | ₹1.2 Cr | ₹4 Cr | ₹2.5 L | ₹40 L |
| **Base** | **₹45 L** | **₹2.2 Cr** | **₹7 Cr** | **₹4.5 L** | **₹70 L** |
| Optimistic | ₹80 L | ₹4 Cr | ₹12 Cr | ₹8 L | ₹1.2 Cr |

## 5. Profit (contribution)

| Scenario | Y1 | Y2 | Y3 |
|----------|----|----|-----|
| Conservative | −₹8 L | ₹5 L | ₹18 L |
| **Base** | **−₹6 to −₹2 L** | **₹12 L** | **₹35 L** |
| Optimistic | ₹0 – 3 L | ₹30 L | ₹70 L |

*Y1 investment phase (maker growth). Profit scales with GMV × fee − moderation cost.*

## 6. Reach

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| Active makers | 80–150 | 400–700 | 1,500–2,500 |
| Live handmade SKUs | 200–400 | 1,500+ | 5,000+ |
| Cities with makers | 15–25 | 50+ | 100+ |
| Buyers of handmade / year | 1,500–3,000 | 10,000+ | 35,000+ |

## 7. Success rate

| Funnel / outcome | Target rate |
|------------------|-------------|
| Maker signup → complete listing | 40–50% |
| Listing → admin approve | 70–80% |
| Buyer visit → handmade purchase | 2–4% |
| Maker still active after 90 days | 55–65% |
| **Hit Base Y1 GMV** | **~55–60%** (creator supply is the bottleneck) |

---

# Pillar 4 — Surprises (Local directory + Digital templates)

## 1. Workflow

### 4A Local Surprise

```
Customer
  Surprise → Local → Select city → Browse places / partners
  → Partner profile → Enquire / Book → Pay deposit → Experience day → Review

Partner
  Apply → Onboard → List place / services → Receive leads / bookings → Fulfil
```

### 4B Digital Surprise

```
Customer
  Pick template → Customize (photos, music, message) → Preview
  → Pay ₹49 → Get share link → Recipient opens /surprise/s/:slug
```

## 2. Timeline

| Milestone | Month |
|-----------|-------|
| Digital templates expand + polish | M1–M2 |
| Local directory (Chennai → 5 cities) | M2–M5 |
| Book / pay local experiences | M5–M7 |
| **Both tracks production-ready** | **M7** |
| Pan-India partners (50+ cities) | M8–M18 |

## 3. Cost (incremental)

| Item | Est. |
|------|------|
| Digital template studio / themes | ₹3 – 5 L |
| Local directory + booking build | ₹6 – 10 L |
| Partner acquisition (cities) | ₹3 – 8 L |
| Marketing (viral digital + local SEO) Y1 | ₹3 – 6 L |
| **Y1 pillar cost total** | **₹15 – 29 L** |

## 4. Predicted revenue

| Stream | Y1 (Base) | Y2 (Base) | Y3 (Base) |
|--------|-----------|-----------|-----------|
| Digital Surprise GMV | ₹8 L (~16k paid) | ₹35 L | ₹1.0 Cr |
| Digital net (≈85% after gateway) | ₹6.5 L | ₹28 L | ₹80 L |
| Local booking GMV | ₹20 L | ₹1.2 Cr | ₹4 Cr |
| Local net (15–20% commission) | ₹3 – 4 L | ₹20 L | ₹70 L |
| **Pillar GMV total** | **₹28 L** | **₹1.55 Cr** | **₹5 Cr** |
| **Pillar net revenue** | **₹10 L** | **₹48 L** | **₹1.5 Cr** |

| Scenario | Y1 GMV | Y3 GMV | Y1 net | Y3 net |
|----------|--------|--------|--------|--------|
| Conservative | ₹15 L | ₹2.5 Cr | ₹5 L | ₹70 L |
| **Base** | **₹28 L** | **₹5 Cr** | **₹10 L** | **₹1.5 Cr** |
| Optimistic | ₹50 L | ₹9 Cr | ₹18 L | ₹2.8 Cr |

## 5. Profit (contribution)

| Scenario | Y1 | Y2 | Y3 |
|----------|----|----|-----|
| Conservative | −₹8 L | ₹8 L | ₹30 L |
| **Base** | **−₹5 to 0** | **₹15 L** | **₹55 L** |
| Optimistic | ₹4 L | ₹35 L | ₹1.1 Cr |

*Digital is high-margin fuel; Local is scale & brand lock-in.*

## 6. Reach

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| Digital surprises created (paid) | 10k–20k | 50k–80k | 1.5L–2.5L |
| Digital open / view rate | 70–85% | 75–90% | 80%+ |
| Cities in local directory | 5–10 | 30–40 | 80–120 |
| Surprise partners listed | 40–80 | 300–500 | 1,500+ |
| Celebration places listed | 80–150 | 800+ | 3,000+ |

## 7. Success rate

| Funnel / outcome | Target rate |
|------------------|-------------|
| Digital start → pay ₹49 | 25–35% |
| Paid link → recipient opens | 75–85% |
| Local profile → enquiry | 8–12% |
| Enquiry → confirmed booking | 25–35% |
| **Hit Base Y1 GMV** | **~70%** digital + **~50%** local (combined ~**60%**) |

---

# Pillar 5 — In Store (local store owners digital sales)

## 1. Workflow

```
Store / shop owner
  Register business → UniqWorld approve → Setup store profile
  → Add products & separate inventory → Set prices
  → Sell:
      A) Online on UniqWorld marketplace
      B) Counter billing / invoice (shop POS-lite)
      C) Share digital catalogue (link / QR / WhatsApp)
  → Orders & bills sync → Reports → Earnings → Withdraw

Customer
  Store page / shared link → Product → Buy online or visit shop
```

## 2. Timeline

| Milestone | Month |
|-----------|-------|
| Partner portal harden (stock, sales, earnings) | M1–M2 |
| Public store page + QR / WhatsApp share | M2–M4 |
| Billing / invoice module | M4–M7 |
| **Core In Store production-ready** | **M7** |
| Wholesale / multi-branch | M10–M14 |

## 3. Cost (incremental)

| Item | Est. |
|------|------|
| Build (portal, share, billing) | ₹8 – 14 L |
| Store sales team / onboarding Y1 | ₹4 – 8 L |
| Training materials / support | ₹1 – 2 L |
| Marketing to shop owners Y1 | ₹2 – 5 L |
| **Y1 pillar cost total** | **₹15 – 29 L** |

## 4. Predicted revenue

*Online marketplace: ~10% platform fee on GMV. Billing SaaS (later): ₹299–999/month per store optional.*

| Scenario | Y1 GMV (online) | Y2 GMV | Y3 GMV | Y1 net (fees + SaaS) | Y3 net |
|----------|-----------------|--------|--------|----------------------|--------|
| Conservative | ₹30 L | ₹1.5 Cr | ₹5 Cr | ₹3 L | ₹55 L |
| **Base** | **₹55 L** | **₹2.5 Cr** | **₹9 Cr** | **₹6 L** | **₹1.0 Cr** |
| Optimistic | ₹1 Cr | ₹5 Cr | ₹18 Cr | ₹12 L | ₹2.2 Cr |

## 5. Profit (contribution)

| Scenario | Y1 | Y2 | Y3 |
|----------|----|----|-----|
| Conservative | −₹10 L | ₹5 L | ₹25 L |
| **Base** | **−₹8 to −₹3 L** | **₹15 L** | **₹45 L** |
| Optimistic | ₹0 – 4 L | ₹40 L | ₹1 Cr |

*Y1 = land stores. Profit follows density of active billing + online GMV.*

## 6. Reach

| Metric | Y1 | Y2 | Y3 |
|--------|----|----|-----|
| Approved stores | 40–80 | 250–400 | 1,000–1,500 |
| Active selling stores (monthly) | 25–50 | 150–250 | 600–900 |
| Store SKUs on platform | 500–1,200 | 8,000+ | 40,000+ |
| Cities with stores | 8–15 | 40+ | 100+ |
| Digital catalogue shares / month | 2k–5k | 20k+ | 80k+ |

## 7. Success rate

| Funnel / outcome | Target rate |
|------------------|-------------|
| Store signup → approved | 60–70% |
| Approved → first product live | 70–80% |
| Live store → first online order (30 days) | 40–50% |
| Adopt billing module (when launched) | 30–40% |
| Still active after 90 days | 55–65% |
| **Hit Base Y1 GMV** | **~55–60%** (sales team dependent) |

---

# Side-by-side comparison (Base case)

| Pillar | Ready by | Y1 cost | Y1 GMV | Y1 net rev | Y1 profit | Y3 GMV | Y3 profit | Reach (Y3) | Success vs Base Y1 |
|--------|----------|---------|--------|------------|-----------|--------|-----------|------------|--------------------|
| **1 Category & custom** | M4 | ₹12–24 L | ₹90 L | ₹23 L | ₹4–8 L | ₹8 Cr | ₹90 L | 250+ cities, 2.5k SKUs | **65–70%** |
| **2 Personalized** | M6 | ₹17–33 L | ₹70 L | ₹22 L | ₹2–6 L | ₹8 Cr | ₹1.1 Cr | 70+ occasion pages | **60–65%** |
| **3 Handmade** | M5 | ₹13–27 L | ₹45 L | ₹4.5 L | −₹6 to −₹2 L | ₹7 Cr | ₹35 L | 1.5k–2.5k makers | **55–60%** |
| **4 Surprises** | M7 | ₹15–29 L | ₹28 L | ₹10 L | −₹5 to 0 | ₹5 Cr | ₹55 L | 80–120 cities, 1.5k+ partners | **~60%** |
| **5 In Store** | M7 | ₹15–29 L | ₹55 L | ₹6 L | −₹8 to −₹3 L | ₹9 Cr | ₹45 L | 1k–1.5k stores | **55–60%** |

### What to fund first (ROI logic)

| Priority | Pillar | Why |
|----------|--------|-----|
| 1 | Category & custom | Fastest path to positive contribution |
| 2 | Personalized | High AOV + brand differentiation |
| 3 | Digital Surprise (within #4) | Low cost, viral reach, cash margin |
| 4 | In Store core | Network effects; Y2–Y3 scale |
| 5 | Handmade + Local Surprise | Moat & mission; invest through Y1 loss |

---

# 18-month master timeline (all pillars)

```
M1–M2   Pillar 1 core + Pillar 2 hubs + Digital Surprise expand
M3–M4   Pillar 1 custom + Pillar 1 ready | Handmade onboarding start
M5–M6   Pillar 3 marketplace ready | Pillar 2 personalise core ready
M7      Pillar 4 local book + Pillar 5 share/billing core ready
M8–M12  Festival scale, pan-city local, maker growth, store density
M13–M18 Profit focus: ads efficiency, fee mix, SaaS billing, corporate
```

---

# Risk → success rate impact

| Risk | Pillars hit | If unmanaged | Mitigation |
|------|-------------|--------------|------------|
| Weak festival inventory | 1, 2 | −15–25% GMV | Pre-buy 60 days before Diwali |
| Maker / store supply thin | 3, 5 | Miss Base | City onboarding squads |
| Personalisation SLA slips | 2 | Cancellations ↑ | Partner production network |
| Local partner quality | 4A | Reviews ↓ | Vetting + deposits |
| Ad CAC spike | All | Profit → negative | SEO + WhatsApp + referral |

---

# One-page verdict

| # | Pillar | Workflow in one line | Money story |
|---|--------|----------------------|-------------|
| **1** | Category & custom | Browse → buy / customise → ship | **Best Y1 profit**; foundation GMV |
| **2** | Personalized | Occasion → personalise → produce → ship | **Best Y3 margin** on own goods |
| **3** | Handmade | Upload craft → sell → earn | Fee model; **invest Y1**, scale Y3 |
| **4** | Surprises | Book local **or** pay ₹49 digital share | Digital = cash; Local = reach moat |
| **5** | In Store | List → inventory → bill / share → sell | Network play; **big Y3 GMV** |

**Combined Base target:** Y1 GMV ~₹2 Cr · Y3 GMV ~₹20–25 Cr · Pillar contribution profit Y3 ~₹1.5–2+ Cr — if Waves 1–5 execute and festival peaks convert.
