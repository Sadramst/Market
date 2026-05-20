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
  instagramUrl?: string;
  facebookUrl?: string;
  averageRating: number;
  totalReviews: number;
  followerCount: number;
  logoUrl?: string;
  coverImageUrl?: string;
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
  galleryImages: Array<{
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
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 300 });
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
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 300, tags: ["provider", slug] });
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
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div className="h-52 bg-gradient-to-br from-rose-100 via-pink-50 to-rose-50 relative">
            {provider.coverImageUrl && (
              <img src={provider.coverImageUrl} alt="" className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <div className="p-6 sm:p-8 -mt-14 relative">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="w-28 h-28 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden">
                {provider.logoUrl ? (
                  <img src={provider.logoUrl} alt={provider.businessName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                    <span className="text-3xl font-display gradient-text">{provider.businessName.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900">{provider.businessName}</h1>
                {provider.tagline && <p className="text-gray-400 mt-1">{provider.tagline}</p>}
                <div className="flex flex-wrap items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={provider.averageRating} size="md" />
                    <span className="text-sm text-gray-400">
                      {provider.averageRating.toFixed(1)} ({provider.totalReviews} review{provider.totalReviews !== 1 ? "s" : ""})
                    </span>
                  </div>
                  {provider.city && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                      {provider.city}{provider.state ? `, ${provider.state}` : ""}
                    </span>
                  )}
                  <span className="text-sm text-gray-400 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    {provider.followerCount} followers
                  </span>
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
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold mb-3">About</h2>
                <p className="text-gray-500 whitespace-pre-line leading-relaxed">{provider.description}</p>
              </section>
            )}

            {/* Services */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-display font-bold mb-4">Services</h2>
              {(provider.services?.length ?? 0) > 0 ? (
                <div className="divide-y divide-gray-50">
                  {provider.services.map((svc) => (
                    <div key={svc.id} className="py-4 flex items-start justify-between gap-4 group">
                      <div>
                        <h3 className="font-medium text-gray-900">{svc.name}</h3>
                        {svc.description && <p className="text-sm text-gray-400 mt-1">{svc.description}</p>}
                        <span className="text-xs text-gray-300 mt-1 block flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {svc.durationMinutes} min
                        </span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-gray-900 text-lg">
                          ${svc.priceFrom}
                          {svc.priceTo && svc.priceTo !== svc.priceFrom ? <span className="text-gray-400 font-normal"> – ${svc.priceTo}</span> : ""}
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
            {(provider.galleryImages?.length ?? 0) > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-display font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {provider.galleryImages.map((img) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden bg-gray-50 group">
                      <img
                        src={img.thumbnailUrl || img.imageUrl}
                        alt={img.altText || provider.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-xl font-display font-bold mb-4">Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-50 rounded-full flex items-center justify-center text-sm font-semibold text-rose-500">
                            {review.userFirstName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{review.userFirstName}</p>
                            <p className="text-xs text-gray-300">{new Date(review.createdAt).toLocaleDateString("en-AU")}</p>
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
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h3 className="font-display font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                {provider.address && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    <span className="text-gray-500">{provider.address}</span>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    <a href={`tel:${provider.phone}`} className="text-primary hover:underline">{provider.phone}</a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <a href={`mailto:${provider.email}`} className="text-primary hover:underline">{provider.email}</a>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{provider.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                {provider.instagramUrl && (
                  <div className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <a href={provider.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">{provider.instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@')}</a>
                  </div>
                )}
              </div>

              {/* TODO: Booking/Contact CTA button */}
              <button className="w-full mt-6 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]">
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
