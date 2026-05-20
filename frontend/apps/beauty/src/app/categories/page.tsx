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
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <div className="mb-12">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Explore</span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Beauty Categories</h1>
        <p className="text-gray-400 mt-2 text-[15px]">Browse all beauty service types available in Perth</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BEAUTY_CATEGORIES.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="premium-card group relative bg-white rounded-2xl border border-gray-100/80 overflow-hidden animate-fade-in-up"
            style={{ animationDelay: `${i * 0.04}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-7">
              <div className="flex items-start justify-between mb-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blush to-primary-light/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <span className="text-3xl">{cat.icon}</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary text-[13px] font-medium opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                  Explore
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </div>
              <h2 className="text-lg font-display font-bold text-gray-900 group-hover:text-primary transition-colors duration-200">{cat.name}</h2>
              <p className="text-[13px] text-gray-400 mt-1.5 leading-relaxed">{cat.description}</p>
              <div className="mt-4 pt-4 border-t border-gray-50">
                <span className="text-[12px] text-gray-400">
                  {counts[i] > 0 ? `${counts[i]} provider${counts[i] !== 1 ? "s" : ""}` : "New category"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
