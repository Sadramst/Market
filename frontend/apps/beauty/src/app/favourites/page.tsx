"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useFavourites } from "@appilico/shared/hooks";
import { ProviderCard } from "@/components/providers/ProviderCard";

export default function FavouritesPage() {
  const { favourites, count, hydrated, clearFavourites } = useFavourites();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1
            className="text-[28px] sm:text-[34px] font-semibold flex items-center gap-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}
          >
            <Heart className="w-7 h-7" style={{ color: "var(--brand-rose)" }} fill="var(--brand-rose)" />
            Saved providers
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            {!hydrated
              ? "Loading your saved providers…"
              : count > 0
                ? `${count} provider${count === 1 ? "" : "s"} shortlisted on this device.`
                : "Tap the heart on any provider to build your shortlist."}
          </p>
        </div>
        {hydrated && count > 0 && (
          <button
            type="button"
            onClick={clearFavourites}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors"
            style={{ border: "1px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)" }}
          >
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        )}
      </div>

      {hydrated && count === 0 ? (
        <div
          className="text-center py-20 rounded-2xl"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          <div
            className="mx-auto mb-5 flex items-center justify-center"
            style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-subtle, #f6eef0)" }}
          >
            <Heart className="w-7 h-7" style={{ color: "var(--brand-rose)" }} />
          </div>
          <h2 className="text-[20px] font-semibold mb-2" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
            No saved providers yet
          </h2>
          <p className="text-[15px] mb-6 max-w-md mx-auto" style={{ color: "var(--text-secondary)" }}>
            Browse Perth beauty professionals and tap the heart to save your favourites here for later.
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium text-white transition-transform hover:scale-105"
            style={{ background: "var(--brand-rose)" }}
          >
            Browse providers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((p) => (
            <ProviderCard
              key={p.slug}
              slug={p.slug}
              businessName={p.businessName}
              city={p.city}
              categories={p.categories}
              averageRating={p.averageRating ?? 0}
              totalReviews={p.totalReviews ?? 0}
              logoUrl={p.logoUrl}
              isVerified={p.isVerified}
              hasRealData={p.hasRealData}
            />
          ))}
        </div>
      )}
    </main>
  );
}
