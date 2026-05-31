import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { providerJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { Breadcrumbs, StarRating } from "@/components/ui";
import { ContactProviderButton } from "@/components/providers/ContactProviderButton";
import { ReviewForm } from "@/components/providers/ReviewForm";
import { ProviderViewTracker } from "@/components/providers/ProviderViewTracker";
import { CategoryIcon } from "@/components/icons/CategoryIcon";

type Provider = {
  id: string;
  slug: string;
  businessName: string;
  tagline?: string;
  description?: string;
  city?: string;
  state?: string;
  address?: string;
  fullAddress?: string;
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
  isClaimed?: boolean;
  hasRealData?: boolean;
  categories?: string[];
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
  userName: string;
  createdAt: string;
  providerReply?: string;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 60 });
  if (!provider) return { title: "Provider Not Found" };

  const catName = provider.categories?.[0] || 'Beauty';
  return {
    title: `${provider.businessName} — ${catName} Services${provider.city ? ` in ${provider.city}` : ""} | Appilico Beauty`,
    description: provider.description
      ? provider.description.slice(0, 155)
      : `Find ${provider.businessName} in ${provider.city || 'Perth'}, WA. Read ${provider.totalReviews} reviews and contact directly.`,
    alternates: { canonical: `https://beauty.appilico.com.au/provider/${slug}` },
    openGraph: {
      title: `${provider.businessName} | Appilico Beauty`,
      description: provider.tagline || provider.description?.slice(0, 155) || `Rated ${provider.averageRating.toFixed(1)}★ by ${provider.totalReviews} customers`,
      url: `https://beauty.appilico.com.au/provider/${slug}`,
      type: "website",
      ...(provider.logoUrl ? { images: [provider.logoUrl] } : {}),
    },
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 60, tags: ["provider", slug] });
  if (!provider) notFound();

  const reviewsData = await fetchApi<{ items: Review[] }>(`/reviews/provider/${provider.id}?pageSize=10`, { revalidate: 60, tags: ["reviews", slug] });
  const reviews = reviewsData?.items ?? [];

  const [relatedData, nearbyData] = await Promise.all([
    fetchApi<Array<{ id: string; slug: string; businessName: string; logoUrl?: string; coverImageUrl?: string; averageRating: number; totalReviews: number; city?: string; categories?: string[]; primaryImageUrl?: string; tagline?: string }>>(`/providers/${slug}/related?count=6`, { revalidate: 60 }),
    fetchApi<Array<{ id: string; slug: string; businessName: string; logoUrl?: string; coverImageUrl?: string; averageRating: number; totalReviews: number; city?: string; categories?: string[]; primaryImageUrl?: string; tagline?: string }>>(`/providers/${slug}/nearby?count=6`, { revalidate: 600 }),
  ]);
  const relatedProviders = relatedData ?? [];
  const nearbyProviders = nearbyData ?? [];

  const categoryGradients: Record<string, string> = {
    nails: 'linear-gradient(135deg, #E8A8AD, #C8737A)',
    hair: 'linear-gradient(135deg, #E8D5B0, #C9A96E)',
    lashes: 'linear-gradient(135deg, #C4A8C8, #9B7B84)',
    brows: 'linear-gradient(135deg, #E8A8AD, #C8737A)',
    'skin-care': 'linear-gradient(135deg, #A8C8B0, #7B9B84)',
    'skin care': 'linear-gradient(135deg, #A8C8B0, #7B9B84)',
    makeup: 'linear-gradient(135deg, #D4A0A8, #A35560)',
    body: 'linear-gradient(135deg, #E8A8C0, #C8737A)',
    cosmetic: 'linear-gradient(135deg, #C4A8C8, #9B7B84)',
    wellness: 'linear-gradient(135deg, #A8C8B8, #7B9B8C)',
  };
  const catSlug = provider.categories?.[0]?.toLowerCase().replace(/\s+/g, '-') || '';
  const bannerGradient = categoryGradients[catSlug] || categoryGradients[provider.categories?.[0]?.toLowerCase() || ''] || 'var(--gradient-rose)';

  return (
    <>
      <ProviderViewTracker
        providerSlug={provider.slug}
        categorySlug={provider.categories?.[0]?.toLowerCase().replace(/\s+/g, '-')}
        suburbSlug={provider.city?.toLowerCase().replace(/\s+/g, '-')}
      />
      {/* Gradient Banner */}
      <div className="relative h-64" style={{ background: bannerGradient }}>
        {provider.coverImageUrl ? (
          <img src={provider.coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon category={catSlug || provider.categories?.[0] || ''} className="w-24 h-24 text-white opacity-25" strokeWidth={1.25} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.3), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative pb-16">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          ...(provider.categories?.[0] ? [{ label: provider.categories[0], href: `/search?category=${encodeURIComponent(provider.categories[0].toLowerCase().replace(/\s+/g, '-'))}` }] : []),
          ...(provider.city ? [{ label: provider.city, href: `/${provider.city.toLowerCase().replace(/\s+/g, '-')}` }] : []),
          { label: provider.businessName },
        ]} />

        {/* Profile Header */}
        <div className="p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="w-28 h-28 overflow-hidden flex-shrink-0" style={{ borderRadius: '12px', border: '4px solid var(--bg-card)', boxShadow: 'var(--shadow-md)' }}>
              {provider.logoUrl ? (
                <img src={provider.logoUrl} alt={provider.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: bannerGradient }}>
                  <CategoryIcon category={catSlug || provider.categories?.[0] || ''} className="w-12 h-12 text-white" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 400 }}>{provider.businessName}</h1>
              {provider.tagline && <p className="text-[15px] font-light mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{provider.tagline}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <StarRating rating={provider.averageRating} size="md" />
                  <span className="text-[13px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
                    {provider.averageRating.toFixed(1)} ({provider.totalReviews} review{provider.totalReviews !== 1 ? "s" : ""})
                  </span>
                </div>
                {provider.city && (
                  <span className="text-[13px] flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    📍 {provider.city}{provider.state ? `, ${provider.state}` : ""}
                  </span>
                )}
                {provider.followerCount > 0 && (
                  <span className="text-[13px]" style={{ color: 'var(--text-muted)' }}>❤️ {provider.followerCount} followers</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Claim This Listing Banner — only for unclaimed real-data providers */}
        {!provider.isClaimed && provider.hasRealData && (
          <div className="mt-6 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'linear-gradient(135deg, #1C1410 0%, #2a1f1a 100%)', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.2)' }}>
            <div>
              <h3 className="text-[16px] font-medium text-white" style={{ fontFamily: 'var(--font-heading)' }}>Is this your business?</h3>
              <p className="text-[13px] font-light mt-1" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>Claim this listing to update your details, respond to reviews, and unlock premium features.</p>
            </div>
            <Link href={`/claim/${provider.slug}`} className="shrink-0 px-6 py-3 text-[13px] font-medium text-white transition-all hover:opacity-90" style={{ background: 'var(--brand-gold)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}>
              Claim This Listing
            </Link>
          </div>
        )}

        {/* External Links Bar */}
        {(provider.website || provider.instagramUrl || provider.facebookUrl || provider.phone) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {provider.website && (
              <a href={provider.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all hover:opacity-80" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
                🌐 Visit Website
              </a>
            )}
            {provider.instagramUrl && (
              <a href={provider.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all hover:opacity-80" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
                📷 Instagram
              </a>
            )}
            {provider.facebookUrl && (
              <a href={provider.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all hover:opacity-80" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
                📘 Facebook
              </a>
            )}
            {provider.phone && (
              <a href={`tel:${provider.phone}`} className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium transition-all hover:opacity-80" style={{ background: 'var(--brand-rose)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'white' }}>
                📞 Call Now
              </a>
            )}
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {provider.description && (
              <section className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h2 className="text-[18px] mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>About</h2>
                <p className="text-[14px] font-light whitespace-pre-line leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{provider.description}</p>
              </section>
            )}

            {/* Services */}
            <section className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h2 className="text-[18px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Services</h2>
              {(provider.services?.length ?? 0) > 0 ? (
                <div>
                  {provider.services.map((svc) => (
                    <div key={svc.id} className="py-4 flex items-start justify-between gap-4" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <h3 className="text-[15px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{svc.name}</h3>
                        {svc.description && <p className="text-[13px] font-light mt-1" style={{ color: 'var(--text-secondary)' }}>{svc.description}</p>}
                        <span className="text-[11px] mt-1.5 inline-block" style={{ color: 'var(--text-muted)' }}>⏱ {svc.durationMinutes} min</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
                          ${svc.priceFrom}{svc.priceTo && svc.priceTo !== svc.priceFrom ? <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> – ${svc.priceTo}</span> : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>No services listed yet.</p>
              )}
            </section>

            {/* Gallery */}
            {(provider.galleryImages?.length ?? 0) > 0 && (
              <section className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                <h2 className="text-[18px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Gallery</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {provider.galleryImages.map((img) => (
                    <div key={img.id} className="aspect-square overflow-hidden group" style={{ borderRadius: '8px', background: 'var(--bg-secondary)' }}>
                      <img
                        src={img.thumbnailUrl || img.imageUrl}
                        alt={img.altText || provider.businessName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            <section className="p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h2 className="text-[18px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Reviews</h2>
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)' }}>
                            {(review.userName ?? 'U').charAt(0)}
                          </div>
                          <div>
                            <p className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{review.userName ?? 'Anonymous'}</p>
                            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{new Date(review.createdAt).toLocaleDateString("en-AU")}</p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-[14px] font-light mt-3 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{review.comment}</p>
                      {review.providerReply && (
                        <div className="mt-3 ml-6 p-3" style={{ background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                          <p className="text-[11px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Response from {provider.businessName}</p>
                          <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>{review.providerReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : provider.totalReviews > 0 ? (
                <div className="flex items-start gap-4 p-5" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.06), rgba(200,115,122,0.04))', borderRadius: '8px', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <span className="text-[32px] shrink-0">⭐</span>
                  <div>
                    <p className="text-[16px] font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                      {provider.totalReviews.toLocaleString()} verified Google reviews
                    </p>
                    <p className="text-[14px] font-light mt-1 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                      This business has an outstanding rating of {provider.averageRating.toFixed(1)} from real customers on Google. Be the first to leave an Appilico review below.
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <StarRating rating={provider.averageRating} size="md" />
                      <span className="text-[13px] font-medium" style={{ color: 'var(--brand-gold)' }}>{provider.averageRating.toFixed(1)} / 5.0</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to leave a review!</p>
              )}
            </section>

            {/* Leave a Review */}
            <ReviewForm providerId={provider.id} providerName={provider.businessName} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 sticky top-24" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h3 className="text-[18px] mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Contact</h3>
              <div className="space-y-3 text-[13px]" style={{ fontFamily: 'var(--font-body)' }}>
                {(provider.fullAddress || provider.address) && (
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-3">
                      <span className="text-[16px] shrink-0 mt-0.5">📍</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{provider.fullAddress || provider.address}</span>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(provider.businessName + ' ' + (provider.fullAddress || provider.address))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] underline transition-opacity hover:opacity-70 ml-8"
                      style={{ color: 'var(--brand-rose)' }}
                    >
                      View on Map
                    </a>
                  </div>
                )}
                {provider.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] shrink-0">📞</span>
                    <a href={`tel:${provider.phone}`} className="hover:underline" style={{ color: 'var(--brand-rose)' }}>{provider.phone}</a>
                  </div>
                )}
                {provider.email && (
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] shrink-0">✉️</span>
                    <a href={`mailto:${provider.email}`} className="hover:underline" style={{ color: 'var(--brand-rose)' }}>{provider.email}</a>
                  </div>
                )}
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] shrink-0">🌐</span>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="hover:underline truncate" style={{ color: 'var(--brand-rose)' }}>{provider.website.replace(/^https?:\/\//, "")}</a>
                  </div>
                )}
                {provider.instagramUrl && (
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] shrink-0">📷</span>
                    <a href={provider.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate" style={{ color: 'var(--brand-rose)' }}>{provider.instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '@')}</a>
                  </div>
                )}
              </div>

              <ContactProviderButton
                providerId={provider.id}
                providerName={provider.businessName}
                services={provider.services?.map(s => ({ name: s.name }))}
              />
            </div>
          </div>
        </div>
        {/* Related Providers */}
        {relatedProviders.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[20px] mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Similar Providers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedProviders.map((rp) => (
                <Link key={rp.id} href={`/provider/${rp.slug}`} className="group block transition-all hover:-translate-y-0.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div className="h-32 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    {(rp.primaryImageUrl || rp.coverImageUrl || rp.logoUrl) ? (
                      <img src={rp.primaryImageUrl || rp.coverImageUrl || rp.logoUrl} alt={rp.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: categoryGradients[rp.categories?.[0]?.toLowerCase().replace(/\s+/g, '-') || ''] || 'var(--gradient-rose)' }}>
                        <CategoryIcon category={rp.categories?.[0] || ''} className="w-9 h-9 text-white opacity-90" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-medium truncate" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{rp.businessName}</h3>
                    {rp.city && <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>📍 {rp.city}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={rp.averageRating} size="sm" />
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{rp.averageRating.toFixed(1)} ({rp.totalReviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Nearby Providers */}
        {nearbyProviders.length > 0 && (
          <section className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Also in {provider.city || 'Your Area'}</h2>
              {provider.city && (
                <Link
                  href={`/${provider.city.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-[13px] font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}
                >
                  View all in {provider.city} →
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {nearbyProviders.map((np) => (
                <Link key={np.id} href={`/provider/${np.slug}`} className="group block transition-all hover:-translate-y-0.5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div className="h-32 overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                    {(np.primaryImageUrl || np.coverImageUrl || np.logoUrl) ? (
                      <img src={np.primaryImageUrl || np.coverImageUrl || np.logoUrl} alt={np.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ background: categoryGradients[np.categories?.[0]?.toLowerCase().replace(/\s+/g, '-') || ''] || 'var(--gradient-rose)' }}>
                        <CategoryIcon category={np.categories?.[0] || ''} className="w-9 h-9 text-white opacity-90" strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[14px] font-medium truncate" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{np.businessName}</h3>
                    {np.city && <p className="text-[12px] mt-1" style={{ color: 'var(--text-muted)' }}>📍 {np.city}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <StarRating rating={np.averageRating} size="sm" />
                      <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{np.averageRating.toFixed(1)} ({np.totalReviews})</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(providerJsonLd(provider)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { name: "Home", url: "/" },
        ...(provider.categories?.[0] ? [{ name: provider.categories[0], url: `/search?category=${provider.categories[0].toLowerCase().replace(/\s+/g, '-')}` }] : []),
        ...(provider.city ? [{ name: provider.city, url: `/${provider.city.toLowerCase().replace(/\s+/g, '-')}` }] : []),
        { name: provider.businessName },
      ])) }} />
    </>
  );
}
