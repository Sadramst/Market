"use client";

import Link from "next/link";
import Image from "next/image";

type ProviderCardProps = {
  slug: string;
  businessName: string;
  tagline?: string;
  city?: string;
  state?: string;
  fullAddress?: string;
  phone?: string;
  website?: string;
  averageRating: number;
  totalReviews: number;
  logoUrl?: string;
  categories?: string[] | string;
  priceFrom?: number;
  isVerified?: boolean;
  hasRealData?: boolean;
};

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const CATEGORY_META: Record<string, { icon: string; gradient: string }> = {
  nails: { icon: '💅', gradient: 'linear-gradient(135deg, #E8A8AD, #C8737A)' },
  hair: { icon: '💇‍♀️', gradient: 'linear-gradient(135deg, #E8D5B0, #C9A96E)' },
  lashes: { icon: '👁️', gradient: 'linear-gradient(135deg, #C4A8C8, #9B7B84)' },
  brows: { icon: '✨', gradient: 'linear-gradient(135deg, #E8A8AD, #C8737A)' },
  'skin-care': { icon: '🧴', gradient: 'linear-gradient(135deg, #A8C8B0, #7B9B84)' },
  'skin care': { icon: '🧴', gradient: 'linear-gradient(135deg, #A8C8B0, #7B9B84)' },
  makeup: { icon: '💄', gradient: 'linear-gradient(135deg, #D4A0A8, #A35560)' },
  body: { icon: '🌸', gradient: 'linear-gradient(135deg, #E8A8C0, #C8737A)' },
  massage: { icon: '💆', gradient: 'linear-gradient(135deg, #B8D4D4, #6B9B9B)' },
  cosmetic: { icon: '💉', gradient: 'linear-gradient(135deg, #C4A8C8, #9B7B84)' },
  wellness: { icon: '🧘', gradient: 'linear-gradient(135deg, #A8C8B8, #7B9B8C)' },
};

function getCategoryMeta(categories?: string[] | string) {
  const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
  if (!cats[0]) return { icon: '✨', gradient: 'linear-gradient(135deg, #E8A8AD, #C8737A)' };
  const slug = cats[0].toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_META[slug] || CATEGORY_META[cats[0].toLowerCase()] || { icon: '✨', gradient: 'linear-gradient(135deg, #E8A8AD, #C8737A)' };
}

export function ProviderCard({
  slug,
  businessName,
  tagline,
  city,
  fullAddress,
  phone,
  website,
  averageRating,
  totalReviews,
  logoUrl,
  categories,
  isVerified,
  hasRealData,
}: ProviderCardProps) {
  const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
  const { icon, gradient } = getCategoryMeta(cats);
  const trustLabel = isVerified ? "Verified" : hasRealData ? "Source checked" : "New listing";

  return (
    <Link
      href={`/provider/${slug}`}
      className="premium-card group block overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: '140px', background: gradient }}>
        {logoUrl ? (
          <Image src={logoUrl} alt={businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[42px] mb-1.5 opacity-80 group-hover:scale-110 transition-transform duration-500">{icon}</span>
            <span className="text-white/90 text-[15px] font-medium tracking-wide text-center px-4 truncate max-w-full" style={{ fontFamily: 'var(--font-heading)', textShadow: '0 1px 8px rgba(0,0,0,0.25)' }}>
              {businessName}
            </span>
          </div>
        )}
        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.08), transparent)' }} />
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {cats.length > 0 && (
            <span className="text-[11px] font-medium px-2.5 py-0.5" style={{ background: 'rgba(200,115,122,0.12)', color: 'var(--brand-rose-dark)', borderRadius: '50px' }}>
              {cats[0]}
            </span>
          )}
          {city && (
            <span className="text-[11px] font-medium px-2.5 py-0.5" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', borderRadius: '50px' }}>
              {city}
            </span>
          )}
        </div>

        {/* Business name */}
        <h3 className="text-[18px] font-semibold truncate transition-colors group-hover:text-[var(--brand-rose)]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
          {businessName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          {averageRating > 0 ? (
            <>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'star-filled' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{averageRating.toFixed(1)}</span>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>({totalReviews})</span>
            </>
          ) : (
            <span className="text-[12px] font-medium" style={{ color: 'var(--brand-gold)' }}>New listing</span>
          )}
        </div>

        {fullAddress && (
          <div className="text-[12px] mt-2 flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span className="shrink-0 mt-0.5">📍</span>
            <span className="truncate">{fullAddress}</span>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessName + ' ' + fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] underline ml-auto shrink-0 transition-opacity hover:opacity-70"
              style={{ color: 'var(--brand-rose)' }}
              onClick={(e) => e.stopPropagation()}
            >
              Map
            </a>
          </div>
        )}

        {(phone || website) && (
          <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
            {phone && (
              <div className="text-[12px] flex items-center gap-1 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                <span>📞</span>
                <span>{phone}</span>
              </div>
            )}
            {website && (
              <div className="text-[12px] flex items-center gap-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                <span>🌐</span>
                <span className="truncate">{website.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {tagline && (
          <p className="text-[14px] font-light mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{tagline}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <span className="text-[12px]" style={{ color: 'var(--brand-gold)' }} title="This provider's address and contact details were verified against Google Maps">{trustLabel}</span>
          <span className="text-[12px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: 'var(--brand-rose)' }}>
            View Profile →
          </span>
        </div>
      </div>
    </Link>
  );
}
