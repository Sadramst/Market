import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  providerCount: number;
  subCategories: Array<{ id: string; name: string; slug: string; providerCount: number }>;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchApi<Category>(`/categories/${slug}`, { revalidate: 3600 });
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} — Beauty Services in Perth`,
    description: category.description || `Find the best ${category.name.toLowerCase()} services in Perth, WA. Browse providers, compare prices, and read reviews.`,
    alternates: { canonical: `https://beauty.appilico.com.au/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await fetchApi<Category>(`/categories/${slug}`, { revalidate: 3600, tags: ["category", slug] });
  if (!category) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number }>;
    pagination: { totalCount: number };
  }>(`/providers/search?category=${slug}&marketplaceType=0&pageSize=12`, { revalidate: 300, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]} />

        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">{category.name}</h1>
        {category.description && <p className="text-gray-400 mb-4">{category.description}</p>}
        <p className="text-sm text-gray-300 mb-8">{totalCount} provider{totalCount !== 1 ? "s" : ""} in this category</p>

        {/* Sub-categories */}
        {category.subCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {category.subCategories.map((sub) => (
              <Link
                key={sub.slug}
                href={`/category/${sub.slug}`}
                className="px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-all hover:shadow-sm"
              >
                {sub.name} ({sub.providerCount})
              </Link>
            ))}
          </div>
        )}

        {/* Providers */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p, i) => (
              <Link key={p.slug} href={`/provider/${p.slug}`} className="premium-card group bg-white rounded-2xl border border-gray-100 hover:border-rose-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-display gradient-text">{p.businessName.charAt(0)}</span>
                    </div>
                  </div>
                  {p.averageRating > 0 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                      <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-xs font-semibold text-gray-700">{p.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-lg truncate">{p.businessName}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    {p.averageRating > 0 ? (
                      <span className="text-gray-400">{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</span>
                    ) : (
                      <span className="text-primary/60 text-xs font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                    )}
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
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-5">
              <span className="text-3xl">💅</span>
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">No {category.name.toLowerCase()} providers yet</h3>
            <p className="text-gray-400 mt-2">Be the first to list your business in this category!</p>
            <Link href="/join" className="inline-block mt-5 px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors">
              List Your Business
            </Link>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd(category)) }}
      />
    </>
  );
}
