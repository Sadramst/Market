"use client";

import { useEffect, useRef } from "react";
import { SuburbAutocomplete } from "./SuburbAutocomplete";

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

      <div className="flex-1">
        <input
          type="text"
          name="q"
          defaultValue={defaultQuery}
          placeholder="Search services, salons…"
          className="w-full px-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
          style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}
        />
      </div>

      <SuburbAutocomplete defaultValue={defaultSuburb} />

      <select
        name="sortBy"
        defaultValue={defaultSort}
        className="px-4 py-3.5 text-[13px] bg-transparent focus:outline-none sm:w-44"
        style={{ border: "1px solid var(--border)", borderRadius: "2px", fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}
      >
        <option value="rating">Top Rated</option>
        <option value="distance">Near Me</option>
        <option value="newest">Newest</option>
        <option value="name">A–Z</option>
        <option value="reviews">Most Reviewed</option>
      </select>

      <button
        type="submit"
        className="px-8 py-3.5 text-[14px] font-medium text-white shrink-0 transition-all"
        style={{ background: "var(--brand-rose)", borderRadius: "2px", fontFamily: "var(--font-body)" }}
      >
        Search
      </button>
    </form>
  );
}
