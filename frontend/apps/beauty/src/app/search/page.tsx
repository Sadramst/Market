import Link from "next/link";
import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";

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
  apiParams.set("providerType", "0");

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">
          {query ? `Results for "${query}"` : "Browse Beauty Providers"}
          {suburb ? ` in ${suburb}` : ""}
        </h1>
        <p className="text-gray-400">{pagination.totalCount} provider{pagination.totalCount !== 1 ? "s" : ""} found</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 space-y-4">
        <form className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" name="q" defaultValue={query} placeholder="Search services, salons..." className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none focus:bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-all" />
          </div>
          <div className="relative sm:w-48">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
            <input type="text" name="suburb" defaultValue={suburb} placeholder="Suburb" className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 focus:ring-2 focus:ring-primary/30 focus:border-primary/30 focus:outline-none focus:bg-white text-gray-900 placeholder:text-gray-400 text-sm transition-all" />
          </div>
          <select name="sort" defaultValue={sort} className="px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-sm text-gray-700 focus:ring-2 focus:ring-primary/30 focus:outline-none sm:w-44">
            <option value="rating">Top Rated</option>
            <option value="newest">Newest</option>
            <option value="name">A-Z</option>
            <option value="reviews">Most Reviewed</option>
          </select>
          <button type="submit" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-dark transition-all hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]">
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
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-sm" : "bg-gray-50 text-gray-500 hover:bg-rose-50 hover:text-primary border border-gray-100"}`}
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
            {items.map((p, i) => (
              <Link key={p.slug} href={`/provider/${p.slug}`} className="premium-card group bg-white rounded-2xl border border-gray-100 hover:border-rose-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/50 relative overflow-hidden">
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
                        <span className="text-2xl font-display gradient-text">{p.businessName.charAt(0)}</span>
                      </div>
                    </div>
                  )}
                  {p.averageRating > 0 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-xs font-semibold text-gray-700">{p.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-lg truncate">{p.businessName}</h3>
                  {p.tagline && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{p.tagline}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      {p.averageRating > 0 ? (
                        <span>{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-primary/60 text-xs font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    {p.city && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {p.city}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              {page > 1 && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:border-rose-200 hover:text-primary transition-all text-sm font-medium text-gray-600"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-400">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                  className="px-4 py-2 rounded-xl border border-gray-200 hover:border-rose-200 hover:text-primary transition-all text-sm font-medium text-gray-600"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-xl font-display font-bold text-gray-900">No providers found</h3>
          <p className="text-gray-400 mt-2 max-w-md mx-auto">
            {query ? `No results for "${query}". Try different search terms or browse by category.` : "No beauty providers are listed yet. Check back soon!"}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <Link href="/search" className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors">
              Clear Filters
            </Link>
            <Link href="/categories" className="px-5 py-2 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:border-rose-200 hover:text-primary transition-colors">
              Browse Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
