# Testing Guide

## Overview

Appilico Market uses **Playwright** for end-to-end testing against the deployed production sites. Tests validate that all pages load, authentication works, and core user flows function correctly.

## Quick Start

```bash
# Install (first time)
npm install
npx playwright install chromium

# Run all tests
npm test

# Run by app
npm run test:beauty
npm run test:admin
npm run test:services

# View HTML report
npm run test:report
```

## Test Structure

```
e2e/
├── beauty/
│   ├── pages.spec.ts   # All page loads, search, categories, pagination
│   ├── auth.spec.ts    # Login, dashboard access
│   └── api.spec.ts     # API endpoint health checks
├── admin/
│   └── admin.spec.ts   # Login, all dashboard pages, navigation, CRUD
└── services/
    └── services.spec.ts # All page loads, search, categories
```

## What's Tested

### Beauty App (beauty.appilico.com.au)
- Home page loads with nav links
- Search page: form, filters, category pills, pagination
- Category pages load with providers
- Provider detail pages show business info
- Static pages: about, contact, pricing, privacy, terms, join
- Login flow (valid + invalid credentials)
- Dashboard access after login
- API health: search, categories, suburbs, provider detail, auth

### Admin Panel (admin.appilico.com.au)
- Login page with form validation
- Dashboard with stats cards
- All 9 dashboard pages load without errors
- Provider list with status filters
- Category display (Beauty + IT)
- User management with search
- Settings page with inputs
- Data imports page with CSV editor
- Full navigation flow through all pages

### Services App (service.appilico.com.au)
- Home page loads
- Search page with form
- Categories page
- Category detail pages
- Provider detail pages
- Join page
- No error on any page

## Configuration

Tests are configured in `playwright.config.ts`:
- **Browser**: Chromium (headless)
- **Viewport**: 1440×900
- **Timeout**: 30s per test
- **Retries**: 1
- **Screenshots**: Only on failure
- **Traces**: On first retry

## Pre-Deploy Workflow

```
1. Make code changes
2. Run: npm test
3. All tests green? → git push
4. Tests fail? → Fix issues first
```

## Adding New Tests

1. Create a `.spec.ts` file in the appropriate `e2e/{app}/` directory
2. Use `test.describe()` to group related tests
3. For authenticated tests, create a `login()` helper in `test.beforeEach()`
4. Run your new test file: `npx playwright test e2e/{app}/your-test.spec.ts`

## Test Credentials

Tests use the default admin account:
- **Email**: admin@appilico.com.au
- **Password**: Admin123!
