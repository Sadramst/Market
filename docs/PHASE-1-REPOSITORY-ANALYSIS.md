# Phase 1 — Repository Analysis & Audit Report

> Generated: May 2026
> Purpose: Comprehensive audit of all existing Appilico repositories before marketplace transformation

---

## 1. Repository Inventory

### 1.1 appilico-server (Backend API)
- **URL:** https://github.com/Sadramst/appilico-server
- **Stack:** .NET 8 / ASP.NET Core 8, EF Core 8, SQL Server
- **Domain:** E-commerce (Primo Meats butcher shop)
- **Architecture:** Clean layered (Domain → DataAccess → Business → API)
- **Deployed to:** Render (appilico-server.onrender.com) → migrated to api.appilico.com
- **Last active:** 2 weeks ago

**Features implemented:**
- Products (CRUD, search, filtering, variants, SKU)
- Categories (hierarchical tree)
- Brands (CRUD)
- Customers (profile, addresses, loyalty, membership tiers)
- Auth (register, login, JWT + refresh tokens, forgot/reset password, RBAC: Admin/Manager/Customer)
- Orders (cart-to-order, status tracking, history, cancellation)
- Cart (add/update/remove, auto-create)
- Discounts (code-based, percentage/fixed, validation)
- Vouchers (code-based, validation, redemption tracking)
- Special Offers (time-based with product associations)
- Payments (process, refunds)
- Reviews (with approval workflow)
- Wishlist (add/remove)
- Inventory (stock adjustments, low-stock alerts, transaction history)
- Dashboard (sales summary, top products, revenue charts, customer stats)
- Settings (key-value with grouping)
- Image Upload (Cloudinary)
- Blog, Newsletter, Visuals, Subscriptions (recently added)

**Patterns:**
- Repository + Unit of Work (`IUnitOfWork`)
- Soft Delete (`IsDeleted` flag)
- Audit Trail (`CreatedAt`, `UpdatedAt`, `CreatedBy`, `UpdatedBy`)
- API Response Wrapper (`ApiResponse<T>`)
- Global Exception Handling middleware
- Rate Limiting (100 req/min general, 5/min login, 3/min register)
- CORS configured for multiple origins

**Infrastructure:**
- Docker + Docker Compose
- Nginx reverse proxy with SSL/Certbot
- GitHub Actions CI/CD
- Postman collection included
- 89 integration tests

---

### 1.2 appilico-client (E-Commerce Frontend)
- **URL:** https://github.com/Sadramst/appilico-client
- **Stack:** Next.js (App Router), TypeScript
- **Domain:** E-commerce storefront for Primo Meats
- **Deployed to:** Vercel (appilico-client.vercel.app → appilico.store)

**Structure:**
- `app/` — Next.js pages
- `components/` — UI components
- `hooks/` — Custom React hooks
- `lib/` — Utilities
- `providers/` — Context providers
- `services/` — API service layer
- `stores/` — State management
- `styles/` — CSS styles
- `types/` — TypeScript interfaces
- `middleware.ts` — Auth middleware

**Features:**
- Full e-commerce storefront wired to real API
- Stripe integration (temporarily disabled)
- SEO metadata
- Cypress + Playwright E2E tests
- Vercel deployment configuration

---

### 1.3 appilico-website (Corporate Website)
- **URL:** https://github.com/Sadramst/appilico-website
- **Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Framer Motion 12
- **Domain:** Corporate site — "Operational Intelligence for Australian Industry"
- **Deployed to:** Vercel → www.appilico.com.au

**Pages:**
- Solutions (mining, construction, energy, manufacturing)
- Pricing (AUD tiers)
- Platform architecture deep-dive
- Security & compliance
- Interactive ROI calculator
- Resource hub
- Case studies (Work)
- Blog (API-powered)
- Contact (multi-step form)

**Features:**
- Dark/light theme toggle
- Framer Motion animations
- GitHub Actions CI/CD → Vercel
- shadcn/ui component library
- Turbopack dev server

---

### 1.4 SaaS (Appilico OS Platform)
- **URL:** https://github.com/Sadramst/SaaS
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion
- **Domain:** "Appilico OS — 8-module operational intelligence platform"
- **Deployed to:** Vercel (saa-s-one-vert.vercel.app)

**Structure:**
- `app/(marketing)/` — Public pages (home, features, pricing, about, blog, contact)
- `app/(auth)/` — Auth pages (login, register, forgot-password)
- `app/(dashboard)/` — Protected dashboard pages
- `app/api/` — Next.js API routes (thin proxies)
- `components/ui/` — Base UI components
- `components/marketing/` — Landing sections
- `components/dashboard/` — Dashboard components
- `components/shared/` — Navbar, Footer, ThemeToggle
- `lib/` — API client, auth helpers, utilities
- `stores/` — State management
- `types/` — TypeScript interfaces
- `providers/` — Context providers

**Features:**
- React Hook Form + Zod validation
- Axios API client → api.appilico.com
- JWT auth via localStorage
- Route groups for clean separation

---

## 2. Reusable Code Analysis

### ✅ HIGHLY REUSABLE — Carry Forward

| Component | Source Repo | Reuse Strategy |
|-----------|-------------|----------------|
| ASP.NET Identity + JWT auth | appilico-server | Migrate to .NET 9, extend with new roles (Provider, Moderator) |
| API Response Wrapper (`ApiResponse<T>`) | appilico-server | Keep as-is, works perfectly for marketplace |
| Soft Delete pattern | appilico-server | Keep for all entities |
| Audit Trail pattern | appilico-server | Keep for all entities |
| Rate Limiting | appilico-server | Keep and extend |
| Global Exception Handling | appilico-server | Keep as-is |
| Repository + UoW pattern | appilico-server | Keep but refactor for modular monolith |
| Review system with approval | appilico-server | Adapt for provider reviews |
| Image upload infrastructure | appilico-server | Migrate from Cloudinary to abstract storage |
| Category hierarchy system | appilico-server | Adapt for marketplace service categories |
| Customer profile + addresses | appilico-server | Extend for marketplace users |
| Dashboard analytics endpoints | appilico-server | Extend for marketplace metrics |
| shadcn/ui component library | appilico-website, SaaS | Carry forward for all frontends |
| Route group architecture | SaaS | Use for marketplace frontends |
| Dark/light theme system | appilico-website | Adapt per brand |
| Framer Motion animation patterns | appilico-website, SaaS | Reuse animations |
| Axios API client pattern | SaaS | Adapt for marketplace API |
| Zod validation patterns | SaaS | Reuse for all forms |
| E2E testing setup (Cypress/Playwright) | appilico-client | Carry forward |
| Docker + Nginx + SSL config | appilico-server | Adapt for marketplace backend |
| GitHub Actions CI/CD | all repos | Carry forward |
| Vercel deployment config | all frontend repos | Carry forward |

### ⚠️ PARTIALLY REUSABLE — Adapt

| Component | Issue | Action |
|-----------|-------|--------|
| Product/Category/Brand CRUD | E-commerce specific | Adapt patterns for service/provider entities |
| Order/Cart system | E-commerce specific | Not needed for marketplace MVP, but patterns reusable |
| Discount/Voucher system | E-commerce specific | Park for later marketplace promotions |
| Settings key-value system | Good abstraction | Extend for marketplace settings |
| Blog/Newsletter system | Recently added | Adapt for marketplace content |

### ❌ NOT REUSABLE — Technical Debt

| Component | Issue |
|-----------|-------|
| SQL Server dependency | Must migrate to PostgreSQL |
| .NET 8 | Must upgrade to .NET 9 |
| E-commerce domain models | Wrong domain (butcher shop vs marketplace) |
| Cloudinary tight coupling | Need storage abstraction |
| Auth via localStorage | Security concern — need httpOnly cookies or better token storage |
| Primo Meats seed data | Wrong domain |
| Primo Meats branding throughout | Complete rebrand needed |

---

## 3. Technical Debt Analysis

### Critical
1. **SQL Server → PostgreSQL migration** — Required per tech stack decision
2. **.NET 8 → .NET 9 upgrade** — Required per tech stack decision
3. **Auth token storage in localStorage** — XSS vulnerability risk
4. **Cloudinary direct dependency** — No storage abstraction layer
5. **No modular boundaries** — Current clean architecture is layered, not modular

### Medium
1. **No messaging/notification system** — Need to build from scratch
2. **No geolocation/suburb support** — Critical for marketplace SEO
3. **No provider concept** — Current system has customers only
4. **No follow/social features** — Need for marketplace
5. **No SEO page generation** — Need SSR/ISR SEO pages
6. **No moderation workflow** — Need for UGC marketplace

### Low
1. **Inconsistent frontend patterns** — SaaS repo has better architecture than client repo
2. **No search abstraction** — Direct database queries
3. **No CMS system** — Blog is basic
4. **No analytics beyond dashboard** — Need event tracking

---

## 4. Architecture Issues

1. **Layered vs Modular:** Current backend is pure layered architecture. Marketplace needs feature-based modules (Auth, Beauty, IT, Messaging, etc.) within those layers.
2. **No multi-tenancy concept:** System assumes single brand/store. Need marketplace-aware architecture.
3. **No event system:** No domain events, no notification triggers. Need event infrastructure for notifications.
4. **Frontend fragmentation:** Three separate frontend repos with overlapping UI components. Need shared UI library.
5. **No API versioning:** Current API has no versioning strategy.

---

## 5. Security Analysis

### ✅ Good
- JWT + Refresh token auth
- RBAC (Admin/Manager/Customer)
- Rate limiting on auth endpoints
- Password complexity requirements
- CORS configuration
- Input validation with FluentValidation

### ⚠️ Needs Improvement
- localStorage token storage → XSS risk
- No CSRF protection noted
- No audit logging beyond timestamps
- No IP-based rate limiting
- No file upload scanning
- Seed credentials exposed in docs (development only)

### ❌ Missing for Marketplace
- Provider verification workflow
- Content moderation system
- Report/flag system
- Anti-spam measures
- Abuse detection
- Secure messaging infrastructure

---

## 6. Deployment Analysis

### Current State
- Backend: Docker on Render → Vultr (planned)
- Frontend(s): Vercel
- Database: SQL Server
- Media: Cloudinary
- CI/CD: GitHub Actions

### Target State
- Backend: Docker on Vultr (initially), future Azure/AWS
- Frontend: Vercel (per-brand deployments)
- Database: PostgreSQL on Vultr
- Media: Cloudflare R2 (future)
- CI/CD: GitHub Actions
- SSL: Let's Encrypt via Certbot/Nginx

---

## 7. Scalability Analysis

### Current Bottlenecks
1. Single SQL Server instance, no read replicas
2. Synchronous request processing only
3. No caching layer
4. No CDN for API responses
5. No background job processing
6. No search indexing

### Future Scalability Path (TODO-based)
1. PostgreSQL read replicas
2. Redis caching layer
3. Background job processing (Hangfire/similar)
4. Full-text search → Elasticsearch/OpenSearch
5. Event-driven architecture migration
6. CDN for static assets
7. Horizontal scaling behind load balancer

---

## 8. Conclusions

### Key Decisions
1. **Do NOT rewrite from scratch.** The server codebase has solid patterns (UoW, soft delete, audit, response wrapper, auth) that should be preserved.
2. **Reorganize into modular monolith.** Keep patterns, restructure into feature modules.
3. **Migrate database.** SQL Server → PostgreSQL is non-negotiable.
4. **Upgrade runtime.** .NET 8 → .NET 9.
5. **Build new frontends.** The existing e-commerce frontend is wrong domain. Build fresh marketplace frontends using patterns from SaaS repo (best architecture of the three).
6. **Shared UI library.** Extract common components into a shared package/directory.
7. **New domain models.** Provider, Service, Booking (TODO), SEO Page, Follow, Message entities are all new.
8. **Preserve infrastructure.** Docker, Nginx, GitHub Actions, Vercel configs are all reusable.
