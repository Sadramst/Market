# 🗺️ Appilico Marketplace Ecosystem — Master Roadmap
> **Last Updated:** 31 May 2026 | **Status:** Phase 2 — Provider Growth Engine (in progress) · Beauty MVP **LIVE**

---

## 🔍 Current State Audit (Live — 31 May 2026)

The Beauty Marketplace is **live in production** at `beauty.appilico.com.au` with ~1,300+ real
Perth providers, 130+ suburbs, and 10 categories. The original roadmap below has been re-scored
against the **actual codebase and live site**. Items proven done are checked `[x]`.

### What's Live & Working
- ✅ Next.js 15 Turborepo monorepo (`beauty/`, `services/`, `admin/`) — beauty fully built
- ✅ .NET 8 modular monolith backend (Domain / Infrastructure / Application / Api) — 15 controllers
- ✅ PostgreSQL seeded: ~1,300 providers, 130+ suburbs, 10 categories, reviews
- ✅ JWT auth (login, signup, forgot/reset password), provider dashboard
- ✅ Docker + Nginx + Vercel deploy; SSL on all subdomains; live API at `api.appilico.com.au`
- ✅ Search (filters: category, suburb, sort, pagination) + suburb autocomplete
- ✅ Category / suburb / `[suburb]/[category]` SEO combo pages with dynamic metadata
- ✅ Provider profiles: gallery, reviews, services, contact, enquiry modal, claim flow
- ✅ Pricing page + Stripe checkout route (needs live keys), enquiries, contact form, blog
- ✅ SEO: dynamic sitemap, robots.ts, JSON-LD (LocalBusiness, BreadcrumbList, Organization)
- ✅ GTM + GA + Clarity; Google Search Console verified
- ✅ Test suites: Playwright e2e (beauty/services/admin/agent) + Vitest unit tests

### Known Gaps / In-Flight
- ⚠️ Admin app missing `NEXT_PUBLIC_API_URL` env var on Vercel (external dashboard fix)
- ⚠️ Stripe live keys not set (checkout returns 503 until configured)
- ⚠️ Some DB data-quality issues (miscategorised providers, duplicates) — SQL fixes staged
- ⚠️ Image upload to CDN, customer accounts (save/favourites), map view — not yet built
- ⚠️ Services (IT) & Admin marketplaces — scaffolded, not feature-complete

---

## 📊 MASTER STATUS TABLE

Legend: ✅ Done · 🟡 Partial · 🔴 Not started · 🌐 External (needs keys/infra/dashboard)

| Area | Feature | Status |
|------|---------|--------|
| **P1 Foundation** | API live, DB seeded, CORS, endpoints, Swagger | ✅ |
| P1 | All beauty pages render real data | ✅ |
| P1 | Self-serve `/join`, `/login`, dashboard | ✅ |
| P1 | SEO: sitemap, robots, schema, canonical, dynamic meta | ✅ |
| P1 | DevOps: env vars, SSL, health check, backups | 🟡 (admin env var 🌐) |
| **P2 Growth** | Provider onboarding wizard | 🟡 |
| P2 | Image upload to CDN | 🔴 🌐 |
| P2 | Reviews + moderation + aggregation | 🟡 |
| P2 | Provider dashboard (profile, gallery, analytics, enquiries) | 🟡 |
| P2 | Customer accounts | 🟡 |
| P2 | **Save / favourite providers** | ✅ *(this session)* |
| P2 | Map view of providers | 🔴 |
| P2 | Filters: rating / distance / price | 🟡 |
| P2 | "Near me" geolocation | ✅ |
| P2 | Related / nearby providers | ✅ |
| **P3 Monetisation** | Subscription tiers + Stripe billing | 🟡 🌐 |
| P3 | Featured placement, verified badge, priority ranking | 🟡 |
| P3 | Provider analytics & reporting | 🟡 |
| **P4 AI/Content** | AI SEO content, blog hub | 🟡 |
| P4 | AI matching / smart search / review summarisation | 🔴 |
| P4 | AI moderation (spam, image, fraud) | 🔴 |
| **P5 Ecosystem** | IT Services marketplace | 🟡 |
| P5 | Admin platform (approval, moderation, analytics) | 🟡 |
| P5 | New verticals / white-label | 🔴 |

> This table is the single source of truth for "what's done vs what remains". Update it as
> features land. Each new feature should ship with tests (Vitest unit + Playwright e2e) before
> being marked ✅.

---

## 🏗️ PHASE 1 — Fix the Foundation (CURRENT STEP)
> **Goal:** Make the Beauty Marketplace fully functional end-to-end with real data
> **Timeline:** 2–4 weeks
> **Agent Prompt:** See `STEP_1_AGENT_PROMPT.md` → give this to your agent NOW

### 1.1 Backend — API & Database Fix
- [x] Confirm API is live and accessible at `api.appilico.com.au`
- [x] Seed all 9 Beauty categories with icons, descriptions, slugs (10 categories live)
- [x] Seed 150+ Perth suburbs with coordinates and metadata (130+ live)
- [x] Create sample/demo providers — exceeded: ~1,300 real providers
- [x] Seed sample reviews for demo providers
- [x] Fix CORS to allow Vercel frontend domains
- [x] Confirm all documented endpoints return real data
- [x] Add `/api/categories/beauty` with full category objects
- [x] Add `/api/locations/suburbs?platform=beauty` endpoint
- [x] Add `/api/providers?category=&suburb=&sort=&page=` with pagination
- [x] Add `/api/providers/featured` endpoint for homepage
- [x] Ensure Swagger is accessible for testing

### 1.2 Frontend Beauty App — Page Fixes
- [x] `/categories` → Connect to API, render all beauty categories with icons & counts
- [x] `/category/[slug]` → Dynamic category page pulling providers from API
- [x] `/suburbs` → Connect to API, render all Perth suburbs in alphabetical grid
- [x] `/[suburb]` → Dynamic suburb page (e.g., /subiaco) with local providers
- [x] `/[suburb]/[category]` → Combo pages (e.g., /joondalup/nail-salon) for SEO
- [x] `/search` → Fully working search with filters (category, suburb, sort)
- [x] `/provider/[slug]` → Full provider profile page (gallery, reviews, contact)
- [x] `/join` → Self-contained registration form (not redirect to admin)
- [x] `/login` → Provider login with JWT, redirects to provider dashboard
- [x] Provider dashboard → Basic profile management after login

### 1.3 Frontend — UI/UX Polish
- [x] Homepage featured providers section pulls from `/api/providers/search?sortBy=rating`
- [x] Category cards on homepage show real provider counts
- [x] Search autocomplete for suburbs and services
- [x] Mobile navigation fully working
- [ ] Newsletter subscribe form connected to email service 🌐
- [x] About, Contact, Privacy, Terms pages have real content

### 1.4 SEO Infrastructure
- [x] Sitemap.xml dynamically generated (includes all suburb/category combos)
- [x] robots.txt properly configured
- [x] Schema.org LocalBusiness structured data on provider pages
- [x] Schema.org BreadcrumbList on category/suburb pages
- [x] Dynamic metadata on all dynamic pages (`/[suburb]`, `/category/[slug]`, `/provider/[slug]`)
- [x] Canonical URLs pointing to beauty.appilico.com.au (not vercel.app)

### 1.5 DevOps
- [x] `.env.production` properly configured on Vercel (beauty)
- [x] `NEXT_PUBLIC_API_URL` pointing to `https://api.appilico.com.au` (beauty/services)
- [x] `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID` added to Vercel
- [x] Backend health check endpoint returning 200
- [x] SSL certificates valid on all subdomains
- [ ] Database backups configured (verify schedule)

---

## 🚀 PHASE 2 — Provider Growth Engine
> **Goal:** Onboard real providers, build trust signals, activate SEO
> **Timeline:** 4–8 weeks after Phase 1
> **→ Come back to Claude for the Phase 2 Agent Prompt**

### 2.1 Provider Self-Serve Onboarding
- [ ] Multi-step provider registration wizard (business info → services → gallery → suburb)
- [ ] Image upload to CDN (Cloudflare R2 or AWS S3)
- [ ] Provider profile preview before publishing
- [ ] Email verification flow
- [ ] Admin approval queue in admin platform
- [ ] Welcome email sequence for new providers

### 2.2 Review & Trust System
- [ ] Customer review submission (name, rating, text, date)
- [ ] Review moderation in admin panel
- [ ] Star ratings aggregated on provider cards and profiles
- [ ] "Verified review" badge system
- [ ] Provider response to reviews

### 2.3 Provider Dashboard (Full)
- [ ] Profile editor (bio, services, hours, social links)
- [ ] Gallery manager (upload, reorder, delete photos)
- [ ] Analytics dashboard (profile views, search appearances, clicks)
- [ ] Review management
- [ ] Contact/enquiry inbox
- [ ] Suburb + category management

### 2.4 Customer Features
- [ ] Customer account registration & login
- [x] Save/favourite providers ✅ *(shipped this session — localStorage-based, no login required)*
- [ ] Leave reviews (auth required)
- [ ] Search history and preferences
- [x] Email enquiry to provider from platform (EnquiryModal)

### 2.5 Advanced Search & Discovery
- [ ] Map view of providers (Google Maps / Mapbox integration)
- [ ] Filter by rating, distance, price range, availability
- [x] "Near me" geolocation search (useSuburbPreference + detect location)
- [x] Related providers section on provider pages
- [x] "You might also like" recommendations (nearby/related)

---

## 💰 PHASE 3 — Monetisation Activation
> **Goal:** First revenue. Convert free providers to paying customers.
> **Timeline:** 8–16 weeks
> **→ Come back to Claude for the Phase 3 Agent Prompt**

### 3.1 Subscription Tiers
- [ ] Define Free / Starter / Professional / Business tiers
- [ ] Stripe integration for recurring billing
- [ ] Plan upgrade/downgrade flows
- [ ] Billing portal (Stripe Customer Portal)
- [ ] Invoice generation

### 3.2 Premium Listing Features
- [ ] Featured provider placement (homepage + category pages)
- [ ] "Verified" badge (paid tier)
- [ ] Priority search ranking
- [ ] Enhanced gallery (more photos)
- [ ] External booking link / website link
- [ ] Promoted suburb placements

### 3.3 Analytics & Reporting (Provider)
- [ ] Detailed analytics: views, clicks, enquiry rate, conversion
- [ ] Weekly email report to providers
- [ ] Competitor benchmarking (anonymous)
- [ ] SEO keyword tracking for their suburb

---

## 🤖 PHASE 4 — AI & Content Engine
> **Goal:** SEO domination, AI-powered personalization, content at scale
> **Timeline:** 16–28 weeks
> **→ Come back to Claude for the Phase 4 Agent Prompt**

### 4.1 AI SEO Content Generation
- [ ] Auto-generate suburb + category landing page content
- [ ] AI-written provider profile summaries (from their input data)
- [ ] Blog/content hub with AI-assisted beauty articles
- [ ] FAQ generation per suburb/category page
- [ ] Local area beauty trend content

### 4.2 AI Discovery & Matching
- [ ] AI provider recommendation engine (based on customer preferences)
- [ ] "Best match" scoring system
- [ ] Smart search (natural language: "gel nails near Subiaco under $60")
- [ ] AI-powered review summarisation on provider profiles

### 4.3 AI Moderation
- [ ] Automated review spam detection
- [ ] Image moderation for provider galleries
- [ ] Fraud detection for fake providers

---

## 🌐 PHASE 5 — Ecosystem Expansion
> **Goal:** Launch IT Services Marketplace + Admin Platform fully + new verticals
> **Timeline:** 6+ months
> **→ Come back to Claude for the Phase 5 Agent Prompt**

### 5.1 IT Services Marketplace (service.appilico.com.au)
- [ ] Full audit of current state
- [ ] Job posting / service request system
- [ ] Provider quoting system
- [ ] Milestone-based project management
- [ ] Technical skills verification badges
- [ ] Escrow payment system

### 5.2 Admin Platform (admin.appilico.com.au)
- [ ] Full provider approval workflow
- [ ] Content moderation queue
- [ ] Review moderation tools
- [ ] Analytics dashboard (platform-wide)
- [ ] User management (ban, verify, escalate)
- [ ] SEO management (meta overrides, sitemap control)
- [ ] Financial reporting dashboard

### 5.3 New Vertical Marketplaces
- [ ] Home Services Marketplace
- [ ] Healthcare / Allied Health
- [ ] Fitness & Personal Training
- [ ] Pet Services
- [ ] Cleaning Services
- [ ] Automotive Services

### 5.4 White-Label & Franchise
- [ ] Multi-tenant architecture
- [ ] White-label marketplace product
- [ ] Franchise management system
- [ ] Custom domain support per tenant

---

## 📊 Key Metrics to Track Per Phase

| Phase | KPI | Target |
|-------|-----|--------|
| 1 | Pages returning real data | 100% |
| 1 | Provider profiles live | 20+ demo |
| 2 | Real providers onboarded | 100+ |
| 2 | Monthly organic sessions | 1,000+ |
| 3 | Paying providers (MRR) | $2,000+ |
| 4 | Organic sessions/month | 10,000+ |
| 5 | Active marketplaces | 3+ |

---

## 🗂️ File Structure Reference (Current Repo)

```
Market/
├── backend/
│   └── src/
│       ├── Appilico.Market.Domain/        ← Entities
│       ├── Appilico.Market.Infrastructure/ ← EF Core, DB
│       ├── Appilico.Market.Application/    ← DTOs, business logic
│       └── Appilico.Market.Api/            ← Controllers, middleware
├── frontend/
│   └── apps/
│       ├── beauty/    ← PRIORITY — Fix Phase 1
│       ├── services/  ← Phase 5
│       └── admin/     ← Phase 5
│   └── packages/
│       ├── shared/    ← API client, types
│       └── ui/        ← Shared components
├── nginx/
├── scripts/
└── docs/
```

---

## ✅ How to Use This Roadmap

1. **Right now:** Hand `STEP_1_AGENT_PROMPT.md` to your coding agent
2. **After Phase 1 complete:** Return to Claude → say "Generate Phase 2 prompt"
3. **After Phase 2 complete:** Return to Claude → say "Generate Phase 3 prompt"
4. Continue sequentially — each phase builds on the last

> Each phase prompt will be deeply tailored to the current state of your repo at that point in time.

---

*Roadmap v2.0 — re-audited against live codebase & production site, 31 May 2026. Beauty MVP is LIVE; focus has shifted from Phase 1 (complete) to Phase 2 growth features. Keep the Master Status Table above current as features ship.*
