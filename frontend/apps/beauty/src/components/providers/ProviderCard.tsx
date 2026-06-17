"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Phone, Globe, BadgeCheck, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { FavouriteButton } from "@/components/providers/FavouriteButton";

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
  createdAt?: string | Date;
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  nails: 'linear-gradient(135deg, #E8A8AD, #C8737A)',
  hair: 'linear-gradient(135deg, #E8D5B0, #C9A96E)',
  lashes: 'linear-gradient(135deg, #C4A8C8, #9B7B84)',
  brows: 'linear-gradient(135deg, #E8A8AD, #C8737A)',
  'skin-care': 'linear-gradient(135deg, #A8C8B0, #7B9B84)',
  'skin care': 'linear-gradient(135deg, #A8C8B0, #7B9B84)',
  makeup: 'linear-gradient(135deg, #D4A0A8, #A35560)',
  body: 'linear-gradient(135deg, #E8A8C0, #C8737A)',
  massage: 'linear-gradient(135deg, #B8D4D4, #6B9B9B)',
  cosmetic: 'linear-gradient(135deg, #C4A8C8, #9B7B84)',
  wellness: 'linear-gradient(135deg, #A8C8B8, #7B9B8C)',
};

function getCategoryGradient(categories?: string[] | string) {
  const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
  if (!cats[0]) return 'linear-gradient(135deg, #E8A8AD, #C8737A)';
  const slug = cats[0].toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_GRADIENTS[slug] || CATEGORY_GRADIENTS[cats[0].toLowerCase()] || 'linear-gradient(135deg, #E8A8AD, #C8737A)';
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
  createdAt,
}: ProviderCardProps) {
  const cats = Array.isArray(categories) ? categories : categories ? [categories] : [];
  const gradient = getCategoryGradient(cats);

  // Calculate if this is a new listing: created within 30 days AND has fewer than 10 reviews
  const isNewListing = createdAt
    ? new Date().getTime() - new Date(createdAt).getTime() < 30 * 24 * 60 * 60 * 1000 && totalReviews < 10
    : false;
  const trustLabel = isVerified ? "Verified" : hasRealData ? "Verified data" : isNewListing ? "New listing" : "";

  return (
    <Link
      href={`/provider/${slug}`}
      className="premium-card group block overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(200, 115, 122, 0.15)'; e.currentTarget.style.borderColor = 'rgba(200,115,122,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      {/* Cover */}
      <div className="relative overflow-hidden" style={{ height: '160px', background: gradient }}>
        {logoUrl ? (
          <Image src={logoUrl} alt={businessName} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <CategoryIcon category={cats[0] || ''} className="w-12 h-12 text-white/80 mb-2 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
            <span className="text-white/90 text-[15px] font-medium tracking-wide text-center px-4 truncate max-w-full" style={{ fontFamily: 'var(--font-heading)', textShadow: '0 1px 8px rgba(0,0,0,0.25)' }}>
              {businessName}
            </span>
          </div>
        )}
        {/* Category badge top-left */}
        {cats.length > 0 && (
          <span className="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: 'var(--brand-rose-dark)', borderRadius: '50px' }}>
            <CategoryIcon category={cats[0]} className="w-3 h-3" strokeWidth={2} />
            {cats[0]}
          </span>
        )}
        {/* Trust badge top-right */}
        {(isVerified || hasRealData || isNewListing) && (
          <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-1 flex items-center gap-1" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', color: isVerified ? 'var(--brand-gold)' : isNewListing ? 'var(--brand-rose)' : '#3F7E5B', borderRadius: '50px' }}>
            {isVerified ? (
              <>
                <BadgeCheck className="w-3 h-3" /> Verified
              </>
            ) : isNewListing ? (
              <>
                <Sparkles className="w-3 h-3" /> New listing
              </>
            ) : (
              <>
                <ShieldCheck className="w-3 h-3" /> Verified data
              </>
            )}
          </span>
        )}
        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.12), transparent)' }} />
        {/* Save / favourite */}
        <FavouriteButton
          className="absolute bottom-3 right-3"
          provider={{
            slug,
            businessName,
            city,
            categories: cats,
            averageRating,
            totalReviews,
            logoUrl,
            isVerified,
            hasRealData,
          }}
        />
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Suburb row */}
        {city && (
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3 h-3" style={{ color: 'var(--brand-rose)' }} strokeWidth={2} />
            <span className="text-[12px] font-medium" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>{city}, WA</span>
          </div>
        )}

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
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(averageRating) ? 'text-[var(--brand-rose)] fill-[var(--brand-rose)]' : 'text-gray-200'}`} strokeWidth={0} fill={i < Math.round(averageRating) ? 'currentColor' : '#E5E7EB'} />
                ))}
              </div>
              <span className="text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>{averageRating.toFixed(1)}</span>
              <span className="text-[12px]" style={{ color: 'var(--text-muted)' }}>({totalReviews.toLocaleString()})</span>
            </>
          ) : isNewListing ? (
            <span className="text-[12px] font-medium flex items-center gap-1" style={{ color: 'var(--brand-rose)' }}>
              <Sparkles className="w-3 h-3" /> New listing
            </span>
          ) : (
            <span className="text-[12px] font-medium flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
              No reviews yet
            </span>
          )}
        </div>

        {/* Description */}
        {tagline && (
          <p className="text-[13px] font-light mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{tagline}</p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {phone && <Phone className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />}
            {website && <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />}
            {!phone && !website && (
              <span className="text-[11px]" style={{ color: 'var(--brand-gold)' }}>{trustLabel}</span>
            )}
          </div>
          <span className="text-[12px] font-medium flex items-center gap-1 transition-all duration-300 group-hover:translate-x-0.5" style={{ color: 'var(--brand-rose)' }}>
            View Profile <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
