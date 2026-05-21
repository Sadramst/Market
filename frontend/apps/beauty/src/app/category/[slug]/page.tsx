import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { BEAUTY_CATEGORIES, findCategory } from "@/lib/categories";
import { ProviderCard } from "@/components/providers/ProviderCard";

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
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string; categories?: string[] }>;
    pagination: { totalCount: number };
  }>(`/providers/search?category=${slug}&marketplaceType=0&pageSize=12`, { revalidate: 300, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      {/* Hero */}
      <section className={`py-16 bg-gradient-to-br ${cat.gradient}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories", href: "/categories" }, { label: cat.name }]} />
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[48px]">{cat.icon}</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>{cat.name}</h1>
              <p className="text-[15px] font-light mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{cat.description}</p>
            </div>
          </div>
          <p className="mt-4 text-[13px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>{totalCount} provider{totalCount !== 1 ? "s" : ""} in this category</p>
        </div>
      </section>

      {/* Providers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <ProviderCard key={p.slug} {...p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
            <span className="text-[48px] block mb-4">{cat.icon}</span>
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
