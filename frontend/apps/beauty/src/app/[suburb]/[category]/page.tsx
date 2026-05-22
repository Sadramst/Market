import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { BEAUTY_CATEGORIES, findCategory } from "@/lib/categories";
import { PERTH_SUBURBS, findSuburb } from "@/lib/suburbs";

export function generateStaticParams() {
  const params: Array<{ suburb: string; category: string }> = [];
  for (const s of PERTH_SUBURBS) {
    for (const c of BEAUTY_CATEGORIES) {
      params.push({ suburb: s.slug, category: c.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ suburb: string; category: string }> }): Promise<Metadata> {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const suburb = findSuburb(suburbSlug);
  const cat = findCategory(catSlug);
  if (!suburb || !cat) return { title: "Not Found" };
  return {
    title: `${cat.displayName} in ${suburb.name}, Perth WA | Appilico`,
    description: `Find the best ${cat.displayName.toLowerCase()} in ${suburb.name}, ${suburb.postCode}. ${cat.description}. Compare providers, read reviews and get in touch.`,
    alternates: { canonical: `https://beauty.appilico.com.au/${suburbSlug}/${catSlug}` },
  };
}

export default async function SuburbCategoryPage({ params }: { params: Promise<{ suburb: string; category: string }> }) {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const cat = findCategory(catSlug);
  const suburb = findSuburb(suburbSlug);
  if (!suburb || !cat) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; averageRating: number; totalReviews: number; city?: string; logoUrl?: string; tagline?: string }>;
    pagination: { totalCount: number };
  }>(`/providers/search?suburb=${suburbSlug}&category=${catSlug}&marketplaceType=0&pageSize=12`, { revalidate: 300 });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: suburb.name, href: `/${suburb.slug}` },
          { label: cat.displayName },
        ]} />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-secondary)' }}>
              <span className="text-xl">{cat.icon}</span>
            </div>
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-rose)' }}>{suburb.name}</p>
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
                <em>{cat.displayName}</em> in {suburb.name}
              </h1>
            </div>
          </div>
          <p className="text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{totalCount} provider{totalCount !== 1 ? "s" : ""} found</p>
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <ProviderCard key={p.slug} {...p} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title={`No ${cat.name.toLowerCase()} providers in ${suburb.name} yet`}
            description="Try browsing nearby suburbs or check back soon!"
          />
        )}

        {/* SEO content block */}
        <div className="mt-16 max-w-3xl">
          <h2 className="text-[1.25rem] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>
            {cat.displayName} in {suburb.name}
          </h2>
          <p className="text-[15px] font-light leading-relaxed mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            Looking for {cat.name.toLowerCase()} services in {suburb.name}, Perth? Appilico makes it easy to find and compare
            the best {cat.displayName.toLowerCase()} near you. {cat.description}.
          </p>
          <p className="text-[15px] font-light leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
            Browse verified professionals, read real customer reviews, and connect directly — no middleman, no commission.
            All {cat.name.toLowerCase()} providers in {suburb.name} ({suburb.postCode}) are listed with up-to-date information.
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd({ name: cat.name, slug: cat.slug }, { name: suburb.name, slug: suburb.slug })) }}
      />
    </>
  );
}
