import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { BEAUTY_CATEGORIES } from "@/lib/categories";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { FALLBACK_FEATURED_PROVIDERS } from "@/lib/fallback-providers";
import { HeroSearchForm } from "@/components/search/HeroSearchForm";

const popularSuburbs = [
  { name: "Perth CBD", slug: "perth" },
  { name: "Subiaco", slug: "subiaco" },
  { name: "Fremantle", slug: "fremantle" },
  { name: "Joondalup", slug: "joondalup" },
  { name: "Claremont", slug: "claremont" },
  { name: "Scarborough", slug: "scarborough" },
  { name: "Applecross", slug: "applecross" },
  { name: "Mount Lawley", slug: "mount-lawley" },
  { name: "Leederville", slug: "leederville" },
  { name: "Nedlands", slug: "nedlands" },
  { name: "Victoria Park", slug: "victoria-park" },
  { name: "Canning Vale", slug: "canning-vale" },
];

const testimonials = [
  { name: "Sarah M.", suburb: "Subiaco", text: "Found my go-to nail tech through Appilico. The reviews made it so easy to choose!", rating: 5, service: "Nails" },
  { name: "Jessica L.", suburb: "Fremantle", text: "As a lash artist, Appilico has been amazing for growing my client base.", rating: 5, service: "Lashes" },
  { name: "Emily R.", suburb: "Claremont", text: "Finally a proper beauty directory for Perth! Clean, easy to use, and quality providers.", rating: 5, service: "Hair" },
];

export default async function HomePage() {
  const [providers, countData, statsData] = await Promise.all([
    fetchApi<{ items: Array<{ slug: string; businessName: string; city: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string; categories?: string[] }> }>(
      "/providers/search?pageSize=6&sortBy=rating&marketplaceType=0",
      { revalidate: 300, tags: ["featured-providers"] }
    ),
    fetchApi<{ pagination: { totalCount: number } }>(
      "/providers/search?pageSize=1&marketplaceType=0",
      { revalidate: 300, tags: ["provider-count"] }
    ),
    fetchApi<{ providerCount: number; suburbCount: number; categoryCount: number }>(
      "/providers/stats",
      { revalidate: 300, tags: ["stats"] }
    ),
  ]);

  const totalProviders = countData?.pagination?.totalCount ?? 0;
  const suburbCount = statsData?.suburbCount ?? 70;
  const categoryCount = statsData?.categoryCount ?? 10;
  const apiFeatured = providers?.items ?? [];
  const featuredProviders = apiFeatured.length > 0 ? apiFeatured : FALLBACK_FEATURED_PROVIDERS;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center', background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Left — 60% */}
            <div className="lg:col-span-3">
              <p className="animate-fade-in-up text-[12px] font-medium uppercase tracking-[0.15em]" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-rose)' }}>
                Perth&apos;s Premier Beauty Platform
              </p>

              <h1 className="animate-fade-in-up animation-delay-100 mt-6 leading-[1.08]" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: 'var(--text-primary)', fontWeight: 400 }}>
                Discover Perth&apos;s<br />
                <em style={{ color: 'var(--brand-rose)' }}>Finest</em> Beauty<br />
                Professionals
              </h1>

              <p className="animate-fade-in-up animation-delay-200 mt-6 text-[18px] font-light max-w-[460px] leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                Compare reviews, browse portfolios, and connect directly with top-rated salons, spas, and beauty experts across Perth.
              </p>

              <HeroSearchForm />

              {/* Trending pills */}
              <div className="animate-fade-in-up animation-delay-400 mt-5 flex flex-wrap items-center gap-2">
                {["Nail Art Perth", "Lash Extensions", "Balayage Subiaco", "Massage Perth", "Brow Lamination", "Facials"].map((term) => (
                  <Link key={term} href={`/search?q=${encodeURIComponent(term)}`}
                    className="px-3 py-1.5 text-[12px] transition-all duration-200 hover:text-white"
                    style={{ border: '1px solid var(--border)', borderRadius: '50px', color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                  >
                    {term}
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <div className="animate-fade-in-up animation-delay-500 mt-8 flex items-center gap-6 text-[13px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
                <span suppressHydrationWarning>{totalProviders > 0 ? `${totalProviders.toLocaleString('en-AU')}+` : '1,000+'} Providers</span>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span>{suburbCount}+ Suburbs</span>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span>{categoryCount} Categories</span>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span>Free to Start</span>
              </div>
            </div>

            {/* Right — decorative cards (desktop) */}
            <div className="hidden lg:flex lg:col-span-2 relative h-[400px] items-center justify-center">
              {[
                { name: 'Fountain of Youth', cat: 'Nails', rating: '4.9', rotate: '-3deg', bg: 'linear-gradient(135deg, #E8A8AD, #C8737A)', delay: '0.5s', top: '10%', left: '10%' },
                { name: 'Harper Hair', cat: 'Hair', rating: '4.9', rotate: '0deg', bg: 'linear-gradient(135deg, #E8D5B0, #C9A96E)', delay: '0.7s', top: '25%', left: '25%' },
                { name: 'Ellie Dunne Collective', cat: 'Brows', rating: '5.0', rotate: '4deg', bg: 'linear-gradient(135deg, #E8A8AD, #C8737A)', delay: '0.9s', top: '40%', left: '5%' },
              ].map((card) => (
                <div key={card.name} className="absolute animate-fade-in-up w-[220px]" style={{ top: card.top, left: card.left, transform: `rotate(${card.rotate})`, animationDelay: card.delay }}>
                  <div className="overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                    <div className="h-24" style={{ background: card.bg }} />
                    <div className="p-3">
                      <p className="text-[14px] italic" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{card.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3 star-filled" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-[12px] font-medium" style={{ color: 'var(--text-primary)' }}>{card.rating}</span>
                      </div>
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px]" style={{ background: 'var(--bg-secondary)', borderRadius: '50px', color: 'var(--text-secondary)' }}>{card.cat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
            Browse by <em>Category</em>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {BEAUTY_CATEGORIES.map((cat, i) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`}
                className={`premium-card group relative overflow-hidden p-5 text-center animate-fade-in-up bg-gradient-to-br ${cat.gradient}`}
                style={{ borderRadius: '8px', border: '1px solid var(--border)', animationDelay: `${i * 0.05}s` }}
              >
                <span className="text-[40px] block mb-3 group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <h3 className="text-[15px] font-semibold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>{cat.name}</h3>
                <p className="text-[12px] font-light mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROVIDERS ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
                Top-Rated <em>Professionals</em>
              </h2>
              <p className="text-[15px] font-light mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                Handpicked beauty experts loved by Perth locals
              </p>
            </div>
            <Link href="/search" className="mt-4 sm:mt-0 text-[13px] font-medium transition-colors hover:underline" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>
              View all →
            </Link>
          </div>

          {featuredProviders.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProviders.slice(0, 6).map((p) => (
                <ProviderCard key={p.slug} {...p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <span className="text-[48px] block mb-4">💅</span>
              <h3 className="text-[20px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Featured providers coming soon</h3>
              <p className="text-[14px] mt-2 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Be among the first to list your business on Perth&apos;s newest beauty marketplace.</p>
              <Link href="/join" className="inline-flex items-center mt-6 px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
                List Your Business
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "01", title: "Search", desc: "Browse beauty professionals by service, suburb, or name across Perth" },
              { step: "02", title: "Compare", desc: "Read verified reviews, view portfolios, and compare services and prices" },
              { step: "03", title: "Connect", desc: "Contact your chosen professional directly — no middleman, no fees" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <span className="text-[72px] font-light leading-none" style={{ fontFamily: 'var(--font-display)', color: 'rgba(200,115,122,0.08)' }}>{item.step}</span>
                <h3 className="text-[22px] -mt-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>{item.title}</h3>
                <p className="text-[14px] font-light mt-3 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBURBS ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
            Beauty <em>Near You</em>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {popularSuburbs.map((s) => (
              <Link key={s.slug} href={`/${s.slug}`}
                className="px-5 py-2.5 text-[14px] transition-all duration-200 hover:text-white"
                style={{ border: '1px solid var(--border)', borderRadius: '50px', fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}
              >
                {s.name}
              </Link>
            ))}
          </div>
          <Link href="/suburbs" className="inline-block mt-8 text-[13px] transition-colors hover:underline" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>
            View all {suburbCount}+ Perth suburbs →
          </Link>
        </div>
      </section>

      {/* ===== FOR PROVIDERS (Dark) ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--gradient-dark)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
                Grow Your Beauty<br /><em style={{ color: 'var(--brand-gold)' }}>Business</em>
              </h2>
              <p className="mt-4 text-[15px] font-light max-w-lg leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(250,247,244,0.7)' }}>
                Join Perth&apos;s fastest-growing beauty marketplace. Create your free profile, showcase your work, and get discovered by thousands of local customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/join" className="inline-flex items-center justify-center px-8 py-3.5 text-[14px] font-medium text-white transition-all" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
                  Get Started — It&apos;s Free
                </Link>
                <Link href="/about" className="inline-flex items-center justify-center px-8 py-3.5 text-[14px] font-medium transition-all" style={{ border: '1px solid var(--brand-gold)', color: 'var(--brand-gold)', borderRadius: '2px' }}>
                  Learn More
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📍", title: "Local SEO", desc: "Rank for your suburb + service" },
                { icon: "⭐", title: "Real Reviews", desc: "Build trust with verified reviews" },
                { icon: "📸", title: "Portfolio", desc: "Showcase your best work" },
                { icon: "📊", title: "Insights", desc: "Track views & enquiries" },
              ].map((f) => (
                <div key={f.title} className="p-5 transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px' }}>
                  <span className="text-[24px] block mb-3">{f.icon}</span>
                  <h3 className="text-[14px] font-medium" style={{ color: 'var(--text-on-dark)', fontFamily: 'var(--font-body)' }}>{f.title}</h3>
                  <p className="text-[12px] mt-1" style={{ color: 'rgba(250,247,244,0.5)', fontFamily: 'var(--font-body)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
              What Perth <em>Locals</em> Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
                <span className="text-[48px] leading-none" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-rose)' }}>&ldquo;</span>
                <p className="text-[15px] italic leading-relaxed -mt-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 300 }}>{t.text}</p>
                <div className="flex items-center gap-3 mt-6 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)' }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{t.name}</p>
                    <p className="text-[12px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>{t.suburb} · {t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEO CONTENT ===== */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto text-[16px] leading-[1.8]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          <h2 className="text-center mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 400 }}>Beauty Services in Perth</h2>
          <p>
            Appilico Beauty is Perth&apos;s premier platform for discovering local beauty professionals. Whether you need a <Link href="/category/nails" style={{ color: 'var(--brand-rose)' }}>nail salon</Link>, <Link href="/category/hair" style={{ color: 'var(--brand-rose)' }}>hair stylist</Link>, <Link href="/category/lashes" style={{ color: 'var(--brand-rose)' }}>lash technician</Link>, <Link href="/category/massage" style={{ color: 'var(--brand-rose)' }}>massage therapist</Link>, or <Link href="/category/makeup" style={{ color: 'var(--brand-rose)' }}>makeup artist</Link>, our marketplace makes it easy to find, compare, and connect.
          </p>
          <p className="mt-4">
            Browse verified professionals across Perth suburbs including <Link href="/subiaco" style={{ color: 'var(--brand-rose)' }}>Subiaco</Link>, <Link href="/fremantle" style={{ color: 'var(--brand-rose)' }}>Fremantle</Link>, <Link href="/joondalup" style={{ color: 'var(--brand-rose)' }}>Joondalup</Link>, <Link href="/claremont" style={{ color: 'var(--brand-rose)' }}>Claremont</Link>, and <Link href="/scarborough" style={{ color: 'var(--brand-rose)' }}>Scarborough</Link>. Every provider is reviewed by real customers.
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Appilico Beauty", url: "https://beauty.appilico.com.au", description: "Perth's premier beauty and wellness marketplace.", potentialAction: { "@type": "SearchAction", target: "https://beauty.appilico.com.au/search?q={search_term_string}", "query-input": "required name=search_term_string" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "Appilico Beauty", url: "https://beauty.appilico.com.au", logo: "https://beauty.appilico.com.au/logo.png", contactPoint: { "@type": "ContactPoint", contactType: "customer service", areaServed: "AU" } }) }} />
    </>
  );
}
