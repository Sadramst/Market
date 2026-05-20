import type { Metadata } from "next";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";
import { PERTH_SUBURBS } from "@/lib/suburbs";

export const metadata: Metadata = generatePageMeta({
  title: "Perth Suburbs — Beauty Services by Location",
  description: "Find beauty services in your Perth suburb. Browse nail salons, hair stylists, and beauty professionals by location across Western Australia.",
  path: "/suburbs",
});

type ApiSuburb = { slug: string; providerCount: number };

export default async function SuburbsPage() {
  // Fetch provider counts from API (graceful fallback)
  const apiSuburbs = await fetchApi<ApiSuburb[]>("/locations/suburbs", { revalidate: 3600, tags: ["suburbs"] });
  const countMap = new Map<string, number>();
  if (apiSuburbs) {
    for (const s of apiSuburbs) countMap.set(s.slug, s.providerCount);
  }

  // Merge static list with API counts
  const suburbs = PERTH_SUBURBS.map((s) => ({
    ...s,
    providerCount: countMap.get(s.slug) ?? 0,
  }));

  // Group by first letter
  const grouped: Record<string, typeof suburbs> = {};
  for (const s of suburbs) {
    const letter = s.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(s);
  }
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Suburbs" }]} />

      <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 text-gray-900">Perth Suburbs</h1>
      <p className="text-gray-400 mb-10">Browse beauty services by location — {suburbs.length} suburbs across Perth</p>

      {/* Letter navigation */}
      <div className="flex flex-wrap gap-1.5 mb-10 p-4 bg-white rounded-2xl border border-gray-100">
        {sortedLetters.map((letter) => (
          <a key={letter} href={`#${letter}`} className="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 text-sm font-semibold hover:bg-rose-100 hover:text-rose-600 transition-all">
            {letter}
          </a>
        ))}
      </div>

      {sortedLetters.map((letter) => (
        <div key={letter} id={letter} className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center text-rose-500 text-sm font-bold">{letter}</span>
            <span>{letter}</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {grouped[letter].map((suburb) => (
              <Link
                key={suburb.slug}
                href={`/${suburb.slug}`}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 hover:border-rose-200 transition-all group hover:shadow-sm"
              >
                <div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{suburb.name}</span>
                  <span className="block text-xs text-gray-300">{suburb.postCode}</span>
                </div>
                {suburb.providerCount > 0 ? (
                  <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full">{suburb.providerCount}</span>
                ) : (
                  <span className="text-xs text-primary/50 bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
