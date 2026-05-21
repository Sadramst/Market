# Appilico Phase 5 Platform Audit Report

Date: 2026-05-21

## Executive Summary

Appilico has moved beyond an MVP foundation: the repository contains a modular .NET 8 backend, a Turborepo frontend with Beauty, Services, and Admin apps, live PostgreSQL-backed provider data, SEO routes for the Beauty marketplace, authentication, provider claims, reviews, enquiries, and a seeded Perth beauty supply layer.

The largest verified production risk before this pass was operational maturity: the admin app had several live pages that were static or pointed at missing backend endpoints. This made moderation, reporting, user review, enquiry oversight, and settings management too fragile for a serious marketplace. This pass prioritised the operational command center because it is the control plane required before scaling provider density, public SEO, and multi-marketplace operations.

## Critical Problems

- Admin dashboard inferred stats from public search endpoints instead of a dedicated platform analytics API.
- Admin reviews page called a missing `GET /api/reviews` endpoint.
- Admin providers page used the public provider search endpoint, which only returns approved providers and cannot power an approval queue.
- Admin users page was hardcoded static content.
- Admin reports page was a static empty table despite a `Report` domain entity existing.
- Admin settings page was read-only and disconnected from the existing `AppSetting` entity.
- Enquiries existed for provider owners, but admins had no platform-wide enquiry visibility.
- The enquiry table had no migration, which would break production writes after deployment.

## Medium Problems

- Services marketplace is still a landing page rather than a full IT services marketplace.
- IT service request and offer entities exist, but no application services or controllers expose them yet.
- Provider dashboard remains incomplete compared with the roadmap goal of full provider self-serve operations.
- Email delivery is still console-backed and needs a production email provider before customer/provider notification workflows can be trusted.
- Media upload is local-disk backed and should move behind cloud storage before horizontal scaling.
- Search uses basic relational filtering rather than full-text ranking or trigram matching.

## Low Priority Problems

- Some admin UI tables need richer bulk actions after the underlying workflows settle.
- Settings need audit history for changed values.
- Admin activity feed is intentionally lightweight and should eventually be backed by explicit audit events.
- Category and suburb provider counts are denormalised and can drift without background jobs.

## Scalability Risks

- In-memory rate limiting is not safe for multi-instance API deployment.
- Local image storage is not durable across instances or redeploys.
- Provider search includes related services, galleries, and service areas; this should be split into tuned read models as provider volume grows.
- Marketplace analytics should eventually move from aggregate live SQL counts to cached daily rollups.
- Admin operations need explicit audit logs for approval, review, report, and settings changes.

## SEO Weaknesses

- Beauty has strong route coverage, but scalable SEO content templates and FAQ/review schema still need expansion.
- Services app needs sitemap, robots, category pages, provider pages, and request landing pages.
- The existing `SeoPage` entity is not yet used for DB-managed metadata overrides.
- Related provider and nearby provider linking should be deepened on provider/category/suburb pages.

## Frontend Inconsistencies

- Beauty is the most complete marketplace experience.
- Admin now has real operational data flows, but table density and mobile ergonomics should continue to improve.
- Services needs a full B2B SaaS-style product architecture, not only a marketing landing page.

## Backend Limitations

- The codebase follows a clean modular monolith shape, but several newer operational workflows need service-level audit logging.
- CQRS-lite should be introduced selectively for provider search, admin analytics, and SEO page generation.
- Notification and background job abstractions exist mostly as domain intentions, not production workflows.

## Implemented In This Pass

- Added dedicated admin dashboard stats API.
- Added admin user listing API.
- Added platform-wide report API with create and moderation status update flows.
- Added settings API backed by `AppSetting` defaults and SuperAdmin updates.
- Added admin all-reviews API and corrected review status update contract.
- Added admin all-enquiries API.
- Added readable enum JSON serialization for stable frontend status handling.
- Added provider list status and created date fields for admin operations.
- Added EF configuration and migration for `Enquiries`, including status and date indexes.
- Replaced static/fake admin pages with live dashboard, providers, reviews, users, reports, settings, and enquiries views.

## Recommended Next Milestones

1. Beauty marketplace premium redesign: homepage storytelling, provider profile conversion upgrades, richer search UX, and related/nearby provider sections.
2. Provider dashboard: profile editor, services manager, gallery manager, review management, enquiry inbox, and analytics.
3. Services marketplace foundation: IT provider browse/search, service request creation, provider offer flow, sitemap/robots, and seeded IT provider data.
4. Production infrastructure: email provider, cloud media storage, background jobs, and Redis-backed rate limiting/cache.
5. SEO engine: DB-backed metadata overrides, FAQ schema, review schema, and local landing content templates.
