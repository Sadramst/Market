# Project Page Coverage

This document tracks the page routes that must exist across the Appilico apps. The route manifest test at `frontend/apps/beauty/src/__tests__/route-manifest.test.ts` checks these routes so linked pages do not quietly become 404s.

## Beauty App

- `/`
- `/search`
- `/categories`
- `/category/[slug]`
- `/suburbs`
- `/[suburb]`
- `/[suburb]/[category]`
- `/provider/[slug]`
- `/claim/[slug]`
- `/join`
- `/login`
- `/dashboard`
- `/about`
- `/contact`
- `/privacy`
- `/terms`

## Services App

- `/`
- `/search`
- `/categories`
- `/category/[slug]`
- `/provider/[slug]`
- `/join`

The services app now has real route files behind all header, footer, homepage category, search, and provider-result links.

## Admin App

- `/`
- `/dashboard`
- `/dashboard/providers`
- `/dashboard/reviews`
- `/dashboard/enquiries`
- `/dashboard/categories`
- `/dashboard/imports`
- `/dashboard/users`
- `/dashboard/reports`
- `/dashboard/settings`

## Test Checklist

- Run `npm test --workspace=@appilico/beauty` after route changes.
- Run frontend builds from `frontend` before deployment.
- For backend import changes, run backend unit tests and check the provider import service tests.
- After production deploy, verify API health and at least one protected admin route returns `401` when unauthenticated.
