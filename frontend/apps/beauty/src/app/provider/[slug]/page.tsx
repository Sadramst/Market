import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { providerJsonLd } from "@/lib/seo";
import { Breadcrumbs, StarRating } from "@/components/ui";
import { ContactProviderButton } from "@/components/providers/ContactProviderButton";
import { ReviewForm } from "@/components/providers/ReviewForm";

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
      {/* Gradient Banner */}
      <div className="relative h-64" style={{ background: bannerGradient }}>
        {provider.coverImageUrl ? (
          <img src={provider.coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[80px] opacity-20">
              {catSlug === 'nails' ? '💅' : catSlug === 'hair' ? '💇‍♀️' : catSlug === 'lashes' ? '👁️' : catSlug === 'brows' ? '✨' : catSlug === 'skin-care' ? '🧴' : catSlug === 'makeup' ? '💄' : catSlug === 'body' ? '🌸' : catSlug === 'cosmetic' ? '💉' : catSlug === 'wellness' ? '🧘' : '✨'}
            </span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(28,20,16,0.3), transparent)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search", href: "/search" }, { label: provider.businessName }]} />

        {/* Profile Header */}
        <div className="p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="w-28 h-28 overflow-hidden flex-shrink-0" style={{ borderRadius: '12px', border: '4px solid var(--bg-card)', boxShadow: 'var(--shadow-md)' }}>
              {provider.logoUrl ? (
                <img src={provider.logoUrl} alt={provider.businessName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'var(--gradient-rose)' }}>
                  <span className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>{provider.businessName.charAt(0)}</span>
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
              ) : (
                <p className="text-[13px]" style={{ color: 'var(--text-muted)' }}>{provider.totalReviews > 0 ? `This provider has  reviews via Google. Detailed reviews coming soon.` : `No reviews yet. Be the first to leave a review!`}</p>
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
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(providerJsonLd(provider)) }} />
    </>
  );
}
