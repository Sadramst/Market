import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { providerJsonLd } from "@/lib/seo";
import { Breadcrumbs, StarRating, EmptyState } from "@/components/ui";

type Provider = {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  description?: string;
  city?: string;
  state?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  averageRating: number;
  totalReviews: number;
  followerCount: number;
  logoUrl?: string;
  coverUrl?: string;
  businessHoursJson?: string;
  services: Array<{
    id: string;
    name: string;
    description?: string;
    priceFrom: number;
    priceTo?: number;
    durationMinutes: number;
    categoryName?: string;
  }>;
  gallery: Array<{
    id: string;
    imageUrl: string;
    thumbnailUrl?: string;
    altText?: string;
    caption?: string;
  }>;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  userFirstName: string;
  createdAt: string;
  providerReply?: string;
  providerRepliedAt?: string;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/slug/${slug}`, { revalidate: 300 });
  if (!provider) return { title: "Provider Not Found" };

  return {
    title: `${provider.businessName} — Beauty Services${provider.city ? ` in ${provider.city}` : ""}`,
    description: provider.description || `${provider.businessName} — beauty services${provider.city ? ` in ${provider.city}, WA` : ""}. Read reviews and view services.`,
    alternates: { canonical: `https://beauty.appilico.com.au/provider/${slug}` },
    openGraph: {
      title: provider.businessName,
      description: provider.tagline || provider.description || "",
      type: "profile",
      ...(provider.logoUrl ? { images: [provider.logoUrl] } : {}),
    },
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/slug/${slug}`, { revalidate: 300, tags: ["provider", slug] });
  if (!provider) notFound();

  const reviewsData = await fetchApi<{ items: Review[] }>(`/reviews/provider/${provider.id}?pageSize=10`, { revalidate: 300, tags: ["reviews", slug] });
  const reviews = reviewsData?.items ?? [];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Search", href: "/search" },
          { label: provider.businessName },
        ]} />

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-8">
          <div className="h-48 bg-gradient-to-br from-rose-100 to-pink-100 relative">
            {provider.coverUrl && (
              <img src={provider.coverUrl} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-6 sm:p-8 -mt-12 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-24 h-24 rounded-xl bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {provider.logoUrl ? (
                  <img src={provider.logoUrl} alt={provider.businessName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-display text-rose-400">{provider.businessName.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{provider.businessName}</h1>
                {provider.tagline && <p className="text-gray-500 mt-1">{provider.tagline}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <div className="flex items-center gap-2">
                    <StarRating rating={provider.averageRating} size="md" />
                    <span className="text-sm text-gray-500">
                      {provider.averageRating.toFixed(1)} ({provider.totalReviews} reviews)
                    </span>
                  </div>
                  {provider.city && (
                    <span className="text-sm text-gray-500">📍 {provider.city}{provider.state ? `, ${provider.state}` : ""}</span>
                  )}
                  <span className="text-sm text-gray-500">❤️ {provider.followerCount} followers</span>
                </div>
              </div>
              {/* TODO: Follow + Contact buttons (requires auth) */}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {provider.description && (
              <section className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold mb-3">About</h2>
                <p className="text-gray-600 whitespace-pre-line">{provider.description}</p>
              </section>
            )}

            {/* Services */}
            <section className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-display font-bold mb-4">Services</h2>
              {provider.services.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {provider.services.map((svc) => (
                    <div key={svc.id} className="py-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{svc.name}</h3>
                        {svc.description && <p className="text-sm text-gray-500 mt-1">{svc.description}</p>}
                        <span className="text-xs text-gray-400 mt-1 block">{svc.durationMinutes} min</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-gray-900">
                          ${svc.priceFrom}
                          {svc.priceTo && svc.priceTo !== svc.priceFrom ? `–$${svc.priceTo}` : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No services listed yet.</p>
              )}
            </section>

            {/* Gallery */}
            {provider.gallery.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {provider.gallery.map((img) => (
                    <div key={img.id} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={img.thumbnailUrl || img.imageUrl}
                        alt={img.altText || provider.businessName}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-xl font-display font-bold mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-sm font-medium text-rose-600">
                            {review.userFirstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{review.userFirstName}</p>
                            <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString("en-AU")}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-gray-600 mt-3 text-sm">{review.comment}</p>
                      {review.providerReply && (
                        <div className="mt-3 ml-6 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 mb-1">Response from {provider.businessName}</p>
                          <p className="text-sm text-gray-600">{review.providerReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No reviews yet. Be the first to leave a review!</p>
              )}
              {/* TODO: Write review form (requires auth) */}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-display font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {provider.address && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-400">📍</span>
                    <span className="text-gray-600">{provider.address}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📞</span>
                    <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">✉️</span>
                    <a href={`mailto:${provider.email}`} className="text-primary hover:underline">{provider.email}</a>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🌐</span>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{provider.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                {provider.instagram && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">📸</span>
                    <a href={`https://instagram.com/${provider.instagram}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@{provider.instagram}</a>
                  </div>
                )}
              </div>

              {/* TODO: Booking/Contact CTA button */}
              <button className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors">
                Contact Provider
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(providerJsonLd(provider)) }}
      />
    </>
  );
}
