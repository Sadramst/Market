import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Breadcrumbs, EmptyState } from "@/components/ui";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

type Suburb = {
  id: string;
  name: string;
  slug: string;
  state: string;
  postCode: string;
  seoDescription?: string;
  providerCount: number;
};

export async function generateMetadata({ params }: { params: Promise<{ suburb: string }> }): Promise<Metadata> {
  const { suburb: slug } = await params;
  const suburb = await fetchApi<Suburb>(`/locations/suburbs/${slug}`, { revalidate: 3600 });
  if (!suburb) return { title: "Suburb Not Found" };
  return {
    title: `Beauty Services in ${suburb.name}, ${suburb.state}`,
    description: suburb.seoDescription || `Find the best beauty salons, spas, and professionals in ${suburb.name}, ${suburb.postCode}. Compare prices, read reviews, and book appointments.`,
    alternates: { canonical: `https://beauty.appilico.com.au/${slug}` },
  };
}

export default async function SuburbPage({ params }: { params: Promise<{ suburb: string }> }) {
  const { suburb: slug } = await params;
  const suburb = await fetchApi<Suburb>(`/locations/suburbs/${slug}`, { revalidate: 3600, tags: ["suburb", slug] });
  if (!suburb) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string }>;
    pagination: { totalCount: number };
  }>(`/providers/search?suburb=${slug}&marketplaceType=0&pageSize=12`, { revalidate: 300, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name },
        ]} />

        <div className="mb-12">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Local</span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Beauty Services in {suburb.name}</h1>
          <p className="text-gray-400 mt-2 text-[15px]">{suburb.postCode}, {suburb.state}</p>
        </div>

        {/* Category links for this suburb */}
        <div className="flex flex-wrap gap-2 mb-10">
          {BEAUTY_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${slug}/${cat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-gray-600 rounded-xl text-[13px] font-medium border border-gray-100/80 hover:border-primary/20 hover:text-primary transition-all"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Providers */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {providers.map((p) => (
              <ProviderCard key={p.slug} {...p} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="📍"
            title={`No beauty providers in ${suburb.name} yet`}
            description="Be the first to list your beauty business in this suburb!"
          />
        )}

        {/* SEO Content */}
        {suburb.seoDescription && (
          <div className="mt-16 prose prose-lg max-w-3xl text-gray-400">
            <p>{suburb.seoDescription}</p>
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Place",
            name: suburb.name,
            address: {
              "@type": "PostalAddress",
              addressLocality: suburb.name,
              addressRegion: suburb.state,
              postalCode: suburb.postCode,
              addressCountry: "AU",
            },
          }),
        }}
      />
    </>
  );
}
