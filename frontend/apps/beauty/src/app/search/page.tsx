import Link from "next/link";
import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { generatePageMeta, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { FALLBACK_FEATURED_PROVIDERS } from "@/lib/fallback-providers";
import { SearchFormClient } from "@/components/search/SearchFormClient";

// Prevent Vercel from caching this page as static HTML
// Without this, URL params (suburb, category) are ignored
export const dynamic = 'force-dynamic';

export const metadata: Metadata = generatePageMeta({
  title: "Browse Beauty Providers in Perth",
  description: "Search and filter beauty professionals across Perth, Western Australia. Find nail salons, hair stylists, lash technicians, and more.",
  path: "/search",
});

const categoryFilters = [
  { label: "All", value: "" },
  { label: "Nails", value: "nails" },
  { label: "Hair", value: "hair" },
  { label: "Lashes", value: "lashes" },
  { label: "Brows", value: "brows" },
  { label: "Skin Care", value: "skin-care" },
  { label: "Makeup", value: "makeup" },
  { label: "Body", value: "body" },
  { label: "Massage", value: "massage" },
  { label: "Cosmetic", value: "cosmetic" },
  { label: "Wellness", value: "wellness" },
];

type SearchParams = { q?: string; suburb?: string; category?: string; sort?: string; sortBy?: string; page?: string; postCode?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.q || "";
  const suburb = params.suburb || "";
  const category = params.category || "";
  const postCode = params.postCode || "";
  // Support both ?sort= (legacy) and ?sortBy= (new); proximity auto-applies when postCode is set
  const sort = postCode ? (params.sort || params.sortBy || "distance") : (params.sort || params.sortBy || "rating");
  const page = parseInt(params.page || "1", 10);

  const apiParams = new URLSearchParams();
  if (query) apiParams.set("searchTerm", query);
  if (suburb) apiParams.set("suburb", suburb);
  if (postCode) apiParams.set("postCode", postCode);
  if (category) apiParams.set("category", category);
  apiParams.set("sortBy", sort);
  apiParams.set("page", String(page));
  apiParams.set("pageSize", "12");
  apiParams.set("marketplaceType", "0");

  const data = await fetchApi<{
    items: Array<{
      slug: string;
      businessName: string;
      tagline?: string;
      city?: string;
      state?: string;
      fullAddress?: string;
      phone?: string;
      website?: string;
      averageRating: number;
      totalReviews: number;
      logoUrl?: string;
      categories?: string[];
    }>;
    pagination: { currentPage: number; totalPages: number; totalCount: number };
  }>(`/providers/search?${apiParams.toString()}`, { revalidate: 60, tags: ["providers"] });

  const apiItems = data?.items ?? [];
  const items = apiItems.length > 0 ? apiItems : FALLBACK_FEATURED_PROVIDERS;
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalCount: items.length };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="mb-10 mt-6">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
          {query ? <>Results for &ldquo;<em>{query}</em>&rdquo;</> : "Browse Beauty Providers"}
          {suburb ? ` in ${suburb}` : postCode ? ` near ${postCode}` : ""}
        </h1>
        <p className="mt-2 text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          {pagination.totalCount} provider{pagination.totalCount !== 1 ? "s" : ""} found
          {sort === "distance" && postCode ? ` · sorted by distance from ${postCode}` : ""}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="p-5 mb-10 space-y-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <SearchFormClient
          defaultQuery={query}
          defaultSuburb={suburb}
          defaultSort={sort}
          defaultPostCode={postCode}
          defaultCategory={category}
          categoryOptions={categoryFilters}
        />

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => {
            const isActive = category === cat.value;
            const catParams = new URLSearchParams();
            if (query) catParams.set("q", query);
            if (suburb) catParams.set("suburb", suburb);
            if (postCode) catParams.set("postCode", postCode);
            if (cat.value) catParams.set("category", cat.value);
            catParams.set("sortBy", sort);
            const href = `/search?${catParams.toString()}`;
            return (
              <Link key={cat.value} href={href}
                className="px-3.5 py-1.5 text-[13px] font-medium transition-all"
                style={{
                  borderRadius: '50px',
                  fontFamily: 'var(--font-body)',
                  ...(isActive
                    ? { background: 'var(--brand-rose)', color: 'white' }
                    : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
                  ),
                }}
              >
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <ProviderCard key={p.slug} {...p} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-14">
              {page > 1 && (
                <Link href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(suburb ? { suburb } : {}), ...(category ? { category } : {}), sort, page: String(page - 1) }).toString()}`}
                  className="px-5 py-2.5 text-[13px] font-medium transition-all"
                  style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link href={`/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(suburb ? { suburb } : {}), ...(category ? { category } : {}), sort, page: String(page + 1) }).toString()}`}
                  className="px-5 py-2.5 text-[13px] font-medium transition-all"
                  style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <span className="text-[48px] block mb-4">🔍</span>
          <h3 className="text-[20px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>No providers found</h3>
          <p className="text-[14px] mt-2 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            {query
              ? `We couldn't find results for "${query}"${suburb ? ` in ${suburb}` : ""}. Try a different search term, remove the suburb filter, or browse by category below.`
              : suburb
              ? `No providers found in ${suburb} yet. Try searching nearby suburbs or browse all providers.`
              : "No beauty providers match your current filters. Try adjusting your search or browse by category."}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link href="/search" className="px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
              Browse All Providers
            </Link>
            <Link href="/categories" className="px-6 py-3 text-[14px] font-medium" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
              Browse Categories
            </Link>
            <Link href="/suburbs" className="px-6 py-3 text-[14px] font-medium" style={{ border: '1px solid var(--brand-gold)', borderRadius: '2px', color: 'var(--brand-gold)' }}>
              Browse Suburbs
            </Link>
          </div>
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", url: "/" },
        { name: "Search" },
      ])) }} />
    </div>
  );
}
