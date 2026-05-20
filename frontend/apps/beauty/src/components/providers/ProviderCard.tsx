import Link from "next/link";
import Image from "next/image";

type ProviderCardProps = {
  slug: string;
  businessName: string;
  tagline?: string;
  city?: string;
  state?: string;
  averageRating: number;
  totalReviews: number;
  logoUrl?: string;
  categories?: string[];
  priceFrom?: number;
};

export function ProviderCard({
  slug,
  businessName,
  tagline,
  city,
  averageRating,
  totalReviews,
  logoUrl,
  categories,
  priceFrom,
}: ProviderCardProps) {
  return (
    <Link
      href={`/provider/${slug}`}
      className="premium-card group block bg-white rounded-2xl border border-gray-100/80 overflow-hidden"
    >
      <div className="aspect-[5/4] bg-gradient-to-br from-blush via-pink-50/50 to-cream relative overflow-hidden">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={businessName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
              <span className="text-2xl font-display gradient-text font-bold">
                {businessName.charAt(0)}
              </span>
            </div>
          </div>
        )}

        {/* Rating badge */}
        {averageRating > 0 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
            <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-bold text-gray-700">{averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-[15px] text-gray-900 group-hover:text-primary transition-colors truncate">
          {businessName}
        </h3>

        {tagline && (
          <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{tagline}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="text-[11px] text-gray-400">
            {averageRating > 0 ? (
              <span>{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
            ) : (
              <span className="text-primary/60 font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
            )}
          </div>

          {city && (
            <span className="text-[11px] text-gray-300 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
              {city}
            </span>
          )}
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {categories.slice(0, 3).map((cat) => (
              <span key={cat} className="text-[10px] bg-blush text-primary px-2 py-0.5 rounded-md font-medium">
                {cat}
              </span>
            ))}
          </div>
        )}

        {priceFrom !== undefined && priceFrom > 0 && (
          <p className="text-[13px] text-gray-400 mt-3">From <span className="font-semibold text-gray-900">${priceFrom}</span></p>
        )}
      </div>
    </Link>
  );
}
