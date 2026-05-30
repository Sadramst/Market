"use client";

import { useEffect, useRef } from "react";
import { SuburbAutocomplete } from "./SuburbAutocomplete";
import { Search, SlidersHorizontal } from "lucide-react";

interface Props {
  defaultQuery?: string;
  defaultSuburb?: string;
  defaultSort?: string;
  defaultPostCode?: string;
  defaultCategory?: string;
  categoryOptions: { label: string; value: string }[];
}

/**
 * Client-side wrapper for the search form.
 * Injects the user's preferred suburb postCode from localStorage if no postCode
 * is already present in the URL, enabling location-aware browsing automatically.
 */
export function SearchFormClient({
  defaultQuery = "",
  defaultSuburb = "",
  defaultSort = "rating",
  defaultPostCode = "",
  defaultCategory = "",
  categoryOptions,
}: Props) {
  const postCodeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Only inject preferred postCode when the URL has none — avoids overriding explicit user search
    if (defaultPostCode || !postCodeRef.current) return;
    try {
      const raw = localStorage.getItem("appilico_preferred_suburb");
      if (raw) {
        const pref = JSON.parse(raw) as { postCode?: string };
        if (pref?.postCode) {
          postCodeRef.current.value = pref.postCode;
        }
      }
    } catch { /* non-critical */ }
  }, [defaultPostCode]);

  return (
    <form className="flex flex-col sm:flex-row gap-3">
      {/* Hidden postCode — populated from preferred suburb if not already in URL */}
      <input ref={postCodeRef} type="hidden" name="postCode" defaultValue={defaultPostCode} />
      <input type="hidden" name="category" value={defaultCategory} />

      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
        <input
          type="text"
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search services, salons…"
          className="w-full pl-11 pr-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
          style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
        />
      </div>

      <SuburbAutocomplete defaultValue={defaultSuburb} />

      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
        <select
          name="sortBy"
          defaultValue={defaultSort}
          className="pl-9 pr-4 py-3.5 text-[13px] bg-transparent focus:outline-none sm:w-44"
          style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
        >
        <option value="rating">Top Rated</option>
        <option value="distance">Near Me</option>
        <option value="newest">Newest</option>
        <option value="name">A–Z</option>
        <option value="reviews">Most Reviewed</option>
      </select>
      </div>

      <button
        type="submit"
        className="px-8 py-3.5 text-[14px] font-medium text-white shrink-0 transition-all flex items-center gap-2"
        style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
      >
        <Search className="w-4 h-4" strokeWidth={2} />
        Search
      </button>
    </form>
  );
}
