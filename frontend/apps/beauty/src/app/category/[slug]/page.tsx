import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { BEAUTY_CATEGORIES, findCategory } from "@/lib/categories";

export async function generateStaticParams() {
  return BEAUTY_CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} — Beauty Services in Perth`,
    description: `Find the best ${cat.name.toLowerCase()} services in Perth, WA. Browse providers, compare prices, and read reviews.`,
    alternates: { canonical: `https://beauty.appilico.com.au/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number; description?: string }>;
    pagination: { totalCount: number };
  }>(`/providers/search?category=${slug}&marketplaceType=0&pageSize=12`, { revalidate: 300, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: cat.name },
        ]} />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush to-primary-light/50 flex items-center justify-center">
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Category</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">{cat.name}</h1>
            </div>
          </div>
          <p className="text-gray-400 text-[15px]">{cat.description}</p>
          <p className="text-[13px] text-gray-300 mt-2">{totalCount} provider{totalCount !== 1 ? "s" : ""} in this category</p>
        </div>

        {/* Providers */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p, i) => (
              <Link key={p.slug} href={`/provider/${p.slug}`} className="premium-card group bg-white rounded-2xl border border-gray-100/80 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[5/4] bg-gradient-to-br from-blush via-pink-50/50 to-cream relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                      <span className="text-2xl font-display gradient-text font-bold">{p.businessName.charAt(0)}</span>
                    </div>
                  </div>
                  {p.averageRating > 0 && (
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                      <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <span className="text-[11px] font-bold text-gray-700">{p.averageRating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-[15px] text-gray-900 group-hover:text-primary transition-colors truncate">{p.businessName}</h3>
                  <div className="flex items-center justify-between mt-3">
                    {p.averageRating > 0 ? (
                      <span className="text-[11px] text-gray-400">{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</span>
                    ) : (
                      <span className="text-[11px] text-primary/60 font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                    )}
                    {p.city && (
                      <span className="text-[11px] text-gray-300 flex items-center gap-1">
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
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100/80">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-blush flex items-center justify-center mb-5">
              <span className="text-3xl">{cat.icon}</span>
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900">No {cat.name.toLowerCase()} providers yet</h3>
            <p className="text-gray-400 mt-2 text-[15px]">Be the first to list your business in this category!</p>
            <Link href="/join" className="inline-block mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-colors">
              List Your Business
            </Link>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd({ name: cat.name, slug: cat.slug })) }}
      />
    </>
  );
}
