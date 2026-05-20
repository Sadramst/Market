import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Breadcrumbs, EmptyState } from "@/components/ui";

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
    items: Array<{ slug: string; businessName: string; city?: string; averageRating: number; totalReviews: number }>;
    pagination: { totalCount: number };
  }>(`/providers/search?suburb=${slug}&marketplaceType=0&pageSize=12`, { revalidate: 300, tags: ["providers", slug] });

  const providers = providersData?.items ?? [];

  const categories = [
    { name: "Nails", slug: "nails", icon: "💅" },
    { name: "Hair", slug: "hair", icon: "💇‍♀️" },
    { name: "Lashes", slug: "lashes", icon: "👁️" },
    { name: "Brows", slug: "brows", icon: "✨" },
    { name: "Skin Care", slug: "skin-care", icon: "🧴" },
    { name: "Makeup", slug: "makeup", icon: "💄" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Suburbs", href: "/suburbs" },
          { label: suburb.name },
        ]} />

        <h1 className="text-3xl font-display font-bold mb-2">Beauty Services in {suburb.name}</h1>
        <p className="text-gray-500 mb-8">{suburb.postCode}, {suburb.state}</p>

        {/* Category links for this suburb */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${slug}/${cat.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors"
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
              <Link key={p.slug} href={`/provider/${p.slug}`} className="group bg-white rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                  <span className="text-5xl font-display text-rose-300">{p.businessName.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{p.businessName}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    {p.averageRating > 0 ? (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span>{p.averageRating.toFixed(1)} ({p.totalReviews})</span>
                      </div>
                    ) : <span className="text-gray-400">New</span>}
                  </div>
                </div>
              </Link>
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
          <div className="mt-12 prose prose-lg max-w-none text-gray-600">
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
