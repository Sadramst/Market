import type { Metadata } from "next";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = generatePageMeta({
  title: "Beauty Categories — All Services",
  description: "Browse all beauty service categories in Perth. Find nail salons, hair stylists, lash technicians, brow artists, skin clinics, and more.",
  path: "/categories",
});

type Category = {
  id: string;
  name: string;
  slug: string;
  iconName?: string;
  providerCount: number;
  subCategories: Array<{ id: string; name: string; slug: string; providerCount: number }>;
};

const categoryIcons: Record<string, string> = {
  nails: "💅", hair: "💇‍♀️", lashes: "👁️", brows: "✨",
  "skin-care": "🧴", makeup: "💄", body: "🌸", cosmetic: "💉", wellness: "🧘",
};

export default async function CategoriesPage() {
  const categories = await fetchApi<Category[]>("/categories/beauty", { revalidate: 3600, tags: ["categories"] });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />

      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">Beauty Categories</h1>
      <p className="text-gray-400 mb-10">Browse all beauty service types available in Perth</p>

      {categories && categories.length > 0 ? (
        <div className="space-y-10">
          {categories.map((cat, i) => (
            <div key={cat.slug} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <Link href={`/category/${cat.slug}`} className="flex items-center gap-3 group mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                  <span className="text-2xl">{categoryIcons[cat.slug] || "✨"}</span>
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold group-hover:text-primary transition-colors">
                    {cat.name}
                  </h2>
                  <span className="text-sm text-gray-300">{cat.providerCount} provider{cat.providerCount !== 1 ? "s" : ""}</span>
                </div>
              </Link>
              {cat.subCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 ml-[60px]">
                  {cat.subCategories.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/category/${sub.slug}`}
                      className="px-3.5 py-1.5 bg-rose-50 text-rose-500 rounded-full text-sm font-medium hover:bg-rose-100 hover:text-rose-600 transition-all"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <span className="text-4xl mb-4 block">💅</span>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories available</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Beauty service categories will appear here soon. Check back later.</p>
        </div>
      )}
    </div>
  );
}
