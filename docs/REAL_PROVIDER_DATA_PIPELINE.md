# Real Provider Data Pipeline

Appilico must not ship invented provider profiles as real marketplace supply. Real provider records need source provenance, validation, deduplication, admin review, and a claim path before they are treated as reliable marketplace inventory.

## Current Implementation

- Admin API: `POST /api/provider-imports/preview` previews CSV rows for SuperAdmin and Moderator users.
- Admin API: `POST /api/provider-imports/run` imports valid CSV rows for SuperAdmin users.
- Admin UI: `/dashboard/imports` uploads or pastes CSV, previews row quality, shows validation issues, and imports valid rows.
- Backend service: `ProviderImportService` parses, validates, scores, and upserts providers.
- Provider records are deduplicated by generated or supplied slug.
- Imported providers are marked `HasRealData = true` and keep source details in `DataSource` plus `AdminNotes`.
- Imported providers are pending by default. Admins can explicitly approve during import or from provider operations.

## Required CSV Fields

Minimum fields for a valid real provider row:

- `business_name`
- `category_slugs`
- `source_url`
- At least one of `phone`, `email`, `website`, `instagram`, or `facebook`

Recommended fields:

- `service_area_slugs`
- `services`
- `source_name`
- `full_address` or `address`
- `city`, `state`, `post_code`
- `rating`, `review_count`
- `tagline`, `description`

Example:

```csv
business_name,category_slugs,service_area_slugs,services,source_name,source_url,website,instagram,phone,city,state,post_code,rating,review_count
Subiaco Glow,nails,subiaco,gel manicure;pedicure,Google Business Profile,https://example.com/subiaco-glow,https://subiacoglow.example,@subiacoglow,(08) 9000 1111,Subiaco,WA,6008,4.7,28
```

## Validation Rules

- Source URL is mandatory for every real row.
- Category slugs must already exist in the platform taxonomy.
- Service area slugs must match known suburbs when supplied.
- Website, social, and source links must be absolute HTTP or HTTPS URLs.
- Phone numbers must fit the provider schema.
- Ratings must be between 0 and 5.
- Duplicate slugs in one import are rejected.

## 1000+ Provider Target

The right path to 1000+ real beauty providers is batch ingestion through this workflow:

1. Collect public business data from permitted sources with source URLs and collection dates.
2. Normalize categories, suburb slugs, contact links, and service names into the CSV schema.
3. Preview in `/dashboard/imports` and fix rejected rows before import.
4. Import valid rows as pending unless a trusted admin has manually vetted the batch.
5. Approve listings from `/dashboard/providers` after spot checks.
6. Allow owners to claim source-backed listings from public provider pages.

Do not add rows without provenance. Do not mark owner verification unless the owner has claimed or supplied verification material.

## Future Hardening

- Add dedicated source URL and collection date columns on `Provider` or a `ProviderDataSource` child table.
- Add import batch history with actor, file checksum, and row-level audit trail.
- Add phone normalization for Australian formats before schema validation.
- Add duplicate matching by normalized business name, phone, website, Instagram, and suburb.
- Add an owner-claim moderation queue in admin.
