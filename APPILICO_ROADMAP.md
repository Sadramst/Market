# 🗺️ Appilico Marketplace Ecosystem — Master Roadmap
> **Last Updated:** May 2026 | **Status:** Phase 1 — Foundation Fix & Data Layer

---

## 🔍 Current State Audit (Pre-Roadmap)

### What's Built
- ✅ Next.js 15 Turborepo monorepo (`beauty/`, `services/`, `admin/`)
- ✅ .NET 8 modular monolith backend (domain, infrastructure, application, API layers)
- ✅ PostgreSQL database schema
- ✅ JWT authentication system
- ✅ Docker + Nginx + Vercel deployment infrastructure
- ✅ Beautiful homepage UI (beauty.appilico.com.au)
- ✅ SEO metadata & Open Graph on key pages
- ✅ Basic API endpoints documented (auth, providers, categories, suburbs, reviews)

### What's Broken / Missing
- ❌ `/categories` page → returns empty ("No categories available") — API not seeded
- ❌ `/suburbs` page → returns empty ("No suburbs available") — API not seeded
- ❌ `/search` page → returns empty ("No providers found") — no data
- ❌ `/category/[slug]` → "Category Not Found" — API not connected or not seeded
- ❌ Provider registration flow broken (redirects to admin, no self-serve signup)
- ❌ `/login` page (provider auth) — status unknown
- ❌ Services marketplace (service.appilico.com.au) — unknown state
- ❌ Admin platform (admin.appilico.com.au) — not public
- ❌ Database has NO seed data (categories, suburbs, providers)
- ❌ Backend API either not live or not connected to frontend env vars
- ❌ No real providers listed anywhere

---

## 🏗️ PHASE 1 — Fix the Foundation (CURRENT STEP)
> **Goal:** Make the Beauty Marketplace fully functional end-to-end with real data
> **Timeline:** 2–4 weeks
> **Agent Prompt:** See `STEP_1_AGENT_PROMPT.md` → give this to your agent NOW

### 1.1 Backend — API & Database Fix
- [ ] Confirm API is live and accessible at `api.appilico.com.au`
- [ ] Seed all 9 Beauty categories with icons, descriptions, slugs
- [ ] Seed 150+ Perth suburbs with coordinates and metadata
- [ ] Create sample/demo providers (10–20 realistic listings) for each category
- [ ] Seed sample reviews for demo providers
- [ ] Fix CORS to allow Vercel frontend domains
- [ ] Confirm all documented endpoints return real data
- [ ] Add `/api/categories/beauty` with full category objects
- [ ] Add `/api/locations/suburbs?platform=beauty` endpoint
- [ ] Add `/api/providers?category=&suburb=&sort=&page=` with pagination
- [ ] Add `/api/providers/featured` endpoint for homepage
- [ ] Ensure Swagger is accessible for testing

### 1.2 Frontend Beauty App — Page Fixes
- [ ] `/categories` → Connect to API, render all beauty categories with icons & counts
- [ ] `/category/[slug]` → Dynamic category page pulling providers from API
- [ ] `/suburbs` → Connect to API, render all Perth suburbs in alphabetical grid
- [ ] `/[suburb]` → Dynamic suburb page (e.g., /subiaco) with local providers
- [ ] `/[suburb]/[category]` → Combo pages (e.g., /joondalup/nail-salon) for SEO
- [ ] `/search` → Fully working search with filters (category, suburb, sort)
- [ ] `/providers/[slug]` → Full provider profile page (gallery, reviews, contact)
- [ ] `/join` → Self-contained registration form (not redirect to admin)
- [ ] `/login` → Provider login with JWT, redirects to provider dashboard
- [ ] Provider dashboard → Basic profile management after login

### 1.3 Frontend — UI/UX Polish
- [ ] Homepage featured providers section pulls from `/api/providers/featured`
- [ ] Category cards on homepage show real provider counts
- [ ] Search autocomplete for suburbs and services
- [ ] Mobile navigation fully working
- [ ] Newsletter subscribe form connected to email service
- [ ] About, Contact, Privacy, Terms pages have real content

### 1.4 SEO Infrastructure
- [ ] Sitemap.xml dynamically generated (includes all suburb/category combos)
- [ ] robots.txt properly configured
- [ ] Schema.org LocalBusiness structured data on provider pages
- [ ] Schema.org BreadcrumbList on category/suburb pages
- [ ] Dynamic metadata on all dynamic pages (`/[suburb]`, `/category/[slug]`, `/providers/[slug]`)
- [ ] Canonical URLs pointing to beauty.appilico.com.au (not vercel.app)

### 1.5 DevOps
- [ ] `.env.production` properly configured on Vercel
- [ ] `NEXT_PUBLIC_API_URL` pointing to `https://api.appilico.com.au`
- [ ] `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_CLARITY_ID` added to Vercel
- [ ] Backend health check endpoint returning 200
- [ ] SSL certificates valid on all subdomains
- [ ] Database backups configured

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
- [ ] Save/favourite providers
- [ ] Leave reviews (auth required)
- [ ] Search history and preferences
- [ ] Email enquiry to provider from platform

### 2.5 Advanced Search & Discovery
- [ ] Map view of providers (Google Maps / Mapbox integration)
- [ ] Filter by rating, distance, price range, availability
- [ ] "Near me" geolocation search
- [ ] Related providers section on provider pages
- [ ] "You might also like" recommendations

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

*Generated by Claude for Appilico | Roadmap v1.0 — May 2026*
