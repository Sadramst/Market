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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name },
        ]} />

        <div className="mb-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.15em] mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-rose)' }}>Local</p>
          <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
            Beauty Services in <em>{suburb.name}</em>
          </h1>
          <p className="text-[15px] font-light mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{suburb.postCode}, {suburb.state}</p>
        </div>

        {/* Category links for this suburb */}
        <div className="flex flex-wrap gap-2 mb-10">
          {BEAUTY_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${slug}/${cat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>

        {/* Providers */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="mt-16 max-w-3xl">
            <p className="text-[15px] font-light leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{suburb.seoDescription}</p>
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
