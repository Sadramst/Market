import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { BEAUTY_CATEGORIES, findCategory } from "@/lib/categories";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { CategorySuburbFilter } from "@/components/category/CategorySuburbFilter";

// Force dynamic rendering so category pages always fetch fresh data
export const dynamic = "force-dynamic";

const CATEGORY_GRADIENTS: Record<string, string> = {
  nails: "linear-gradient(135deg, #E8A8AD, #C8737A)",
  hair: "linear-gradient(135deg, #E8D5B0, #C9A96E)",
  lashes: "linear-gradient(135deg, #C4A8C8, #9B7B84)",
  brows: "linear-gradient(135deg, #E8A8AD, #C8737A)",
  "skin-care": "linear-gradient(135deg, #A8C8B0, #7B9B84)",
  makeup: "linear-gradient(135deg, #D4A0A8, #A35560)",
  body: "linear-gradient(135deg, #E8A8C0, #C8737A)",
  massage: "linear-gradient(135deg, #B8D4D4, #6B9B9B)",
  cosmetic: "linear-gradient(135deg, #C4A8C8, #9B7B84)",
  wellness: "linear-gradient(135deg, #A8C8B8, #7B9B8C)",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.displayName} in Perth, WA | Appilico Beauty`,
    description: `Find the best ${cat.displayName.toLowerCase()} in Perth, Western Australia. ${cat.description}. Compare providers, read reviews and get in touch.`,
    alternates: { canonical: `https://beauty.appilico.com.au/category/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = findCategory(slug);
  if (!cat) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string; categories?: string[] }>;
    pagination: { totalCount: number };
  }>(`/providers/search?category=${slug}&marketplaceType=0&pageSize=24`, { revalidate: 60, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      {/* Hero */}
      <section className="py-16" style={{ background: CATEGORY_GRADIENTS[cat.slug] || "var(--bg-secondary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: cat.name }]} />
          <div className="mt-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <CategoryIcon category={cat.slug} className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>{cat.name}</h1>
              <p className="text-[15px] font-light mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{cat.description}</p>
            </div>
          </div>
          <p className="mt-4 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>{totalCount} provider{totalCount !== 1 ? "s" : ""} in this category</p>
          <div className="mt-6">
            <CategorySuburbFilter categorySlug={cat.slug} />
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {providers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((p) => (
                <ProviderCard key={p.slug} {...p} />
              ))}
            </div>
            {totalCount > providers.length && (
              <div className="text-center mt-10">
                <Link href={`/search?category=${slug}`} className="inline-block px-8 py-3 text-[14px] font-medium transition-all" style={{ border: '1px solid var(--brand-rose)', color: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
                  View All {totalCount} {cat.name} Providers →
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <CategoryIcon category={cat.slug} className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--brand-rose)' }} strokeWidth={1.5} />
            <h3 className="text-[20px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>No {cat.name.toLowerCase()} providers yet</h3>
            <p className="text-[14px] mt-2 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Be the first to list your business in this category!</p>
            <Link href="/join" className="inline-block mt-6 px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
              List Your Business
            </Link>
          </div>
        )}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd({ name: cat.name, slug: cat.slug })) }} />
    </>
  );
}
