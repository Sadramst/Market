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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Suburbs" }]} />

      <div className="mb-12 mt-6">
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
          Perth <em>Suburbs</em>
        </h1>
        <p className="mt-2 text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          {suburbs.length} suburbs · {totalWithProviders} with active providers
        </p>
      </div>

      {/* Letter navigation */}
      <div className="flex flex-wrap gap-1 mb-12 p-4" style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        {sortedLetters.map((letter) => (
          <a key={letter} href={`#${letter}`}
            className="w-9 h-9 flex items-center justify-center text-[13px] font-semibold transition-all hover:text-white"
            style={{ color: 'var(--text-muted)', borderRadius: '4px' }}
          >
            {letter}
          </a>
        ))}
      </div>

      {sortedLetters.map((letter) => (
        <div key={letter} id={letter} className="mb-10">
          <h2 className="text-[14px] font-semibold mb-4 pb-2 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>
            <span className="w-7 h-7 flex items-center justify-center text-[12px] font-bold" style={{ background: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--brand-rose)' }}>{letter}</span>
            {letter}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {grouped[letter].map((suburb) => (
              <Link key={suburb.slug} href={`/${suburb.slug}`}
                className="flex items-center justify-between p-3.5 group transition-all"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}
              >
                <div>
                  <span className="text-[13px] font-medium transition-colors" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{suburb.name}</span>
                  <span className="block text-[11px]" style={{ color: 'var(--text-muted)' }}>{suburb.postCode}</span>
                </div>
                {suburb.providerCount > 0 ? (
                  <span className="text-[10px] px-2 py-0.5 font-medium" style={{ background: 'var(--bg-secondary)', borderRadius: '50px', color: 'var(--text-muted)' }}>{suburb.providerCount}</span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 font-medium" style={{ background: 'rgba(200,115,122,0.08)', borderRadius: '50px', color: 'var(--brand-rose)' }}>New</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
