import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";
import { PERTH_SUBURBS } from "@/lib/suburbs";

export const metadata: Metadata = generatePageMeta({
  title: "Perth Suburbs — Beauty Services by Location",
  description: "Find beauty services in your Perth suburb. Browse nail salons, hair stylists, and beauty professionals by location across Western Australia.",
  path: "/suburbs",
});

export default function SuburbsPage() {
  const grouped: Record<string, typeof PERTH_SUBURBS[number][]> = {};
  for (const s of PERTH_SUBURBS) {
    const letter = s.name.charAt(0).toUpperCase();
    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(s);
  }
  const sortedLetters = Object.keys(grouped).sort();

  return (
    <>
      <section style={{ background: "var(--gradient-hero)", padding: "64px 24px 56px", textAlign: "center" }}>
        <p className="text-[13px] font-medium uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--brand-rose)" }}>
          Find Local Providers
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", fontWeight: 400, marginBottom: 16 }}>
          Perth <em style={{ color: "var(--brand-rose)" }}>Suburbs</em>
        </h1>
        <p className="text-[17px] font-light max-w-[500px] mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          Browse beauty professionals across {PERTH_SUBURBS.length} Perth suburbs
        </p>
      </section>

      <section style={{ padding: "56px 24px", background: "var(--bg-primary)" }}>
        <div className="max-w-[1200px] mx-auto">
          {/* Letter navigation */}
          <div className="flex flex-wrap gap-1 mb-12 p-4" style={{ background: "var(--bg-secondary)", borderRadius: "8px", border: "1px solid var(--border)" }}>
            {sortedLetters.map((letter) => (
              <a key={letter} href={`#${letter}`}
                className="w-9 h-9 flex items-center justify-center text-[13px] font-semibold transition-all hover:text-white"
                style={{ color: "var(--text-muted)", borderRadius: "4px" }}
              >
                {letter}
              </a>
            ))}
          </div>

          {sortedLetters.map((letter) => (
            <div key={letter} id={letter} className="mb-10">
              <h2 className="text-[14px] font-semibold mb-4 pb-2 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)", fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>
                <span className="w-7 h-7 flex items-center justify-center text-[12px] font-bold" style={{ background: "var(--bg-secondary)", borderRadius: "4px", color: "var(--brand-rose)" }}>{letter}</span>
                {letter}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {grouped[letter].map((suburb) => (
                  <Link key={suburb.slug} href={`/${suburb.slug}`}
                    className="flex items-center justify-between p-3.5 group transition-all"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px" }}
                  >
                    <div>
                      <span className="text-[13px] font-medium transition-colors" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>{suburb.name}</span>
                      <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>{suburb.postCode}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
