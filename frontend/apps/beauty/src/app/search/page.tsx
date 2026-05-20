import Link from "next/link";
import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { ProviderCard } from "@/components/providers/ProviderCard";

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
  { label: "Wellness", value: "wellness" },
];

type SearchParams = { q?: string; suburb?: string; category?: string; sort?: string; page?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.q || "";
  const suburb = params.suburb || "";
  const category = params.category || "";
  const sort = params.sort || "rating";
  const page = parseInt(params.page || "1", 10);

  const apiParams = new URLSearchParams();
  if (query) apiParams.set("searchTerm", query);
  if (suburb) apiParams.set("suburb", suburb);
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
      averageRating: number;
      totalReviews: number;
      logoUrl?: string;
    }>;
    pagination: { currentPage: number; totalPages: number; totalCount: number };
  }>(`/providers/search?${apiParams.toString()}`, { revalidate: 60, tags: ["providers"] });

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalCount: 0 };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="mb-12">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Search</span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
          {query ? `Results for \u201c${query}\u201d` : "Browse Beauty Providers"}
          {suburb ? ` in ${suburb}` : ""}
        </h1>
        <p className="text-gray-400 mt-2 text-[15px]">{pagination.totalCount} provider{pagination.totalCount !== 1 ? "s" : ""} found</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100/80 p-5 mb-10 space-y-4">
        <form className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" name="q" defaultValue={query} placeholder="Search services, salons..." className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-transparent border border-gray-100 focus:ring-0 focus:border-primary/30 focus:outline-none text-gray-900 placeholder:text-gray-300 text-[15px] transition-all" />
          </div>
          <div className="relative sm:w-48">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            <input type="text" name="suburb" defaultValue={suburb} placeholder="Suburb" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-transparent border border-gray-100 focus:ring-0 focus:border-primary/30 focus:outline-none text-gray-900 placeholder:text-gray-300 text-[15px] transition-all" />
          </div>
          <select name="sort" defaultValue={sort} className="px-4 py-3.5 rounded-xl bg-transparent border border-gray-100 text-[13px] text-gray-700 focus:ring-0 focus:outline-none sm:w-44">
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="name">A-Z</option>
            <option value="reviews">Most Reviewed</option>
          </select>
          <button type="submit" className="px-8 py-3.5 bg-gray-900 text-white rounded-xl text-[15px] font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] shrink-0">
            Search
          </button>
        </form>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => {
            const isActive = category === cat.value;
            const href = cat.value
              ? `/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(suburb ? { suburb } : {}), category: cat.value, sort }).toString()}`
              : `/search?${new URLSearchParams({ ...(query ? { q: query } : {}), ...(suburb ? { suburb } : {}), sort }).toString()}`;
            return (
              <Link
                key={cat.value}
                href={href}
                className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all ${isActive ? "bg-gray-900 text-white shadow-sm" : "bg-blush text-gray-600 hover:bg-primary/10 hover:text-primary border border-transparent"}`}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((p) => (
              <ProviderCard key={p.slug} {...p} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-14">
              {page > 1 && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                  className="px-5 py-2.5 rounded-xl border border-gray-100 hover:border-primary/20 hover:text-primary transition-all text-[13px] font-medium text-gray-500"
                >
                  \u2190 Previous
                </Link>
              )}
              <span className="px-4 py-2 text-[13px] text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                  className="px-5 py-2.5 rounded-xl border border-gray-100 hover:border-primary/20 hover:text-primary transition-all text-[13px] font-medium text-gray-500"
                >
                  Next \u2192
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100/80">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blush flex items-center justify-center mb-5">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900">No providers found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto text-[15px]">
            {query ? `No results for \u201c${query}\u201d. Try different search terms or browse by category.` : "No beauty providers are listed yet. Check back soon!"}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link href="/search" className="px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-colors">
              Clear Filters
            </Link>
            <Link href="/categories" className="px-6 py-3 border border-gray-100 text-gray-600 rounded-xl text-[13px] font-medium hover:border-primary/20 hover:text-primary transition-colors">
              Browse Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
