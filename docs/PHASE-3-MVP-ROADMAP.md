# Phase 3 — MVP Roadmap

> Generated: May 2026
> Target: 8–12 week MVP with incremental weekly releases
> Priority: Beauty Marketplace first, IT Marketplace lighter launch second

---

## Sprint Roadmap Overview

| Sprint | Weeks | Focus | Deliverable |
|--------|-------|-------|-------------|
| Sprint 1 | Week 1–2 | Foundation | Backend scaffold, DB, auth, project structure |
| Sprint 2 | Week 3–4 | Provider System | Provider registration, profiles, admin approval |
| Sprint 3 | Week 5–6 | Beauty Discovery | Public pages, categories, search, SEO pages |
| Sprint 4 | Week 7–8 | Social & Engagement | Follow, reviews, messaging, galleries |
| Sprint 5 | Week 9–10 | Admin & Moderation | Admin dashboard, moderation queue, analytics |
| Sprint 6 | Week 11–12 | IT Marketplace + Polish | IT MVP, SEO optimization, production deploy |

---

## Sprint 1 — Foundation (Week 1–2)

### Backend
- [ ] Create .NET 9 solution with modular monolith structure
- [ ] Set up PostgreSQL with EF Core
- [ ] Migrate auth patterns (ASP.NET Identity + JWT + Refresh Tokens)
- [ ] Implement SuperAdmin, Moderator, Provider, Customer roles
- [ ] Set up API response wrapper (from existing)
- [ ] Set up global exception handling (from existing)
- [ ] Set up rate limiting (from existing)
- [ ] Set up Serilog logging
- [ ] Set up AutoMapper
- [ ] Set up FluentValidation
- [ ] Create seed data (roles, admin user, initial categories)
- [ ] Set up Docker + docker-compose for local dev
- [ ] Swagger/OpenAPI documentation

### Frontend
- [ ] Initialize Turborepo monorepo
- [ ] Create shared UI package with shadcn/ui components
- [ ] Set up beauty app scaffold (Next.js App Router)
- [ ] Set up API client (Axios + interceptors)
- [ ] Set up auth context + hooks
- [ ] Create login/register pages
- [ ] Create basic layout (header, footer, mobile nav)
- [ ] Set up Tailwind CSS with beauty theme

### Infrastructure
- [ ] GitHub repository setup
- [ ] GitHub Actions CI pipeline (build + test)
- [ ] Vercel project for beauty frontend
- [ ] Local Docker development environment

### Milestone: Auth works end-to-end, users can register/login

---

## Sprint 2 — Provider System (Week 3–4)

### Backend
- [ ] Provider entity + profile
- [ ] Provider registration endpoint
- [ ] Admin provider approval workflow (Pending → Approved/Rejected)
- [ ] Provider CRUD (profile, services, gallery images)
- [ ] Provider service management endpoints
- [ ] Provider gallery image upload
- [ ] Category CRUD (hierarchical)
- [ ] Beauty-specific categories seed data
- [ ] Storage abstraction (local initially)

### Frontend (Beauty)
- [ ] Provider registration flow (multi-step form)
- [ ] Provider dashboard layout
- [ ] Provider profile editor
- [ ] Provider services management
- [ ] Provider gallery management
- [ ] Image upload component

### Frontend (Admin — start)
- [ ] Admin dashboard scaffold
- [ ] Provider approval queue
- [ ] Provider list + management

### Milestone: Providers can register, admin can approve, profiles are editable

---

## Sprint 3 — Beauty Discovery (Week 5–6)

### Backend
- [ ] Suburb data model + WA suburbs seed
- [ ] Provider search endpoint (location, category, keyword)
- [ ] PostgreSQL full-text search on providers/services
- [ ] SEO page generation service
- [ ] Provider public profile endpoint
- [ ] Category listing with provider counts
- [ ] Suburb listing with provider counts

### Frontend (Beauty)
- [ ] Homepage (hero, featured providers, categories, suburbs)
- [ ] Provider browse page (grid with filters)
- [ ] Provider profile page (public view)
- [ ] Category pages
- [ ] Suburb discovery pages (e.g., /perth/nail-salon)
- [ ] Search with filters (location, category, keyword)
- [ ] SEO metadata generation (title, description, schema.org)
- [ ] Dynamic sitemap.xml generation
- [ ] Responsive mobile-first design
- [ ] Loading skeletons + error states

### Milestone: Public users can browse and discover beauty providers with SEO-optimized pages

---

## Sprint 4 — Social & Engagement (Week 7–8)

### Backend
- [ ] Follow/unfollow provider endpoints
- [ ] Favorites system
- [ ] Review system (create, read, approval workflow)
- [ ] Messaging/inquiry system (provider ↔ customer)
- [ ] Notification system (in-app)
- [ ] Email notification service (SMTP)

### Frontend (Beauty)
- [ ] Follow button on provider profiles
- [ ] Favorites page (saved providers)
- [ ] Review submission form
- [ ] Review display on provider profiles
- [ ] Messaging/inquiry modal
- [ ] Notifications dropdown
- [ ] Customer dashboard (following, favorites, messages)

### Milestone: Users can interact with providers — follow, review, message

---

## Sprint 5 — Admin & Moderation (Week 9–10)

### Backend
- [ ] Report system (flag providers/reviews/content)
- [ ] Moderation queue endpoints
- [ ] Admin analytics endpoints (users, providers, page views)
- [ ] Category management (admin CRUD)
- [ ] User management endpoints
- [ ] Audit logging
- [ ] SEO page management (admin)

### Frontend (Admin)
- [ ] Full admin dashboard with stats
- [ ] Moderation queue UI
- [ ] Provider management (approve/suspend/edit)
- [ ] Category management
- [ ] User management
- [ ] Review moderation
- [ ] Report management
- [ ] SEO page editor
- [ ] Analytics charts (provider growth, user growth, page views)

### Milestone: Admins can fully manage the platform

---

## Sprint 6 — IT Marketplace + Production (Week 11–12)

### Backend
- [ ] IT-specific provider extensions
- [ ] Service request model (customer posts request)
- [ ] Service offer model (provider responds)
- [ ] IT category seed data

### Frontend (IT Marketplace)
- [ ] Initialize services app
- [ ] Homepage
- [ ] Browse providers/jobs
- [ ] Provider profile page
- [ ] Service request submission
- [ ] Provider offer flow
- [ ] SEO pages for IT categories

### Production Deploy
- [ ] Vultr VPS setup (Docker + Nginx + SSL)
- [ ] PostgreSQL production setup
- [ ] Environment variables management
- [ ] Production CI/CD pipeline
- [ ] DNS configuration for all subdomains
- [ ] Performance testing
- [ ] SEO audit + optimization
- [ ] Security audit
- [ ] Launch beauty.appilico.com.au
- [ ] Launch service.appilico.com.au
- [ ] Launch admin.appilico.com.au

### Milestone: Both marketplaces live in production

---

## Post-MVP Priorities (Week 13+)

| Priority | Feature | Notes |
|----------|---------|-------|
| 1 | Provider onboarding improvements | Guided setup, better UX |
| 2 | SEO content expansion | More suburbs, AI descriptions |
| 3 | Email notifications | Transactional emails |
| 4 | Provider verification | Badge system |
| 5 | Data import/claim flow | Import public business data |
| 6 | Advanced search | Filters, sorting, map view |
| 7 | Booking system (TODO) | Appointment calendar |
| 8 | Stripe Connect (TODO) | Provider payments |
| 9 | Mobile optimization | PWA, app-like experience |
| 10 | AI features (TODO) | Recommendations, moderation |

---

## Feature Priority Matrix

### Must Have (MVP)
- ✅ Auth (register, login, roles)
- ✅ Provider registration + approval
- ✅ Provider profiles + galleries
- ✅ Public discovery (browse, search)
- ✅ SEO pages (suburb, category, provider)
- ✅ Categories (hierarchical)
- ✅ Follow system
- ✅ Reviews with approval
- ✅ Messaging/inquiries
- ✅ Admin dashboard
- ✅ Moderation basics
- ✅ Mobile-first responsive design

### Should Have (Post-MVP)
- Provider verification badges
- Data import + claim flow
- Advanced search/filters
- Map-based discovery
- Email notifications (transactional)
- Analytics dashboard (advanced)
- Blog/content system

### Could Have (Future)
- Booking/appointment system
- Payment processing
- Video/reels system
- Loyalty programs
- Referral system
- Mobile apps
- AI features

### Won't Have (MVP)
- Escrow system
- Wallet system
- Advanced subscriptions
- Event sourcing/CQRS
- Microservices
- Complex AI

---

## Dependency Map

```
Auth ──────────────► Provider System ──► Beauty Discovery
                         │                    │
                         ▼                    ▼
                    Categories ──────► SEO Pages
                         │
                         ▼
                    Social/Follow ──► Reviews
                         │
                         ▼
                    Messaging ──────► Notifications
                         │
                         ▼
                    Admin Dashboard ──► Moderation
                         │
                         ▼
                    IT Marketplace (lighter)
```
