# Phase 2 — Architecture Plan

> Generated: May 2026
> Purpose: Complete architecture blueprint for the Appilico Marketplace Ecosystem

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPILICO MARKETPLACE ECOSYSTEM                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │   Beauty FE   │  │    IT FE     │  │   Admin Dashboard    │   │
│  │   Next.js     │  │   Next.js    │  │      Next.js         │   │
│  │   Vercel      │  │   Vercel     │  │      Vercel          │   │
│  │  beauty.      │  │  service.    │  │   admin.appilico.    │   │
│  │  appilico.    │  │  appilico.   │  │      com.au          │   │
│  │  com.au       │  │  com.au      │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                  │                      │               │
│         └──────────────────┼──────────────────────┘               │
│                            │                                      │
│                   ┌────────▼────────┐                             │
│                   │   api.appilico  │                             │
│                   │      .com      │                             │
│                   │                 │                             │
│                   │  .NET 9 API    │                             │
│                   │  Modular       │                             │
│                   │  Monolith      │                             │
│                   └────────┬───────┘                             │
│                            │                                      │
│                   ┌────────▼────────┐                             │
│                   │   PostgreSQL    │                             │
│                   │    Database     │                             │
│                   └─────────────────┘                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend — Modular Monolith Architecture

### 2.1 Solution Structure

```
Appilico.Market.sln
├── src/
│   ├── Appilico.Market.Api/                    # ASP.NET Core Web API host
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── Admin/
│   │   │   ├── Beauty/
│   │   │   ├── Services/
│   │   │   ├── Shared/
│   │   │   └── Seo/
│   │   ├── Middleware/
│   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   ├── RateLimitingMiddleware.cs
│   │   │   └── AuditLogMiddleware.cs
│   │   ├── Filters/
│   │   ├── Extensions/
│   │   │   ├── ServiceCollectionExtensions.cs
│   │   │   └── ModuleRegistrationExtensions.cs
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   ├── Appilico.Market.Domain/                 # Core domain — entities, interfaces, enums
│   │   ├── Common/
│   │   │   ├── BaseEntity.cs                   # Id, CreatedAt, UpdatedAt, IsDeleted
│   │   │   ├── AuditableEntity.cs              # + CreatedBy, UpdatedBy
│   │   │   ├── IUnitOfWork.cs
│   │   │   └── ApiResponse.cs
│   │   ├── Auth/
│   │   │   ├── AppUser.cs
│   │   │   ├── RefreshToken.cs
│   │   │   └── Enums/
│   │   │       └── UserRole.cs                 # SuperAdmin, Moderator, Provider, Customer
│   │   ├── Providers/
│   │   │   ├── Provider.cs
│   │   │   ├── ProviderProfile.cs
│   │   │   ├── ProviderService.cs
│   │   │   ├── ProviderGalleryImage.cs
│   │   │   └── Enums/
│   │   │       ├── ProviderStatus.cs           # Pending, Approved, Suspended, Rejected
│   │   │       └── ProviderType.cs             # Beauty, ITService, HomeService, etc.
│   │   ├── Categories/
│   │   │   ├── Category.cs
│   │   │   └── CategoryType.cs                 # Beauty, IT, etc.
│   │   ├── Locations/
│   │   │   ├── Suburb.cs
│   │   │   ├── State.cs
│   │   │   └── ServiceArea.cs
│   │   ├── Reviews/
│   │   │   ├── Review.cs
│   │   │   └── Enums/
│   │   │       └── ReviewStatus.cs
│   │   ├── Social/
│   │   │   ├── Follow.cs
│   │   │   └── Favorite.cs
│   │   ├── Messaging/
│   │   │   ├── Conversation.cs
│   │   │   ├── Message.cs
│   │   │   └── Inquiry.cs
│   │   ├── Notifications/
│   │   │   ├── Notification.cs
│   │   │   └── Enums/
│   │   │       └── NotificationType.cs
│   │   ├── Seo/
│   │   │   ├── SeoPage.cs
│   │   │   └── SeoMetadata.cs
│   │   ├── Moderation/
│   │   │   ├── Report.cs
│   │   │   ├── ModerationAction.cs
│   │   │   └── Enums/
│   │   │       └── ReportReason.cs
│   │   ├── Media/
│   │   │   └── MediaFile.cs
│   │   ├── Analytics/
│   │   │   └── AnalyticsEvent.cs
│   │   ├── Beauty/                             # Beauty-specific domain
│   │   │   ├── BeautyProvider.cs               # Extends Provider
│   │   │   ├── BeautyService.cs
│   │   │   └── BeautyCategory.cs
│   │   └── ITServices/                         # IT-specific domain
│   │       ├── ServiceRequest.cs
│   │       ├── ServiceOffer.cs
│   │       └── ITProvider.cs
│   │
│   ├── Appilico.Market.Infrastructure/         # Data access, external services
│   │   ├── Data/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── UnitOfWork.cs
│   │   │   ├── Configurations/                 # EF Core entity configs
│   │   │   │   ├── Auth/
│   │   │   │   ├── Providers/
│   │   │   │   ├── Beauty/
│   │   │   │   ├── ITServices/
│   │   │   │   ├── Seo/
│   │   │   │   └── Shared/
│   │   │   ├── Migrations/
│   │   │   └── Seed/
│   │   │       ├── AuthSeedData.cs
│   │   │       ├── CategorySeedData.cs
│   │   │       ├── SuburbSeedData.cs           # Perth/WA suburbs
│   │   │       └── BeautyCategorySeedData.cs
│   │   ├── Repositories/
│   │   │   ├── GenericRepository.cs
│   │   │   ├── ProviderRepository.cs
│   │   │   ├── CategoryRepository.cs
│   │   │   └── SeoPageRepository.cs
│   │   ├── Services/
│   │   │   ├── Email/
│   │   │   │   ├── IEmailService.cs
│   │   │   │   └── SmtpEmailService.cs
│   │   │   ├── Storage/
│   │   │   │   ├── IStorageService.cs
│   │   │   │   └── LocalStorageService.cs      # TODO: CloudflareR2StorageService
│   │   │   └── Search/
│   │   │       ├── ISearchService.cs
│   │   │       └── PostgresSearchService.cs    # TODO: ElasticsearchService
│   │   └── Identity/
│   │       └── IdentitySetup.cs
│   │
│   └── Appilico.Market.Application/            # Business logic, DTOs, services
│       ├── Common/
│       │   ├── Mappings/
│       │   │   └── AutoMapperProfile.cs
│       │   ├── Validators/
│       │   └── Interfaces/
│       ├── Auth/
│       │   ├── DTOs/
│       │   ├── Services/
│       │   │   ├── IAuthService.cs
│       │   │   └── AuthService.cs
│       │   └── Validators/
│       ├── Providers/
│       │   ├── DTOs/
│       │   │   ├── ProviderDto.cs
│       │   │   ├── ProviderProfileDto.cs
│       │   │   ├── CreateProviderRequest.cs
│       │   │   └── UpdateProviderRequest.cs
│       │   ├── Services/
│       │   │   ├── IProviderService.cs
│       │   │   └── ProviderService.cs
│       │   └── Validators/
│       ├── Categories/
│       ├── Reviews/
│       ├── Social/
│       ├── Messaging/
│       ├── Notifications/
│       ├── Seo/
│       │   ├── DTOs/
│       │   ├── Services/
│       │   │   ├── ISeoService.cs
│       │   │   └── SeoService.cs
│       │   └── Generators/
│       │       ├── SuburbPageGenerator.cs
│       │       └── CategoryPageGenerator.cs
│       ├── Moderation/
│       ├── Media/
│       ├── Analytics/
│       ├── Admin/
│       ├── Beauty/
│       │   ├── DTOs/
│       │   ├── Services/
│       │   └── Validators/
│       └── ITServices/
│           ├── DTOs/
│           ├── Services/
│           └── Validators/
│
└── tests/
    ├── Appilico.Market.UnitTests/
    ├── Appilico.Market.IntegrationTests/
    └── Appilico.Market.Api.Tests/
```

### 2.2 Module Boundaries

Each module owns its:
- Domain entities
- DTOs
- Service interfaces + implementations
- Validators
- EF Core configurations
- Controllers

Modules communicate through well-defined interfaces, NOT direct entity references across boundaries.

### 2.3 API Route Strategy

```
/api/v1/auth/*                     # Authentication
/api/v1/providers/*                # Provider management
/api/v1/beauty/providers/*         # Beauty-specific provider endpoints
/api/v1/beauty/categories/*        # Beauty categories
/api/v1/beauty/services/*          # Beauty services
/api/v1/it/providers/*             # IT-specific provider endpoints
/api/v1/it/requests/*              # IT service requests
/api/v1/it/offers/*                # IT service offers
/api/v1/categories/*               # Shared categories
/api/v1/reviews/*                  # Reviews
/api/v1/follows/*                  # Social follows
/api/v1/messages/*                 # Messaging
/api/v1/notifications/*            # Notifications
/api/v1/seo/*                      # SEO pages
/api/v1/media/*                    # File upload
/api/v1/search/*                   # Search
/api/v1/admin/*                    # Admin endpoints
/api/v1/moderation/*               # Moderation
/api/v1/analytics/*                # Analytics
/api/v1/suburbs/*                  # Location/suburb data
```

---

## 3. Frontend Architecture

### 3.1 Monorepo Structure

```
frontend/
├── packages/
│   └── ui/                                # Shared UI library
│       ├── components/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── input.tsx
│       │   ├── select.tsx
│       │   ├── dialog.tsx
│       │   ├── avatar.tsx
│       │   ├── badge.tsx
│       │   ├── skeleton.tsx
│       │   ├── dropdown-menu.tsx
│       │   ├── tabs.tsx
│       │   └── ...
│       ├── hooks/
│       │   ├── use-auth.ts
│       │   ├── use-api.ts
│       │   ├── use-debounce.ts
│       │   └── use-media-query.ts
│       ├── lib/
│       │   ├── api-client.ts               # Axios instance + interceptors
│       │   ├── utils.ts                     # cn(), formatDate, etc.
│       │   └── validators.ts               # Zod schemas
│       ├── types/
│       │   ├── auth.ts
│       │   ├── provider.ts
│       │   ├── category.ts
│       │   ├── review.ts
│       │   ├── api.ts
│       │   └── seo.ts
│       └── package.json
│
├── apps/
│   ├── beauty/                             # beauty.appilico.com.au
│   │   ├── app/
│   │   │   ├── (public)/                   # Public discovery pages
│   │   │   │   ├── page.tsx                # Homepage
│   │   │   │   ├── providers/
│   │   │   │   │   ├── page.tsx            # Browse providers
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx        # Provider profile
│   │   │   │   ├── [suburb]/
│   │   │   │   │   ├── page.tsx            # Suburb discovery page
│   │   │   │   │   └── [category]/
│   │   │   │   │       └── page.tsx        # Suburb + category SEO page
│   │   │   │   ├── categories/
│   │   │   │   │   ├── page.tsx            # All categories
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx        # Category page
│   │   │   │   └── search/
│   │   │   │       └── page.tsx            # Search results
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── forgot-password/page.tsx
│   │   │   ├── (dashboard)/               # Authenticated area
│   │   │   │   ├── dashboard/page.tsx      # Customer dashboard
│   │   │   │   ├── favorites/page.tsx
│   │   │   │   ├── messages/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   ├── (provider)/                # Provider dashboard
│   │   │   │   ├── provider/
│   │   │   │   │   ├── dashboard/page.tsx
│   │   │   │   │   ├── profile/page.tsx
│   │   │   │   │   ├── services/page.tsx
│   │   │   │   │   ├── gallery/page.tsx
│   │   │   │   │   ├── reviews/page.tsx
│   │   │   │   │   └── inquiries/page.tsx
│   │   │   │   └── register/page.tsx       # Provider registration
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── sitemap.ts                  # Dynamic sitemap generation
│   │   ├── components/                     # Beauty-specific components
│   │   │   ├── hero.tsx
│   │   │   ├── provider-card.tsx
│   │   │   ├── category-grid.tsx
│   │   │   ├── suburb-list.tsx
│   │   │   ├── gallery-viewer.tsx
│   │   │   └── review-card.tsx
│   │   ├── lib/
│   │   │   └── beauty-theme.ts             # Beauty-specific theme config
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── services/                           # service.appilico.com.au
│   │   ├── app/
│   │   │   ├── (public)/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   └── (provider)/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── admin/                              # admin.appilico.com.au
│       ├── app/
│       │   ├── (auth)/
│       │   ├── (dashboard)/
│       │   │   ├── page.tsx                # Admin overview
│       │   │   ├── providers/
│       │   │   ├── moderation/
│       │   │   ├── users/
│       │   │   ├── categories/
│       │   │   ├── seo/
│       │   │   ├── analytics/
│       │   │   └── settings/
│       │   └── layout.tsx
│       ├── components/
│       ├── next.config.ts
│       └── package.json
│
├── package.json                            # Root workspace
├── turbo.json                              # Turborepo config
└── tsconfig.base.json
```

### 3.2 Frontend Tech Stack (All Apps)
- Next.js (latest, App Router)
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui components (shared package)
- Framer Motion (animations)
- React Hook Form + Zod (forms/validation)
- Axios (API client)
- next-themes (dark/light)
- Turborepo (monorepo management)

---

## 4. Database Strategy

### 4.1 PostgreSQL Schema

Using module-prefixed table naming in a single database:

```sql
-- Auth Module
auth_users                  -- ASP.NET Identity users (extended)
auth_roles                  -- Roles
auth_user_roles             -- User-role mapping
auth_refresh_tokens         -- JWT refresh tokens

-- Provider Module (shared)
providers                   -- Core provider entity
provider_profiles           -- Extended profile info
provider_services           -- Services offered
provider_gallery_images     -- Gallery images
provider_service_areas      -- Areas served (suburb links)

-- Category Module
categories                  -- Hierarchical categories
category_types              -- Beauty, IT, etc.

-- Location Module
suburbs                     -- Australian suburbs
states                      -- Australian states

-- Review Module
reviews                     -- Provider reviews

-- Social Module
follows                     -- User follows provider
favorites                   -- User saves provider

-- Messaging Module
conversations               -- Conversation threads
messages                    -- Individual messages
inquiries                   -- Service inquiries

-- Notification Module
notifications               -- User notifications

-- SEO Module
seo_pages                   -- Generated SEO pages
seo_metadata                -- Page metadata

-- Moderation Module
reports                     -- User reports
moderation_actions          -- Admin moderation actions

-- Media Module
media_files                 -- Uploaded files metadata

-- Analytics Module
analytics_events            -- Page views, actions

-- Beauty Module (marketplace-specific)
beauty_provider_details     -- Beauty-specific provider fields
beauty_services             -- Beauty service catalog
beauty_categories           -- Beauty-specific categories (extends categories)

-- IT Module (marketplace-specific)
it_service_requests         -- Client service requests
it_service_offers           -- Provider offers on requests
it_provider_details         -- IT-specific provider fields

-- Settings
settings                    -- App configuration key-value

-- Audit
audit_logs                  -- System audit trail
```

### 4.2 Key Entity Relationships

```
AppUser (1) ──── (0..1) Provider
AppUser (1) ──── (0..*) Follow
AppUser (1) ──── (0..*) Favorite
AppUser (1) ──── (0..*) Review
AppUser (1) ──── (0..*) Notification

Provider (1) ──── (1) ProviderProfile
Provider (1) ──── (0..*) ProviderService
Provider (1) ──── (0..*) ProviderGalleryImage
Provider (1) ──── (0..*) ServiceArea ──── (*) Suburb
Provider (1) ──── (0..*) Review
Provider (1) ──── (0..*) Follow (followers)
Provider (1) ──── (0..*) Conversation

Category (1) ──── (0..*) Category (children)
Category (1) ──── (0..*) ProviderService

Suburb (1) ──── (0..*) SeoPage
Suburb (1) ──── (0..*) ServiceArea

Conversation (1) ──── (0..*) Message
```

### 4.3 Migration Notes
```
-- TODO: Read replicas for search-heavy queries
-- TODO: Connection pooling with PgBouncer
-- TODO: Partitioning for analytics_events table
-- TODO: Full-text search indexes on providers, services, categories
-- TODO: Spatial indexes for geolocation queries
-- TODO: Archive strategy for old notifications/messages
```

---

## 5. Authentication & Authorization Strategy

### 5.1 Roles
| Role | Description | Access |
|------|-------------|--------|
| SuperAdmin | Platform owner | Full access to everything |
| Moderator | Content moderator | Moderation queue, user management, content management |
| Provider | Service provider | Own profile, services, gallery, inquiries, reviews |
| Customer | End user | Browse, follow, favorite, review, message |

### 5.2 Auth Flow (Preserved from existing)
1. Register → Creates AppUser + optional Provider/Customer record
2. Login → JWT access token (60 min) + refresh token (7 days)
3. Bearer token on authenticated requests
4. Refresh endpoint for token rotation
5. Revoke for logout

### 5.3 Improvements
- Move to httpOnly cookie for refresh token storage (security improvement)
- Keep access token in memory (not localStorage)
- Add provider approval workflow (Pending → Approved/Rejected)
- Add email verification
- TODO: OAuth2 social login (Google, Facebook)
- TODO: Two-factor authentication

---

## 6. SEO Architecture

### 6.1 Page Types
| Page Type | URL Pattern | Generation | Priority |
|-----------|-------------|------------|----------|
| Suburb pages | `/perth/` | ISR (revalidate: 1 day) | High |
| Suburb + Category | `/perth/nail-salon` | ISR (revalidate: 1 day) | High |
| Category pages | `/categories/nail-salon` | ISR (revalidate: 1 day) | High |
| Provider profiles | `/providers/[slug]` | ISR (revalidate: 1 hour) | High |
| Search results | `/search?q=...` | SSR (no-cache) | Medium |
| Static pages | `/about`, `/contact` | SSG | Low |

### 6.2 SEO Features
- Dynamic `<title>`, `<meta description>`, `<meta keywords>`
- schema.org structured data (LocalBusiness, Service, Review, BreadcrumbList)
- Auto-generated XML sitemap
- Canonical URLs
- Open Graph + Twitter Card meta
- Image optimization (next/image)
- Internal linking between suburb/category/provider pages
- Breadcrumb navigation

### 6.3 Suburb Data Strategy
- Pre-populate Perth/WA suburbs database
- Generate SEO pages for suburbs with active providers
- TODO: Expand to all Australian suburbs
- TODO: AI-generated suburb descriptions
- TODO: AI-generated category content

---

## 7. Deployment Architecture

### 7.1 Domains
| Service | Domain | Platform |
|---------|--------|----------|
| Beauty Marketplace | beauty.appilico.com.au | Vercel |
| IT Marketplace | service.appilico.com.au | Vercel |
| Admin Dashboard | admin.appilico.com.au | Vercel |
| Backend API | api.appilico.com | Vultr VPS |
| PostgreSQL | (internal) | Vultr VPS |

### 7.2 Infrastructure
```
Vultr VPS
├── Docker Compose
│   ├── appilico-api (ASP.NET Core 9)
│   ├── postgres (PostgreSQL 16)
│   └── nginx (reverse proxy + SSL)
└── Certbot (Let's Encrypt SSL)

Vercel
├── beauty.appilico.com.au
├── service.appilico.com.au
└── admin.appilico.com.au
```

### 7.3 CI/CD Pipeline
```
GitHub Push
  → GitHub Actions
    → Build + Test
    → Docker Build + Push
    → SSH Deploy to Vultr (backend)
    → Vercel auto-deploy (frontends)
```

---

## 8. Future Architecture TODOs

```
# TODO: Stripe Connect integration for provider payments
# TODO: AI recommendation engine service
# TODO: AI moderation pipeline (image + text)
# TODO: AI-generated SEO content service
# TODO: OpenSearch/Elasticsearch migration
# TODO: Redis caching layer
# TODO: WebSocket for real-time messaging
# TODO: Push notification service (FCM/APNs)
# TODO: SMS notification service (Twilio)
# TODO: Event-driven architecture (MediatR → message bus)
# TODO: Background job processing (Hangfire)
# TODO: CDN for media files (Cloudflare R2)
# TODO: Mobile apps (React Native)
# TODO: GraphQL API layer
# TODO: Rate limiting with Redis
# TODO: Horizontal scaling (Kubernetes)
# TODO: Monitoring (Prometheus + Grafana)
# TODO: Log aggregation (Seq/ELK)
# TODO: A/B testing infrastructure
# TODO: Feature flags system
# TODO: White-label capability
# TODO: Multi-region deployment
```
