import type { Metadata } from "next";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = generatePageMeta({
  title: "Beauty Categories — All Services",
  description: "Browse all beauty service categories in Perth. Find nail salons, hair stylists, lash technicians, brow artists, skin clinics, and more.",
  path: "/categories",
});

export default async function CategoriesPage() {
  // Fetch provider counts per category in parallel (graceful fallback)
  const counts = await Promise.all(
    BEAUTY_CATEGORIES.map(async (cat) => {
      const data = await fetchApi<{ pagination: { totalCount: number } }>(
        `/providers/search?category=${cat.slug}&marketplaceType=0&pageSize=1`,
        { revalidate: 3600, tags: ["categories", cat.slug] }
      );
      return data?.pagination?.totalCount ?? 0;
    })
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">Beauty Categories</h1>
      <p className="text-gray-400 mb-10">Browse all beauty service types available in Perth</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BEAUTY_CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="premium-card group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-rose-200 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-50/80 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center shrink-0">
                <span className="text-3xl">{cat.icon}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-display font-bold text-gray-900 group-hover:text-primary transition-colors">{cat.name}</h2>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {counts[i] > 0 ? `${counts[i]} provider${counts[i] !== 1 ? "s" : ""}` : "New"}
                  </span>
                  <span className="text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                    Browse
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
