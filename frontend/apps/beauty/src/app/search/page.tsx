import Link from "next/link";
import type { Metadata } from "next";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs, EmptyState } from "@/components/ui";

export const metadata: Metadata = generatePageMeta({
  title: "Browse Beauty Providers in Perth",
  description: "Search and filter beauty professionals across Perth, Western Australia. Find nail salons, hair stylists, lash technicians, and more.",
  path: "/search",
});

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
  apiParams.set("providerType", "0"); // Beauty

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
  }>(`/providers?${apiParams.toString()}`, { revalidate: 60, tags: ["providers"] });

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { currentPage: 1, totalPages: 1, totalCount: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <h1 className="text-3xl font-display font-bold mb-2">
        {query ? `Results for "${query}"` : "Browse Beauty Providers"}
        {suburb ? ` in ${suburb}` : ""}
      </h1>
      <p className="text-gray-500 mb-8">{pagination.totalCount} providers found</p>

      {/* Filters */}
      <form className="flex flex-wrap gap-3 mb-8 bg-gray-50 p-4 rounded-xl">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search..."
          className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        />
        <input
          type="text"
          name="suburb"
          defaultValue={suburb}
          placeholder="Suburb"
          className="w-40 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/50 focus:outline-none"
        />
        <select name="sort" defaultValue={sort} className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-primary/50 focus:outline-none">
          <option value="rating">Top Rated</option>
          <option value="newest">Newest</option>
          <option value="name">A-Z</option>
          <option value="reviews">Most Reviewed</option>
        </select>
        <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors">
          Filter
        </button>
      </form>

      {/* Results */}
      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((p) => (
              <Link key={p.slug} href={`/provider/${p.slug}`} className="group bg-white rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                  <span className="text-5xl font-display text-rose-300">{p.businessName.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors truncate">{p.businessName}</h3>
                  {p.tagline && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{p.tagline}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-1 text-sm">
                      {p.averageRating > 0 ? (
                        <>
                          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                          <span className="font-medium">{p.averageRating.toFixed(1)}</span>
                          <span className="text-gray-400">({p.totalReviews})</span>
                        </>
                      ) : (
                        <span className="text-gray-400">New</span>
                      )}
                    </div>
                    {p.city && <span className="text-xs text-gray-400">{p.city}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-rose-200 transition-colors"
                >
                  Previous
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link
                  href={`/search?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                  className="px-4 py-2 rounded-lg border border-gray-200 hover:border-rose-200 transition-colors"
                >
                  Next
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="🔍"
          title="No providers found"
          description={query ? `No results for "${query}". Try different search terms or browse by category.` : "No beauty providers are listed yet. Check back soon!"}
        />
      )}
    </div>
  );
}
