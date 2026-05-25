import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

export const metadata: Metadata = generatePageMeta({
  title: "Beauty Categories in Perth | Appilico Beauty",
  description: "Browse all beauty service categories in Perth — nail salons, hair stylists, lash techs, brow artists, skin clinics, makeup artists and more.",
  path: "/categories",
});

const CATEGORY_GRADIENTS: Record<string, string> = {
  nails: "linear-gradient(135deg, #E8A8AD, #C8737A)",
  hair: "linear-gradient(135deg, #E8D5B0, #C9A96E)",
  lashes: "linear-gradient(135deg, #C4A8C8, #9B7B84)",
  brows: "linear-gradient(135deg, #E8A8AD, #C8737A)",
  "skin-care": "linear-gradient(135deg, #A8C8B0, #7B9B84)",
  makeup: "linear-gradient(135deg, #D4A0A8, #A35560)",
  body: "linear-gradient(135deg, #E8A8C0, #C8737A)",
  massage: "linear-gradient(135deg, #B8D4D4, #6B9B9B)",
  cosmetic: "linear-gradient(135deg, #C4A8C8, #9B7B84)",
  wellness: "linear-gradient(135deg, #A8C8B8, #7B9B8C)",
};

export default function CategoriesPage() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)", padding: "64px 24px 56px", textAlign: "center" }}>
        <p className="text-[13px] font-medium uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--brand-rose)" }}>
          Find Your Service
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", fontWeight: 400, marginBottom: 16 }}>
          Browse by <em style={{ color: "var(--brand-rose)" }}>Category</em>
        </h1>
        <p className="text-[17px] font-light max-w-[500px] mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          Discover Perth&apos;s top beauty professionals across {BEAUTY_CATEGORIES.length} service categories
        </p>
      </section>

      <section style={{ padding: "56px 24px", background: "var(--bg-primary)" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BEAUTY_CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="premium-card group block overflow-hidden animate-fade-in-up"
              style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "var(--bg-card)", animationDelay: `${i * 0.04}s` }}
            >
              <div className="flex items-center justify-center group-hover:scale-105 transition-transform duration-500" style={{ height: 120, background: CATEGORY_GRADIENTS[cat.slug], fontSize: 52 }}>
                {cat.icon}
              </div>
              <div style={{ padding: "20px 24px 24px" }}>
                <h2 className="text-[1.4rem]" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>
                  {cat.name}
                </h2>
                <p className="text-[14px] font-light leading-relaxed mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                  {cat.description}
                </p>
                <span className="text-[13px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: "var(--brand-rose)", fontFamily: "var(--font-body)" }}>
                  Browse {cat.name} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
