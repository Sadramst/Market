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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <div className="mb-12 mt-6">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
          All <em>Categories</em>
        </h1>
        <p className="mt-2 text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Browse all beauty service types available in Perth</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {BEAUTY_CATEGORIES.map((cat, i) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}
            className={`premium-card group relative overflow-hidden animate-fade-in-up bg-gradient-to-br ${cat.gradient}`}
            style={{ borderRadius: '8px', border: '1px solid var(--border)', animationDelay: `${i * 0.04}s` }}
          >
            <div className="p-7">
              <div className="flex items-start justify-between mb-5">
                <span className="text-[40px] group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>
                  Explore →
                </span>
              </div>
              <h2 className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>{cat.name}</h2>
              <p className="text-[13px] font-light mt-1.5 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{cat.description}</p>
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <span className="text-[12px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                  {counts[i] > 0 ? `${counts[i]} provider${counts[i] !== 1 ? "s" : ""}` : "Coming soon"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
