# Development Phases

## Phase 1 – Foundation (COMPLETED)
- [x] Backend API with .NET 8 + EF Core + PostgreSQL
- [x] Auth system (JWT, roles, login/register)
- [x] Provider CRUD with categories and service areas
- [x] Three frontend apps (beauty, services, admin)
- [x] Docker deployment on VPS
- [x] Domain setup with SSL (nginx + certbot)
- [x] 517 real Perth beauty providers seeded from Google Places

## Phase 2 – Quality & Stability (IN PROGRESS)
- [x] E2E test suite with Playwright (beauty, admin, services)
- [x] API health check tests
- [x] Project documentation (PROJECT.md, DEPLOYMENT.md, TESTING.md)
- [x] Fix search page server component error
- [x] Fix ProviderCard categories handling
- [x] Fix pagination parameter spreading
- [ ] Run all E2E tests and fix failures
- [ ] Revoke leaked Google API key from git history

## Phase 3 – Admin Features
- [ ] Category CRUD in admin panel (add/edit/delete categories)
- [ ] Provider editing in admin (full form, not just status)
- [ ] Review management (approve/reject with notes)
- [ ] Enquiry reply system
- [ ] User role management
- [ ] Settings management (site name, contact, etc.)

## Phase 4 – Provider Experience
- [ ] Provider registration + claim flow
- [ ] Provider dashboard (edit profile, view stats)
- [ ] Service listing management
- [ ] Gallery image upload
- [ ] Business hours editor
- [ ] Social media links

## Phase 5 – Consumer Features
- [ ] Advanced search (filters, map view)
- [ ] Review submission with photos
- [ ] Favourites & bookmarks
- [ ] Enquiry form (contact provider)
- [ ] Suburb pages with SEO

## Phase 6 – Monetisation
- [ ] Stripe subscription integration
- [ ] Premium provider features
- [ ] Featured listing placements
- [ ] Analytics dashboard for providers

## Phase 7 – IT Services Marketplace
- [ ] Populate IT service providers
- [ ] IT-specific categories and features
- [ ] Service-specific search filters

---

### Workflow for Each Phase

1. Plan features in this document
2. Implement changes
3. Run `npm test` (E2E tests must pass)
4. Commit and push
5. Verify on production
6. Mark items as complete
