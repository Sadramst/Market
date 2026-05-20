import type { Metadata } from "next";
import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { generatePageMeta } from "@/lib/seo";
import { Breadcrumbs } from "@/components/ui";

export const metadata: Metadata = generatePageMeta({
  title: "Perth Suburbs — Beauty Services by Location",
  description: "Find beauty services in your Perth suburb. Browse nail salons, hair stylists, and beauty professionals by location across Western Australia.",
  path: "/suburbs",
});

type Suburb = {
  id: string;
  name: string;
  slug: string;
  state: string;
  postCode: string;
  providerCount: number;
};

export default async function SuburbsPage() {
  const suburbs = await fetchApi<Suburb[]>("/locations/suburbs", { revalidate: 3600, tags: ["suburbs"] });

  // Group by first letter
  const grouped: Record<string, Suburb[]> = {};
  if (suburbs) {
    for (const s of suburbs) {
      const letter = s.name.charAt(0).toUpperCase();
      if (!grouped[letter]) grouped[letter] = [];
      grouped[letter].push(s);
    }
  }
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Suburbs" }]} />

      <h1 className="text-3xl font-display font-bold mb-2">Perth Suburbs</h1>
      <p className="text-gray-500 mb-10">Browse beauty services by location</p>

      {/* Letter navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {sortedLetters.map((letter) => (
          <a key={letter} href={`#${letter}`} className="w-8 h-8 flex items-center justify-center rounded bg-rose-50 text-rose-600 text-sm font-medium hover:bg-rose-100 transition-colors">
            {letter}
          </a>
        ))}
      </div>

      {sortedLetters.map((letter) => (
        <div key={letter} id={letter} className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">{letter}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {grouped[letter].map((suburb) => (
              <Link
                key={suburb.slug}
                href={`/${suburb.slug}`}
                className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-100 hover:border-rose-200 hover:shadow-sm transition-all group"
              >
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{suburb.name}</span>
                {suburb.providerCount > 0 && (
                  <span className="text-xs text-gray-400">{suburb.providerCount}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
