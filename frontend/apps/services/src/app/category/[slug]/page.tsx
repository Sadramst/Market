import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi, providerSearchPath, type ProviderSearchResult } from "../../../lib/api";
import { findServiceCategory, serviceCategories } from "../../../lib/serviceCategories";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = findServiceCategory(slug);
  if (!category) return {};
  return {
    title: `${category.name} in Perth`,
    description: `Find Perth ${category.name.toLowerCase()} providers for business projects and technology support.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = findServiceCategory(slug);
  if (!category) notFound();

  const data = await fetchApi<ProviderSearchResult>(providerSearchPath({ category: slug, pageSize: "24", sortBy: "rating" }), { revalidate: 0, tags: ["services-providers", slug] });
  const providers = data?.items ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/categories" className="text-sm font-semibold text-blue-600 hover:text-blue-700">All categories</Link>
      <div className="mt-5 rounded-3xl bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_60%,#ecfeff_100%)] px-6 py-10 sm:px-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-sm font-bold text-white">{category.short}</div>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-950">{category.name} in Perth</h1>
        <p className="mt-3 max-w-2xl text-gray-500">{category.desc}</p>
        <form action="/search" className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <input type="hidden" name="category" value={category.slug} />
          <input name="q" placeholder={`Search ${category.name.toLowerCase()}`} className="flex-1 rounded-xl border border-gray-100 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">Search</button>
        </form>
      </div>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-950">Providers</h2>
          <Link href={`/search?category=${category.slug}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all</Link>
        </div>
        {providers.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {providers.map((provider) => (
              <Link key={provider.slug} href={`/provider/${provider.slug}`} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/[0.06]">
                <h3 className="font-semibold text-gray-950">{provider.businessName}</h3>
                <p className="mt-1 text-sm text-gray-400">{provider.city || "Perth"}</p>
                {provider.tagline && <p className="mt-4 line-clamp-2 text-sm text-gray-500">{provider.tagline}</p>}
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-6 py-12 text-center">
            <h3 className="text-lg font-semibold text-gray-950">Provider intake is open</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">This category is ready for sourced provider records and approved listings.</p>
            <Link href="/join" className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">List a service</Link>
          </div>
        )}
      </section>
    </div>
  );
}
