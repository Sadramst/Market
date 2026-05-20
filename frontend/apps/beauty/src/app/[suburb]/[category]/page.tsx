import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { BEAUTY_CATEGORIES, findCategory } from "@/lib/categories";

type Suburb = { name: string; slug: string; state: string; postCode: string };

export async function generateMetadata({ params }: { params: Promise<{ suburb: string; category: string }> }): Promise<Metadata> {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const suburb = await fetchApi<Suburb>(`/locations/suburbs/${suburbSlug}`, { revalidate: 3600 });
  const cat = findCategory(catSlug);
  if (!suburb || !cat) return { title: "Not Found" };
  return {
    title: `${cat.displayName} in ${suburb.name}, Perth WA`,
    description: `Find the best ${cat.displayName.toLowerCase()} in ${suburb.name}. Compare providers, read reviews and get in touch. Updated ${new Date().getFullYear()}.`,
    alternates: { canonical: `https://beauty.appilico.com.au/${suburbSlug}/${catSlug}` },
  };
}

export async function generateStaticParams() {
  const suburbs = await fetchApi<Array<{ slug: string }>>("/locations/suburbs", { revalidate: 86400 });
  const params: Array<{ suburb: string; category: string }> = [];
  const suburbSlugs = suburbs?.map((s) => s.slug) ?? [];
  for (const suburb of suburbSlugs.slice(0, 50)) {
    for (const cat of BEAUTY_CATEGORIES) {
      params.push({ suburb, category: cat.slug });
    }
  }
  return params;
}

export default async function SuburbCategoryPage({ params }: { params: Promise<{ suburb: string; category: string }> }) {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const cat = findCategory(catSlug);
  const suburb = await fetchApi<Suburb>(`/locations/suburbs/${suburbSlug}`, { revalidate: 3600 });
  if (!suburb || !cat) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; averageRating: number; totalReviews: number; city?: string; logoUrl?: string; tagline?: string }>;
    pagination: { totalCount: number };
  }>(`/providers/search?suburb=${suburbSlug}&category=${catSlug}&marketplaceType=0&pageSize=12`, { revalidate: 300 });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: suburb.name, href: `/${suburb.slug}` },
          { label: cat.displayName },
        ]} />

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-primary-light/50 flex items-center justify-center">
              <span className="text-xl">{cat.icon}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">{suburb.name}</span>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">
                {cat.displayName} in {suburb.name}
              </h1>
            </div>
          </div>
          <p className="text-gray-400 text-[15px]">{totalCount} provider{totalCount !== 1 ? "s" : ""} found</p>
        </div>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd({ name: cat.name, slug: cat.slug }, suburb)) }}
      />
    </>
  );
}
