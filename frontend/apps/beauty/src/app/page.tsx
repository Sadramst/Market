import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

const popularSuburbs = [
  { name: "Perth CBD", slug: "perth", emoji: "🏙️" },
  { name: "Subiaco", slug: "subiaco", emoji: "🌿" },
  { name: "Fremantle", slug: "fremantle", emoji: "⚓" },
  { name: "Joondalup", slug: "joondalup", emoji: "🌊" },
  { name: "Claremont", slug: "claremont", emoji: "🛍️" },
  { name: "Scarborough", slug: "scarborough", emoji: "🏖️" },
  { name: "Applecross", slug: "applecross", emoji: "🌅" },
  { name: "Mount Lawley", slug: "mount-lawley", emoji: "🎭" },
  { name: "Leederville", slug: "leederville", emoji: "☕" },
  { name: "Nedlands", slug: "nedlands", emoji: "🌳" },
  { name: "Victoria Park", slug: "victoria-park", emoji: "🎪" },
  { name: "Canning Vale", slug: "canning-vale", emoji: "🏡" },
];

const testimonials = [
  { name: "Sarah M.", suburb: "Subiaco", text: "Found my go-to nail tech through Appilico. The reviews and gallery photos made it so easy to choose!", rating: 5, service: "Nails" },
  { name: "Jessica L.", suburb: "Fremantle", text: "As a lash artist, Appilico has been amazing for growing my client base. Love the easy profile setup.", rating: 5, service: "Lashes" },
  { name: "Emily R.", suburb: "Claremont", text: "Finally a proper beauty directory for Perth! Clean, easy to use, and the providers are all quality.", rating: 5, service: "Hair" },
  { name: "Priya K.", suburb: "Joondalup", text: "Booked my bridal makeup through here. The portfolio photos helped me find exactly the style I wanted.", rating: 5, service: "Makeup" },
];

export default async function HomePage() {
  const [providers, countData] = await Promise.all([
    fetchApi<{ items: Array<{ slug: string; businessName: string; city: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string; categories?: string[] }> }>(
      "/providers/search?pageSize=8&sortBy=rating&marketplaceType=0",
      { revalidate: 300, tags: ["featured-providers"] }
    ),
    fetchApi<{ pagination: { totalCount: number } }>(
      "/providers/search?pageSize=1&marketplaceType=0",
      { revalidate: 300, tags: ["provider-count"] }
    ),
  ]);

  const totalProviders = countData?.pagination?.totalCount ?? 0;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-white" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 15% 85%, rgba(212,98,122,0.06) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(196,154,108,0.06) 0%, transparent 50%)" }} />
        <div className="absolute top-32 -left-20 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-secondary/[0.03] rounded-full blur-[100px]" />

        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 w-full">
          <div className="max-w-3xl">
            <div className="animate-fade-in-up inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[13px] text-gray-500 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-soft" />
              Perth&apos;s Beauty Marketplace &mdash; {totalProviders > 0 ? `${totalProviders}+ professionals` : "Now live"}
            </div>

            <h1 className="animate-fade-in-up animation-delay-100 text-[clamp(2.5rem,6vw,5rem)] font-display font-bold text-gray-900 leading-[1.05] tracking-tight">
              Find your perfect<br />
              <span className="gradient-text">beauty professional</span>
            </h1>

            <p className="animate-fade-in-up animation-delay-200 text-lg sm:text-xl text-gray-400 mt-6 max-w-xl leading-relaxed">
              Discover, compare, and connect with top-rated salons, spas, and beauty experts across Perth.
            </p>

            {/* Search Bar */}
            <form action="/search" method="GET" className="animate-fade-in-up animation-delay-300 mt-10">
              <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-2 flex flex-col sm:flex-row gap-2 border border-gray-100 max-w-2xl">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" name="q" placeholder="What are you looking for?" className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-300 text-[15px]" />
                </div>
                <div className="flex-1 relative border-t sm:border-t-0 sm:border-l border-gray-100">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  <input type="text" name="suburb" placeholder="Suburb" className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder:text-gray-300 text-[15px]" />
                </div>
                <button type="submit" className="px-8 py-4 bg-gray-900 text-white rounded-xl text-[15px] font-semibold hover:bg-gray-800 transition-all hover:shadow-lg active:scale-[0.98] shrink-0">
                  Search
                </button>
              </div>
            </form>

            {/* Quick links */}
            <div className="animate-fade-in-up animation-delay-400 mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
              <span className="text-gray-300">Popular:</span>
              {["Nails", "Lash Extensions", "Hair Colour", "Brow Lamination", "Facials"].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="text-gray-400 hover:text-primary transition-colors">
                  {term}
                </Link>
              ))}
            </div>
          </div>

          {/* Floating stats on right (desktop) */}
          <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-4">
            {[
              { value: totalProviders > 0 ? `${totalProviders}+` : "50+", label: "Professionals", icon: "👩‍🎨" },
              { value: "70+", label: "Perth Suburbs", icon: "📍" },
              { value: `${BEAUTY_CATEGORIES.length}`, label: "Categories", icon: "✨" },
            ].map((stat, i) => (
              <div key={stat.label} className="animate-fade-in-up bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-5 w-44 shadow-sm" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <span className="text-2xl block mb-1">{stat.icon}</span>
                <div className="text-2xl font-display font-bold text-gray-900">{stat.value}</div>
                <div className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Services</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Browse by category</h2>
            </div>
            <Link href="/categories" className="mt-4 sm:mt-0 text-[13px] font-medium text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 group">
              View all categories
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {BEAUTY_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="premium-card group relative bg-white rounded-2xl border border-gray-100/80 p-6 overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-secondary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blush to-primary-light/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-2xl">{cat.icon}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">{cat.name}</h3>
                  <p className="text-[13px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{cat.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-primary text-[13px] font-medium opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Explore
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-blush/30 via-blush/50 to-white overflow-hidden">
        <div className="absolute inset-0 noise-overlay" />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">How It Works</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {[
              { step: "01", title: "Search", desc: "Browse beauty professionals by service type, suburb, or name", icon: "🔍" },
              { step: "02", title: "Compare", desc: "Read verified reviews, view portfolios, and compare prices", icon: "⭐" },
              { step: "03", title: "Connect", desc: "Reach out to your chosen professional directly", icon: "💬" },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center group animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                {i < 2 && (
                  <div className="hidden md:block absolute top-14 left-[60%] w-[80%] border-t-2 border-dashed border-primary/10" />
                )}
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white shadow-lg shadow-primary/5 border border-primary/5 mb-6 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1 transition-all duration-500">
                  <span className="text-4xl">{item.icon}</span>
                </div>
                <div className="text-[10px] font-bold text-primary/30 tracking-[0.3em] uppercase mb-2">Step {item.step}</div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-[14px] text-gray-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROVIDERS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Featured</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Top-rated professionals</h2>
              <p className="text-gray-400 mt-2 text-[15px]">Handpicked beauty experts loved by Perth locals</p>
            </div>
            <Link href="/search" className="mt-4 sm:mt-0 text-[13px] font-medium text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 group">
              View all
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {providers?.items && providers.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {providers.items.slice(0, 8).map((p, i) => (
                <Link key={p.slug} href={`/provider/${p.slug}`} className="premium-card group bg-white rounded-2xl border border-gray-100/80 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="aspect-[5/4] bg-gradient-to-br from-blush via-pink-50/50 to-cream relative overflow-hidden">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center">
                          <span className="text-2xl font-display gradient-text font-bold">{p.businessName.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                    {p.averageRating > 0 && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                        <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-[11px] font-bold text-gray-700">{p.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-[15px] text-gray-900 group-hover:text-primary transition-colors truncate">{p.businessName}</h3>
                    {p.tagline ? (
                      <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{p.tagline}</p>
                    ) : p.categories && p.categories.length > 0 ? (
                      <p className="text-[12px] text-gray-400 mt-1 line-clamp-1">{p.categories.slice(0, 2).join(" · ")}</p>
                    ) : null}
                    <div className="flex items-center justify-between mt-3">
                      {p.averageRating > 0 ? (
                        <span className="text-[11px] text-gray-400">{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</span>
                      ) : (
                        <span className="text-[11px] text-primary/60 font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                      )}
                      {p.city && (
                        <span className="text-[11px] text-gray-300 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {p.city}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gradient-to-br from-blush/30 to-cream/30 rounded-3xl border border-primary/5">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-lg shadow-primary/5 flex items-center justify-center mb-5">
                <span className="text-4xl">💅</span>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900">Coming Soon</h3>
              <p className="text-gray-400 mt-2 max-w-md mx-auto text-[15px]">Featured beauty professionals will appear here once providers start joining.</p>
              <Link href="/join" className="inline-flex items-center mt-6 px-6 py-3 bg-gray-900 text-white rounded-xl text-[13px] font-semibold hover:bg-gray-800 transition-all">
                Be the First to Join
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 bg-gradient-to-b from-white via-cream/30 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Reviews</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Loved by Perth locals</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="premium-card bg-white rounded-2xl p-6 border border-gray-100/80 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-[13px] text-gray-600 leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-[13px] font-semibold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.suburb} &middot; {t.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBURBS ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <div>
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Local</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Explore Perth suburbs</h2>
              <p className="text-gray-400 mt-2 text-[15px]">Find beauty services near you</p>
            </div>
            <Link href="/suburbs" className="mt-4 sm:mt-0 text-[13px] font-medium text-gray-400 hover:text-primary transition-colors inline-flex items-center gap-1 group">
              All 70+ suburbs
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularSuburbs.map((suburb, i) => (
              <Link
                key={suburb.slug}
                href={`/${suburb.slug}`}
                className="premium-card group text-center p-5 rounded-2xl bg-white border border-gray-100/80 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.03}s` }}
              >
                <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform duration-300">{suburb.emoji}</span>
                <span className="text-[13px] font-medium text-gray-700 group-hover:text-primary transition-colors">{suburb.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOR PROVIDERS CTA ===== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#0F0F0F] p-12 sm:p-20">
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(212,98,122,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 30%, rgba(196,154,108,0.1) 0%, transparent 50%)" }} />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.02] to-transparent" />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">For Professionals</span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mt-3 leading-tight">
                  Grow your beauty business
                </h2>
                <p className="text-gray-400 leading-relaxed mt-4 text-[15px] max-w-lg">
                  Join Perth&apos;s fastest-growing beauty marketplace. Create your free profile, showcase your work, collect reviews, and get discovered by thousands of local customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 mt-8">
                  <Link href="/join" className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 rounded-xl text-[15px] font-semibold hover:bg-gray-100 transition-all">
                    Get Started &mdash; It&apos;s Free
                  </Link>
                  <Link href="/about" className="inline-flex items-center justify-center px-8 py-4 border border-white/15 text-gray-300 rounded-xl text-[15px] font-medium hover:border-white/30 hover:text-white transition-all">
                    Learn More
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📍", title: "Local SEO", desc: "Rank for your suburb + service" },
                  { icon: "⭐", title: "Reviews", desc: "Build trust with real reviews" },
                  { icon: "📸", title: "Portfolio", desc: "Showcase your best work" },
                  { icon: "📊", title: "Insights", desc: "Track views & enquiries" },
                ].map((f) => (
                  <div key={f.title} className="p-5 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] transition-colors">
                    <span className="text-2xl block mb-3">{f.icon}</span>
                    <h3 className="text-[13px] font-semibold text-white">{f.title}</h3>
                    <p className="text-[12px] text-gray-500 mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEO CONTENT ===== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-8 text-gray-900">Beauty Services in Perth</h2>
          <div className="prose prose-lg mx-auto text-gray-400 prose-headings:font-display prose-headings:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <p>
              Appilico Beauty is Perth&apos;s premier platform for discovering local beauty professionals. Whether you need a <Link href="/category/nails">nail salon</Link>, <Link href="/category/hair">hair stylist</Link>, <Link href="/category/lashes">lash technician</Link>, or <Link href="/category/makeup">makeup artist</Link>, our marketplace makes it easy to find, compare, and connect.
            </p>
            <p>
              Browse verified professionals across Perth suburbs including <Link href="/subiaco">Subiaco</Link>, <Link href="/fremantle">Fremantle</Link>, <Link href="/joondalup">Joondalup</Link>, <Link href="/claremont">Claremont</Link>, and <Link href="/scarborough">Scarborough</Link>. Every provider is reviewed by real customers.
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Appilico Beauty",
            url: "https://beauty.appilico.com.au",
            description: "Perth's premier beauty and wellness marketplace.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://beauty.appilico.com.au/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Appilico Beauty",
            url: "https://beauty.appilico.com.au",
            logo: "https://beauty.appilico.com.au/logo.png",
            contactPoint: { "@type": "ContactPoint", contactType: "customer service", areaServed: "AU" },
          }),
        }}
      />
    </>
  );
}
