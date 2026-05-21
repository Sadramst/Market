import type { Metadata } from "next";
import Link from "next/link";
import { fetchApi, providerSearchPath, type ProviderSearchResult, type ProviderSummary } from "../../lib/api";
import { serviceCategories } from "../../lib/serviceCategories";

export const metadata: Metadata = {
  title: "Browse IT Professionals",
  description: "Search Perth IT professionals, developers, designers, cloud engineers, consultants, and support providers.",
};

type SearchParams = { q?: string; category?: string; page?: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.category || "";
  const page = params.page || "1";

  const data = await fetchApi<ProviderSearchResult>(providerSearchPath({
    ...(query ? { searchTerm: query } : {}),
    ...(category ? { category } : {}),
    page,
    pageSize: "12",
    sortBy: "rating",
  }), { revalidate: 60, tags: ["services-providers"] });

  const items = data?.items ?? [];
  const pagination = data?.pagination ?? { currentPage: Number(page), totalPages: 1, totalCount: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Browse</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-950">{query ? `Results for "${query}"` : "IT professionals in Perth"}</h1>
        <p className="mt-2 text-gray-500">{pagination.totalCount} provider{pagination.totalCount === 1 ? "" : "s"} found</p>
      </div>

      <form className="mb-8 grid gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg shadow-blue-900/[0.04] md:grid-cols-[1fr_240px_auto]">
        <input name="q" defaultValue={query} placeholder="Search service, provider, or technology" className="rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20" />
        <select name="category" defaultValue={category} className="rounded-xl bg-gray-50 px-4 py-3 text-sm outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-blue-500/20">
          <option value="">All categories</option>
          {serviceCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
        </select>
        <button className="rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700">Search</button>
      </form>

      {items.length > 0 ? (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((provider) => <ProviderResult key={provider.slug} provider={provider} />)}
          </div>
          {pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3 text-sm">
              {pagination.currentPage > 1 && <Link href={`/search?${new URLSearchParams({ ...params, page: String(pagination.currentPage - 1) }).toString()}`} className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:border-blue-200 hover:text-blue-600">Previous</Link>}
              <span className="text-gray-400">Page {pagination.currentPage} of {pagination.totalPages}</span>
              {pagination.currentPage < pagination.totalPages && <Link href={`/search?${new URLSearchParams({ ...params, page: String(pagination.currentPage + 1) }).toString()}`} className="rounded-lg border border-gray-200 px-4 py-2 text-gray-600 hover:border-blue-200 hover:text-blue-600">Next</Link>}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-14 text-center">
          <h2 className="text-xl font-semibold text-gray-950">No providers matched</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">Try another service term or browse the category list while new Perth providers are added.</p>
          <Link href="/categories" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Browse categories</Link>
        </div>
      )}
    </div>
  );
}

function ProviderResult({ provider }: { provider: ProviderSummary }) {
  return (
    <Link href={`/provider/${provider.slug}`} className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm shadow-gray-900/[0.02] transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.06]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-950 group-hover:text-blue-600">{provider.businessName}</h2>
          <p className="mt-1 text-sm text-gray-400">{provider.city || "Perth"}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">{provider.isVerified ? "Verified" : provider.hasRealData ? "Source checked" : "New"}</span>
      </div>
      {provider.tagline && <p className="line-clamp-2 text-sm leading-6 text-gray-500">{provider.tagline}</p>}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
        <span className="font-semibold text-gray-700">{provider.averageRating > 0 ? `${provider.averageRating.toFixed(1)} rating` : "Rating pending"}</span>
        <span className="text-blue-600">Open profile</span>
      </div>
    </Link>
  );
}
