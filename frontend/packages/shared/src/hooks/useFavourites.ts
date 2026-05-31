"use client";
import { useState, useEffect, useCallback } from "react";

export interface FavouriteProvider {
  slug: string;
  businessName: string;
  city?: string;
  categories?: string[];
  averageRating?: number;
  totalReviews?: number;
  logoUrl?: string;
  isVerified?: boolean;
  hasRealData?: boolean;
  savedAt: number;
}

const STORAGE_KEY = "appilico_favourites";
const EVENT_NAME = "appilico:favourites-changed";

/** Read the favourites list from localStorage (SSR-safe). */
export function readFavourites(): FavouriteProvider[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FavouriteProvider[]) : [];
  } catch {
    return [];
  }
}

function writeFavourites(list: FavouriteProvider[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch {
    // storage may be unavailable (private mode / quota) — fail silently
  }
}

/**
 * Manage saved/favourite providers. Persists to localStorage so customers can
 * shortlist providers without creating an account. Stays in sync across
 * components and browser tabs.
 */
export function useFavourites() {
  const [favourites, setFavourites] = useState<FavouriteProvider[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavourites(readFavourites());
    setHydrated(true);

    const sync = () => setFavourites(readFavourites());
    window.addEventListener(EVENT_NAME, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT_NAME, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isFavourite = useCallback(
    (slug: string) => favourites.some((f) => f.slug === slug),
    [favourites]
  );

  const addFavourite = useCallback((provider: Omit<FavouriteProvider, "savedAt">) => {
    const current = readFavourites();
    if (current.some((f) => f.slug === provider.slug)) return;
    writeFavourites([{ ...provider, savedAt: Date.now() }, ...current]);
  }, []);

  const removeFavourite = useCallback((slug: string) => {
    writeFavourites(readFavourites().filter((f) => f.slug !== slug));
  }, []);

  const toggleFavourite = useCallback((provider: Omit<FavouriteProvider, "savedAt">) => {
    const current = readFavourites();
    if (current.some((f) => f.slug === provider.slug)) {
      writeFavourites(current.filter((f) => f.slug !== provider.slug));
    } else {
      writeFavourites([{ ...provider, savedAt: Date.now() }, ...current]);
    }
  }, []);

  const clearFavourites = useCallback(() => writeFavourites([]), []);

  return {
    favourites,
    count: favourites.length,
    hydrated,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    clearFavourites,
  };
}
