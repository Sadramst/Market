"use client";

import { Heart } from "lucide-react";
import { useFavourites, type FavouriteProvider } from "@appilico/shared/hooks";

type FavouriteButtonProps = {
  provider: Omit<FavouriteProvider, "savedAt">;
  /** "overlay" = floating heart on a card cover; "inline" = standalone button with label */
  variant?: "overlay" | "inline";
  className?: string;
};

export function FavouriteButton({ provider, variant = "overlay", className }: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite, hydrated } = useFavourites();
  const active = hydrated && isFavourite(provider.slug);

  const handleClick = (e: React.MouseEvent) => {
    // Card covers are wrapped in a <Link>; don't navigate when saving.
    e.preventDefault();
    e.stopPropagation();
    toggleFavourite(provider);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={active ? "Remove from saved" : "Save provider"}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[14px] font-medium transition-colors ${className ?? ""}`}
        style={{
          border: "1px solid var(--border)",
          background: active ? "var(--brand-rose)" : "var(--bg-card)",
          color: active ? "#fff" : "var(--text-primary)",
        }}
      >
        <Heart className="w-4 h-4" fill={active ? "currentColor" : "none"} strokeWidth={2} />
        {active ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Remove from saved" : "Save provider"}
      data-testid="favourite-button"
      className={`flex items-center justify-center transition-transform hover:scale-110 ${className ?? ""}`}
      style={{
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(4px)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <Heart
        className="w-4 h-4"
        style={{ color: active ? "var(--brand-rose)" : "var(--text-secondary)" }}
        fill={active ? "var(--brand-rose)" : "none"}
        strokeWidth={2}
      />
    </button>
  );
}
