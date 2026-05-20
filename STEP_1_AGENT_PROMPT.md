# STEP 1 AGENT PROMPT — Appilico Beauty Marketplace: Full Foundation Fix
> Give this entire prompt to your coding agent (Cursor, Windsurf, Claude Code, etc.)
> This is the HIGHEST PRIORITY execution block — do not skip or summarise.

---

## CONTEXT — Who You Are & What You're Working On

You are a senior full-stack engineer working on **Appilico** — a multi-brand Australian marketplace ecosystem.

Repository: `github.com/Sadramst/Market`

The ecosystem consists of:
- **Beauty Marketplace** → `beauty.appilico.com.au` (Vercel — Next.js 15)
- **IT Services Marketplace** → `service.appilico.com.au` (Vercel — Next.js 15)
- **Admin Platform** → `admin.appilico.com.au` (Vercel — Next.js 15)
- **Shared API** → `api.appilico.com.au` (.NET 8 on Vultr VPS via Docker + Nginx)

Tech Stack:
- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Turborepo monorepo
- **Backend:** .NET 8, ASP.NET Core, Entity Framework Core, PostgreSQL 16, JWT Auth
- **Deployment:** Vercel (frontend), Docker + Nginx + Certbot (backend on Vultr VPS)

Your **sole focus in this step** is the **Beauty Marketplace** and its **shared API backend**.

---

## PROBLEM DIAGNOSIS

The live site (`beauty.appilico.com.au` / `appilico-beauty.vercel.app`) has a beautiful homepage but everything else is broken or empty:

| Page | Status | Root Cause |
|------|--------|-----------|
| `/categories` | Empty — "No categories available" | API not seeded |
| `/suburbs` | Empty — "No suburbs available" | API not seeded |
| `/search` | Empty — "No providers found" | No data + possible API disconnect |
| `/category/nails` | "Category Not Found" | API returning null |
| `/category/[slug]` (all) | Broken | Same as above |
| `/providers/[slug]` | Unknown | No providers exist |
| `/join` | Redirects to admin domain | No self-serve registration |
| `/login` | Unknown state | Disallowed by robots.txt |

**Root causes:**
1. Database has NO seed data (categories, suburbs, providers)
2. API backend may not be connected to frontend (`NEXT_PUBLIC_API_URL` env var)
3. Frontend API client may be falling back to empty arrays instead of erroring visibly
4. Provider registration has no self-contained flow

---

## YOUR MISSION — Complete All Tasks Below

Work through each task completely. Do not skip. Do not leave placeholders. Write real, production-quality code.

---

## TASK 1 — Backend: Database Seed Data

### 1A — Beauty Categories Seed

In `Appilico.Market.Infrastructure`, create or update the database seeder to include ALL of the following beauty categories. Each category needs: `Id`, `Name`, `Slug`, `Description`, `Icon` (emoji), `Platform` = `"beauty"`, `IsActive` = true, `SortOrder`.

```
Nails       | nails      | Manicures, pedicures, gel nails, nail art and extensions | 💅 | 1
Hair        | hair       | Cuts, colour, balayage, highlights, blowouts and styling | 💇‍♀️ | 2
Lashes      | lashes     | Lash extensions, lifts, tints and lash treatments        | 👁️ | 3
Brows       | brows      | Threading, tinting, lamination, microblading and henna   | ✨ | 4
Skin Care   | skin-care  | Facials, peels, microdermabrasion and skin treatments     | 🧴 | 5
Makeup      | makeup     | Bridal, occasion, everyday and special event makeup       | 💄 | 6
Body        | body       | Massage, waxing, spray tan, body wraps and tanning       | 🌸 | 7
Cosmetic    | cosmetic   | Injectables, fillers, anti-wrinkle and cosmetic aesthetics| 💉 | 8
Wellness    | wellness   | Holistic health, spa, meditation and wellness therapies  | 🧘 | 9
```

Ensure the seeder is idempotent (safe to re-run without duplicates).

### 1B — Perth Suburbs Seed

Seed ALL of the following Perth suburbs. Each suburb needs: `Id`, `Name`, `Slug` (lowercase-hyphenated), `Postcode`, `Latitude`, `Longitude`, `IsActive` = true, `Platform` = `"beauty"`.

Include ALL of these suburbs (minimum required list):

```
Perth CBD, 6000, -31.9505, 115.8605
Subiaco, 6008, -31.9485, 115.8270
Fremantle, 6160, -32.0569, 115.7439
Joondalup, 6027, -31.7437, 115.7661
Claremont, 6010, -31.9802, 115.7826
Scarborough, 6019, -31.8942, 115.7606
Applecross, 6153, -32.0174, 115.8437
Mount Lawley, 6050, -31.9296, 115.8709
Leederville, 6007, -31.9358, 115.8390
Nedlands, 6009, -31.9780, 115.8119
Victoria Park, 6100, -31.9744, 115.9001
Canning Vale, 6155, -32.0750, 115.9225
Osborne Park, 6017, -31.8999, 115.8273
Cockburn Central, 6164, -32.1171, 115.8438
Midland, 6056, -31.8883, 116.0019
Armadale, 6112, -32.1520, 116.0072
Rockingham, 6168, -32.2774, 115.7299
Mandurah, 6210, -32.5279, 115.7215
Balcatta, 6021, -31.8753, 115.8248
Karrinyup, 6018, -31.8690, 115.7762
Floreat, 6014, -31.9395, 115.8010
Cottesloe, 6011, -31.9995, 115.7585
Dalkeith, 6009, -31.9882, 115.8051
Swanbourne, 6010, -31.9743, 115.7730
Mosman Park, 6012, -31.9750, 115.7656
Peppermint Grove, 6011, -31.9958, 115.7706
North Perth, 6006, -31.9200, 115.8613
Highgate, 6003, -31.9388, 115.8714
Inglewood, 6052, -31.9153, 115.8768
Maylands, 6051, -31.9297, 115.8897
Bayswater, 6053, -31.9188, 115.9088
Morley, 6062, -31.8884, 115.9049
Dianella, 6059, -31.8806, 115.8762
Mirrabooka, 6061, -31.8679, 115.8570
Wanneroo, 6065, -31.7502, 115.8010
Ellenbrook, 6069, -31.7640, 115.9917
Swan View, 6056, -31.8739, 116.0517
Kalamunda, 6076, -31.9740, 116.0580
Forrestfield, 6058, -31.9790, 116.0127
Thornlie, 6108, -32.0573, 115.9601
Gosnells, 6110, -32.0843, 116.0073
Bentley, 6102, -31.9979, 115.9163
East Victoria Park, 6101, -31.9889, 115.9059
South Perth, 6151, -31.9693, 115.8619
Como, 6152, -31.9840, 115.8619
Manning, 6152, -32.0051, 115.8837
Melville, 6156, -31.9987, 115.8209
Palmyra, 6157, -32.0356, 115.8144
Bicton, 6157, -32.0311, 115.8063
East Fremantle, 6158, -32.0336, 115.7736
Hamilton Hill, 6163, -32.0897, 115.8035
Spearwood, 6163, -32.0938, 115.7765
Success, 6164, -32.1044, 115.8427
Bibra Lake, 6163, -32.1056, 115.8241
Beeliar, 6164, -32.1248, 115.8011
Yangebup, 6164, -32.0967, 115.8220
Waikiki, 6169, -32.3035, 115.7628
Secret Harbour, 6173, -32.3803, 115.7561
Baldivis, 6171, -32.3116, 115.8335
Bertram, 6167, -32.2342, 115.8297
```

### 1C — Demo Providers Seed

Create 15 realistic-looking demo beauty providers. Each provider needs: `BusinessName`, `Slug`, `CategoryId`, `SuburbId`, `Description`, `Phone`, `Email`, `Address`, `Rating` (4.2–4.9), `ReviewCount` (5–80), `IsActive`, `IsVerified`, `Platform` = `"beauty"`.

Sample providers to seed (create all 15):

```
1. "Luxe Nails Subiaco" | category: nails | suburb: Subiaco | rating: 4.8 | reviews: 42
2. "The Lash Studio Perth" | category: lashes | suburb: Perth CBD | rating: 4.9 | reviews: 67
3. "Glam Hair Fremantle" | category: hair | suburb: Fremantle | rating: 4.7 | reviews: 38
4. "Brow Bar Claremont" | category: brows | suburb: Claremont | rating: 4.6 | reviews: 29
5. "Skin by Sarah Nedlands" | category: skin-care | suburb: Nedlands | rating: 4.8 | reviews: 55
6. "Bridal Makeup Perth" | category: makeup | suburb: Scarborough | rating: 5.0 | reviews: 18
7. "The Wellness Room Leederville" | category: wellness | suburb: Leederville | rating: 4.5 | reviews: 31
8. "Body Bliss Mount Lawley" | category: body | suburb: Mount Lawley | rating: 4.7 | reviews: 44
9. "Aesthetic Studio Applecross" | category: cosmetic | suburb: Applecross | rating: 4.9 | reviews: 23
10. "Nail Art by Mia" | category: nails | suburb: Victoria Park | rating: 4.6 | reviews: 57
11. "Lash Lounge Joondalup" | category: lashes | suburb: Joondalup | rating: 4.8 | reviews: 34
12. "Hair House Subiaco" | category: hair | suburb: Subiaco | rating: 4.7 | reviews: 61
13. "Skin Clinic Cottesloe" | category: skin-care | suburb: Cottesloe | rating: 4.9 | reviews: 48
14. "Brow & Lash Lab" | category: brows | suburb: Mount Lawley | rating: 4.8 | reviews: 37
15. "Glow Body Studio" | category: body | suburb: Fremantle | rating: 4.6 | reviews: 26
```

Also seed 3–5 reviews per provider with realistic Australian names and review text.

---

## TASK 2 — Backend: API Endpoints

Audit and fix/create the following API endpoints. All must return properly shaped JSON. Check if they already exist; if so fix them. If not, create them.

### 2A — Categories Endpoint
```
GET /api/categories/beauty
```
Returns: Array of all active beauty categories with `id`, `name`, `slug`, `description`, `icon`, `sortOrder`, `providerCount`

### 2B — Suburbs Endpoint
```
GET /api/locations/suburbs?platform=beauty&search={term}
```
Returns: Array of active Perth suburbs with `id`, `name`, `slug`, `postcode`, `latitude`, `longitude`

### 2C — Providers Search Endpoint
```
GET /api/providers?platform=beauty&category={slug}&suburb={slug}&sort={rating|newest|az|mostReviewed}&page={n}&pageSize=12
```
Returns: Paginated `{ providers: [...], total: number, page: number, pageSize: number }`

Each provider: `id`, `slug`, `businessName`, `category`, `suburb`, `description`, `rating`, `reviewCount`, `isVerified`, `heroImage`

### 2D — Featured Providers
```
GET /api/providers/featured?platform=beauty&limit=6
```
Returns: Top 6 providers by rating with review count ≥ 10

### 2E — Single Provider
```
GET /api/providers/slug/{slug}
```
Returns: Full provider object including `services[]`, `reviews[]`, `gallery[]`, `socialLinks`, `hours`, `phone`, `email`, `address`, `suburb`, `category`

### 2F — Provider Reviews
```
GET /api/reviews/provider/{providerId}?page=1&pageSize=10
```
Returns: Paginated reviews with `authorName`, `rating`, `text`, `createdAt`, `isVerified`

### 2G — Suburb Detail
```
GET /api/locations/suburbs/{slug}?platform=beauty
```
Returns: Suburb details + `providerCount` per category + `totalProviders`

### 2H — CORS Configuration

Ensure CORS allows ALL of these origins:
```
https://beauty.appilico.com.au
https://appilico-beauty.vercel.app
https://service.appilico.com.au
https://admin.appilico.com.au
http://localhost:3000
http://localhost:3001
http://localhost:3002
```

---

## TASK 3 — Frontend: Fix All Beauty App Pages

Working in `frontend/apps/beauty/`, fix or create every page below.

### 3A — Environment Configuration

In `frontend/apps/beauty/.env.local` (and Vercel env vars):
```
NEXT_PUBLIC_API_URL=https://api.appilico.com.au
NEXT_PUBLIC_SITE_URL=https://beauty.appilico.com.au
NEXT_PUBLIC_PLATFORM=beauty
```

In `frontend/packages/shared/src/api/client.ts` (or wherever the API client lives):
- Ensure the base URL reads from `process.env.NEXT_PUBLIC_API_URL`
- Add proper error handling — never silently return empty arrays on 500 errors
- Add request timeout of 10 seconds
- Add retry logic (1 retry on network failure)

### 3B — `/categories` Page

File: `apps/beauty/src/app/categories/page.tsx`

This page MUST:
- Fetch from `GET /api/categories/beauty` on the server (SSR/ISR with 1 hour revalidation)
- Render a beautiful grid of ALL 9 category cards
- Each card shows: emoji icon, name, description, provider count
- Each card links to `/category/[slug]`
- Has proper SEO metadata
- Has breadcrumb: Home → Categories
- If API fails, shows a friendly error state (NOT empty state)

### 3C — `/category/[slug]` Page

File: `apps/beauty/src/app/category/[slug]/page.tsx`

This page MUST:
- Fetch category detail from `GET /api/categories/beauty` + filter by slug
- Fetch providers from `GET /api/providers?platform=beauty&category={slug}&sort=rating`
- Display: category hero section (name, description, provider count)
- Display: provider cards grid (paginated, 12 per page)
- Each provider card shows: business name, suburb, rating stars, review count, description snippet, category badge
- Filtering sidebar/bar: sort by (Top Rated, Newest, A-Z, Most Reviewed)
- Suburb filter dropdown
- Pagination (previous/next + page numbers)
- Empty state: "No providers in this category yet — [Be the First to Join]"
- `generateStaticParams` for all 9 category slugs
- `generateMetadata` with dynamic title/description/OG

### 3D — `/suburbs` Page

File: `apps/beauty/src/app/suburbs/page.tsx`

This page MUST:
- Fetch ALL suburbs from `GET /api/locations/suburbs?platform=beauty`
- Display in an A-Z alphabetical indexed grid
- Each suburb shows: name, postcode, provider count
- Each suburb links to `/[suburb-slug]`
- Search box to filter suburbs in real-time (client-side)
- Proper SEO metadata + breadcrumb

### 3E — `/[suburb]` Dynamic Suburb Page

File: `apps/beauty/src/app/[suburb]/page.tsx`

This page MUST:
- Fetch suburb data from `GET /api/locations/suburbs/{slug}?platform=beauty`
- Fetch providers from `GET /api/providers?platform=beauty&suburb={slug}&sort=rating`
- Display: suburb hero with name, total providers, map link
- Category breakdown: show provider count per category in suburb with links
- Provider cards grid (same component as category page)
- SEO: title="Beauty Services in {SuburbName} | Appilico Beauty", description tailored
- Schema.org: BreadcrumbList + ItemList structured data
- Breadcrumb: Home → Suburbs → {SuburbName}
- `generateStaticParams` for all seeded suburbs

### 3F — `/[suburb]/[category]` Combo SEO Pages

File: `apps/beauty/src/app/[suburb]/[category]/page.tsx`

This page MUST:
- Handle combos like `/subiaco/nails`, `/fremantle/hair`, `/joondalup/lash-extensions`
- Fetch providers filtered by both suburb AND category
- SEO title: "Nail Salons in Subiaco Perth | Appilico Beauty"
- SEO description: "Find the best nail salons in Subiaco. Compare {count} providers, read reviews and book your appointment."
- Schema.org LocalBusiness list structured data
- Breadcrumb: Home → {SuburbName} → {CategoryName}
- Category-specific H1s (e.g., "Nail Salons in Subiaco" not "Nails in Subiaco")
- `generateStaticParams` for ALL suburb × category combinations (generates thousands of SEO pages)

### 3G — `/providers/[slug]` Provider Profile Page

File: `apps/beauty/src/app/providers/[slug]/page.tsx`

This page MUST:
- Fetch from `GET /api/providers/slug/{slug}`
- Hero section: business name, suburb, category, rating, review count, verification badge
- Tab navigation or sections: About | Services | Gallery | Reviews | Location
- Gallery: responsive image grid (3-column desktop, 2-column tablet, 1-column mobile)
- Services list: service name + price (if available)
- Reviews section: star rating summary + individual review cards
- Contact section: phone (masked on desktop, reveal on click), email enquiry button, website link
- Location: embedded Google Maps or suburb name with link to suburb page
- CTA sidebar/footer: "Enquire Now" button (mailto or contact form)
- Social links (Instagram, Facebook if available)
- Breadcrumb: Home → {CategoryName} → {SuburbName} → {BusinessName}
- Schema.org: LocalBusiness with aggregateRating + reviews
- `generateMetadata` with business-specific OG tags

### 3H — `/search` Page Overhaul

File: `apps/beauty/src/app/search/page.tsx`

This page MUST:
- Read URL params: `?q={query}&category={slug}&suburb={slug}&sort={sort}&page={n}`
- Call `GET /api/providers?platform=beauty&...` with all filters applied
- Show results count: "42 beauty providers found"
- Filter panel (desktop sidebar, mobile bottom sheet):
  - Category multi-select (checkboxes)
  - Suburb select (searchable dropdown)
  - Sort select (Top Rated, Newest, A-Z, Most Reviewed)
- Provider cards grid (same reusable component)
- Pagination
- URL updates as filters change (useRouter push, no page reload)
- Empty state with suggestions
- Loading skeleton while fetching

### 3I — `/join` Page — Self-Contained Registration

File: `apps/beauty/src/app/join/page.tsx`

Replace the current redirect-to-admin with a self-contained multi-step registration form:

**Step 1 — Account** (email, password, confirm password, phone)
**Step 2 — Business Info** (business name, ABN optional, category, suburb, address)
**Step 3 — About** (bio/description up to 500 chars, website, Instagram)
**Step 4 — Review & Submit**

On submit:
- Call `POST /api/auth/register` with role = "provider"
- Then call `POST /api/providers` with business details
- On success: show "Application submitted! We'll review and approve your listing within 24 hours."
- Error handling for duplicate email, validation failures

### 3J — Provider Dashboard (Post-Login)

File: `apps/beauty/src/app/dashboard/page.tsx` (protected route)

After provider login (`POST /api/auth/login`), redirect to `/dashboard`:

Dashboard shows:
- Welcome header with business name
- Stats cards: Profile Views (mock), Enquiries (mock), Rating, Review Count
- Quick edit links: Edit Profile, Manage Gallery, View Reviews
- "Your profile is pending approval" banner if not approved
- "Complete your profile" checklist (categories selected, description added, photos uploaded)
- Link to view live profile (`/providers/[slug]`)

### 3K — Reusable Provider Card Component

File: `packages/ui/src/components/ProviderCard.tsx`

Create a shared, beautiful provider card used across all pages:
- Business name (prominent)
- Category badge (coloured pill)
- Suburb badge
- Star rating (visual stars + numeric, e.g., ⭐ 4.8)
- Review count
- Description snippet (2 lines, truncated)
- Verified badge (✓ Verified) if `isVerified`
- Hero image placeholder (gradient with emoji if no image)
- Hover state: subtle lift + shadow
- Click → navigate to `/providers/[slug]`
- Props: `provider: ProviderCardDto`

---

## TASK 4 — SEO Infrastructure

### 4A — Dynamic Sitemap

File: `apps/beauty/src/app/sitemap.ts`

Generate a sitemap including:
- Static pages: `/`, `/categories`, `/suburbs`, `/search`, `/join`, `/about`, `/contact`
- All category pages: `/category/{slug}` for each of 9 categories
- All suburb pages: `/[suburb]` for all seeded suburbs
- All suburb/category combos: `/[suburb]/[category]` for all combinations
- All provider pages: `/providers/{slug}` for all active providers

Set `changeFrequency` and `priority` appropriately:
- Homepage: `daily`, `1.0`
- Category pages: `daily`, `0.9`
- Suburb pages: `weekly`, `0.8`
- Provider pages: `weekly`, `0.7`

### 4B — Schema.org Structured Data

Create a utility `apps/beauty/src/lib/schema.ts` with functions:

```typescript
export function localBusinessSchema(provider: ProviderDto): object
export function breadcrumbSchema(items: {name: string, url: string}[]): object
export function itemListSchema(providers: ProviderCardDto[], listName: string): object
```

Inject these as `<script type="application/ld+json">` in page `<head>` via Next.js metadata or layout.

### 4C — Canonical URLs

Every page must have a canonical URL pointing to `https://beauty.appilico.com.au` (not vercel.app).
Set this via `generateMetadata` returning `{ alternates: { canonical: '...' } }` on every dynamic page.

---

## TASK 5 — Homepage: Connect to Real Data

Update the homepage (`apps/beauty/src/app/page.tsx`):

1. **Category section**: fetch from API, show real provider counts under each category
2. **Featured providers section**: fetch from `/api/providers/featured?platform=beauty&limit=6` and render real `ProviderCard` components instead of "Coming Soon"
3. **Stats section**: update to show real counts: total providers, total suburbs, categories
4. **Newsletter**: connect to a simple backend endpoint `POST /api/newsletter/subscribe` that saves email to DB

---

## TASK 6 — Backend: Provider Registration Endpoint

Ensure this flow works end-to-end:

### 6A — Register as Provider
```
POST /api/auth/register
Body: { email, password, firstName, lastName, phone, role: "provider" }
Response: { token, refreshToken, user: { id, email, role } }
```

### 6B — Create Provider Profile
```
POST /api/providers
Headers: Authorization: Bearer {token}
Body: { businessName, categorySlug, suburbSlug, description, address, phone, website?, instagram? }
Response: { provider: { id, slug, status: "pending" } }
```

### 6C — Admin Approval
In the admin platform (or via direct DB for now):
- New providers have `status = "pending"`
- Only `status = "active"` providers appear in public search
- Admin can change status to `"active"` | `"suspended"` | `"rejected"`

---

## TASK 7 — Type Safety & Shared Types

In `packages/shared/src/types/`, create/update:

```typescript
// provider.ts
export interface ProviderCardDto {
  id: string;
  slug: string;
  businessName: string;
  category: { name: string; slug: string; icon: string };
  suburb: { name: string; slug: string };
  description: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  heroImage?: string;
  status: 'pending' | 'active' | 'suspended';
}

export interface ProviderDetailDto extends ProviderCardDto {
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  address?: string;
  services: ServiceDto[];
  reviews: ReviewDto[];
  gallery: GalleryImageDto[];
  hours?: BusinessHoursDto;
  latitude?: number;
  longitude?: number;
}

// category.ts
export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  sortOrder: number;
  providerCount: number;
}

// suburb.ts
export interface SuburbDto {
  id: string;
  name: string;
  slug: string;
  postcode: string;
  latitude: number;
  longitude: number;
  providerCount?: number;
}

// review.ts
export interface ReviewDto {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  isVerified: boolean;
}

// api-response.ts
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

---

## TASK 8 — Error Handling & Loading States

Every data-fetching page must handle 3 states:
1. **Loading**: skeleton loaders (not spinners) that match the layout
2. **Error**: friendly error message + retry button
3. **Empty**: context-specific empty state with a CTA

Create skeleton components:
- `ProviderCardSkeleton` — matches ProviderCard layout, animated pulse
- `CategoryCardSkeleton`
- `SuburbCardSkeleton`

Use Next.js `loading.tsx` files for route-level skeletons and `error.tsx` for error boundaries.

---

## TASK 9 — Mobile Responsiveness Audit

Ensure ALL pages are fully responsive:
- Navigation: hamburger menu on mobile with slide-out drawer
- Provider cards: 1 column on mobile, 2 on tablet, 3 on desktop
- Category grid: 2 columns on mobile, 3 on tablet, 4–5 on desktop
- Search filters: collapsible panel on mobile (toggle button)
- Provider profile: tabs on mobile (not sidebar)
- Images: use `next/image` with proper `sizes` attribute everywhere
- Touch targets: minimum 44×44px for all interactive elements
- Test on 375px, 768px, 1280px viewports

---

## TASK 10 — Final Checklist Before Deployment

Before pushing, verify:

**Backend:**
- [ ] `GET /api/categories/beauty` returns 9 categories with counts
- [ ] `GET /api/locations/suburbs?platform=beauty` returns 50+ suburbs
- [ ] `GET /api/providers?platform=beauty&sort=rating` returns 15 providers
- [ ] `GET /api/providers/featured?platform=beauty&limit=6` returns 6 providers
- [ ] `GET /api/providers/slug/luxe-nails-subiaco` returns full provider detail
- [ ] CORS allows all frontend domains
- [ ] Health endpoint `/health` returns 200

**Frontend:**
- [ ] `/` homepage shows 6 featured providers and real category counts
- [ ] `/categories` shows 9 category cards with provider counts
- [ ] `/category/nails` shows nail providers in a grid
- [ ] `/suburbs` shows all suburbs in alphabetical grid
- [ ] `/subiaco` shows providers in Subiaco
- [ ] `/subiaco/nails` shows nail providers in Subiaco
- [ ] `/search?category=hair&suburb=fremantle` returns filtered results
- [ ] `/providers/luxe-nails-subiaco` shows full provider profile
- [ ] `/join` shows multi-step registration form (no redirect)
- [ ] Sitemap accessible at `/sitemap.xml` with 100+ URLs
- [ ] No console errors in browser
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] Lighthouse Performance ≥ 80, SEO ≥ 95

---

## CODING STANDARDS — Follow These Throughout

1. **TypeScript strict mode** — no `any` types
2. **Server Components by default** — use `"use client"` only when needed (event handlers, hooks)
3. **ISR caching** — `revalidate: 3600` on static/semi-static data, `no-store` on user-specific data
4. **Tailwind v4** — use CSS variables and the v4 utility classes, no custom CSS unless absolutely necessary
5. **Mobile-first** — write mobile styles first, then `sm:`, `md:`, `lg:` breakpoints
6. **Error boundaries** — wrap every async data fetch in try/catch, never crash the page
7. **Semantic HTML** — use `<article>`, `<section>`, `<nav>`, `<aside>`, `<main>` appropriately
8. **Accessible** — all images have `alt`, all interactive elements have focus styles, ARIA labels where needed
9. **Performance** — use `next/image` for all images, lazy load below-fold content
10. **Consistent naming** — file names in kebab-case, components in PascalCase, functions in camelCase

---

## DELIVERABLES

When complete, the following must all work on the live site:

1. ✅ Homepage shows real featured providers and category counts
2. ✅ /categories shows all 9 beauty categories with provider counts
3. ✅ /category/[slug] pages work for all 9 slugs
4. ✅ /suburbs shows all 50+ Perth suburbs
5. ✅ /[suburb] pages work for all seeded suburbs
6. ✅ /[suburb]/[category] combo pages work
7. ✅ /search works with category, suburb, and sort filters
8. ✅ /providers/[slug] shows full provider profiles
9. ✅ /join has a working self-contained registration form
10. ✅ Sitemap has 100+ URLs
11. ✅ No broken pages — every nav link works
12. ✅ Build passes with no TypeScript errors
13. ✅ API backend returns data on all endpoints

---

## IMPORTANT NOTES FOR AGENT

- Do not invent new tech stack choices — use what's already in the repo
- Do not change the database schema destructively — use migrations or add to existing seeder
- When in doubt, check the existing code in the repo before writing new files
- If an API endpoint already exists but is empty/broken, fix it — don't duplicate it
- Do not add any new npm packages unless absolutely essential and pre-approved
- Commit in logical chunks: backend seed → backend API fixes → frontend pages → SEO
- If you discover additional bugs not listed here, fix them and document what you found

---

*This prompt was generated for the Appilico Roadmap — Phase 1 Step 1*
*After completing this step, return to Claude with the updated repo for Phase 2 planning*
