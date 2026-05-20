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
  const apiSuburbs = await fetchApi<ApiSuburb[]>("/locations/suburbs", { revalidate: 3600, tags: ["suburbs"] });
  const countMap = new Map<string, number>();
  if (apiSuburbs) {
    for (const s of apiSuburbs) countMap.set(s.slug, s.providerCount);
  }

  const suburbs = PERTH_SUBURBS.map((s) => ({
    ...s,
    providerCount: countMap.get(s.slug) ?? 0,
  }));

  const grouped: Record<string, typeof suburbs> = {};
  for (const s of suburbs) {
    const letter = s.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(s);
  }
  const sortedLetters = Object.keys(grouped).sort();
  const totalWithProviders = suburbs.filter((s) => s.providerCount > 0).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Suburbs" }]} />

      <div className="mb-12">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Local</span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Perth Suburbs</h1>
        <p className="text-gray-400 mt-2 text-[15px]">{suburbs.length} suburbs &middot; {totalWithProviders} with active providers</p>
      </div>

      {/* Letter navigation */}
      <div className="flex flex-wrap gap-1 mb-12 p-4 bg-white rounded-2xl border border-gray-100/80">
        {sortedLetters.map((letter) => (
          <a key={letter} href={`#${letter}`} className="w-9 h-9 flex items-center justify-center rounded-xl text-[13px] font-semibold text-gray-400 hover:text-primary hover:bg-blush transition-all">
            {letter}
          </a>
        ))}
      </div>

      {sortedLetters.map((letter) => (
        <div key={letter} id={letter} className="mb-10">
          <h2 className="text-[13px] font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="w-7 h-7 bg-blush rounded-lg flex items-center justify-center text-primary text-[11px] font-bold">{letter}</span>
            {letter}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {grouped[letter].map((suburb) => (
              <Link
                key={suburb.slug}
                href={`/${suburb.slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-gray-100/80 hover:border-primary/20 transition-all group hover:shadow-sm"
              >
                <div>
                  <span className="text-[13px] font-medium text-gray-700 group-hover:text-primary transition-colors">{suburb.name}</span>
                  <span className="block text-[11px] text-gray-300">{suburb.postCode}</span>
                </div>
                {suburb.providerCount > 0 ? (
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full font-medium">{suburb.providerCount}</span>
                ) : (
                  <span className="text-[10px] text-primary/50 bg-primary/5 px-2 py-0.5 rounded-full font-medium">New</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
