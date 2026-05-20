import Link from "next/link";
import { fetchApi } from "@/lib/api";

const categories = [
  { name: "Nails", icon: "💅", slug: "nails", desc: "Manicures, pedicures & nail art" },
  { name: "Hair", icon: "💇‍♀️", slug: "hair", desc: "Cuts, colour & styling" },
  { name: "Lashes", icon: "👁️", slug: "lashes", desc: "Extensions & lifts" },
  { name: "Brows", icon: "✨", slug: "brows", desc: "Threading, tinting & lamination" },
  { name: "Skin Care", icon: "🧴", slug: "skin-care", desc: "Facials & treatments" },
  { name: "Makeup", icon: "💄", slug: "makeup", desc: "Glam, bridal & everyday" },
  { name: "Body", icon: "🌸", slug: "body", desc: "Massage, waxing & tanning" },
  { name: "Cosmetic", icon: "💉", slug: "cosmetic", desc: "Injectables & aesthetics" },
  { name: "Wellness", icon: "🧘", slug: "wellness", desc: "Holistic health & spa" },
];

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

const stats = [
  { value: "500+", label: "Beauty Professionals" },
  { value: "150+", label: "Perth Suburbs" },
  { value: "9", label: "Service Categories" },
  { value: "Free", label: "To Get Started" },
];

const howItWorks = [
  { step: "01", title: "Search", desc: "Browse beauty professionals by service, suburb, or name", icon: "🔍" },
  { step: "02", title: "Compare", desc: "Read reviews, view galleries, and compare prices", icon: "⭐" },
  { step: "03", title: "Connect", desc: "Contact your chosen professional directly", icon: "💬" },
];

const testimonials = [
  { name: "Sarah M.", suburb: "Subiaco", text: "Found my go-to nail tech through Appilico. The reviews and gallery photos made it so easy to choose!", rating: 5 },
  { name: "Jessica L.", suburb: "Fremantle", text: "As a lash artist, Appilico has been amazing for growing my client base. Love the easy profile setup.", rating: 5 },
  { name: "Emily R.", suburb: "Claremont", text: "Finally a proper beauty directory for Perth! Clean, easy to use, and the providers are all quality.", rating: 5 },
];

export default async function HomePage() {
  const providers = await fetchApi<{ items: Array<{ slug: string; businessName: string; city: string; averageRating: number; totalReviews: number; logoUrl?: string; tagline?: string; categories?: string[] }> }>(
    "/providers?pageSize=6&sortBy=rating&providerType=0",
    { revalidate: 300, tags: ["featured-providers"] }
  );

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/80 to-white" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,120,138,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,165,116,0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(183,110,121,0.05) 0%, transparent 70%)" }} />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full text-sm text-rose-600 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Perth&apos;s Premier Beauty Marketplace
            </div>

            <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Discover Perth&apos;s<br />
              <span className="gradient-text">Finest Beauty</span><br />
              Professionals
            </h1>

            <p className="animate-fade-in-up animation-delay-100 text-lg sm:text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with top-rated salons, spas, and beauty experts across Western Australia. Compare services, read real reviews, and find your perfect match.
            </p>

            <form action="/search" method="GET" className="animate-fade-in-up animation-delay-200 max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl shadow-rose-100/50 p-2 flex flex-col sm:flex-row gap-2 border border-rose-50">
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input type="text" name="q" placeholder="Nails, hair, lashes, makeup..." className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50/50 border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white text-gray-900 placeholder:text-gray-400 transition-all" />
                </div>
                <div className="flex-1 relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <input type="text" name="suburb" placeholder="Suburb or postcode" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50/50 border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white text-gray-900 placeholder:text-gray-400 transition-all" />
                </div>
                <button type="submit" className="px-8 py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]">
                  Search
                </button>
              </div>
            </form>

            <div className="animate-fade-in-up animation-delay-300 mt-6 flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-gray-400">Trending:</span>
              {["Nail Art Perth", "Lash Extensions", "Balayage Subiaco", "Brow Lamination"].map((term) => (
                <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="text-gray-500 hover:text-primary transition-colors underline underline-offset-4 decoration-gray-200 hover:decoration-primary">
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="relative -mt-6 z-10 max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/80 border border-gray-50 p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-bold gradient-text">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-6xl mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Explore Services</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">Browse by Category</h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">Find the perfect beauty professional for every need</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`premium-card group relative p-6 rounded-2xl bg-white border border-gray-100 hover:border-rose-200 overflow-hidden animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-rose-50/80 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="text-4xl mb-3 block group-hover:animate-float">{cat.icon}</span>
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-sm text-gray-400 mt-1">{cat.desc}</p>
              <div className="mt-3 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Browse
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="bg-gradient-to-b from-blush/50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Simple Process</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-400 mt-3">Find your perfect beauty professional in three easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative text-center group">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px border-t-2 border-dashed border-rose-100" />
                )}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white shadow-lg shadow-rose-100/50 border border-rose-50 mb-5 group-hover:shadow-xl group-hover:shadow-primary/10 transition-all">
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <div className="text-xs font-bold text-primary/40 tracking-widest mb-2">{item.step}</div>
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROVIDERS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Featured</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">Top-Rated Professionals</h2>
              <p className="text-gray-400 mt-2">Handpicked beauty experts loved by Perth locals</p>
            </div>
            <Link href="/search" className="mt-4 sm:mt-0 text-primary hover:text-primary-dark font-medium transition-colors inline-flex items-center gap-1 group">
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {providers?.items && providers.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.items.map((p, i) => (
                <Link key={p.slug} href={`/provider/${p.slug}`} className="premium-card group bg-white rounded-2xl border border-gray-100 hover:border-rose-200 overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100/50 relative overflow-hidden">
                    {p.logoUrl ? (
                      <img src={p.logoUrl} alt={p.businessName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg flex items-center justify-center">
                          <span className="text-3xl font-display gradient-text">{p.businessName.charAt(0)}</span>
                        </div>
                      </div>
                    )}
                    {p.averageRating > 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 flex items-center gap-1 shadow-sm">
                        <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="text-xs font-semibold text-gray-700">{p.averageRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors text-lg">{p.businessName}</h3>
                    {p.tagline && <p className="text-sm text-gray-400 mt-1 line-clamp-1">{p.tagline}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        {p.averageRating > 0 ? (
                          <span>{p.totalReviews} review{p.totalReviews !== 1 ? "s" : ""}</span>
                        ) : (
                          <span className="text-primary/60 text-xs font-medium bg-primary/5 px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      {p.city && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
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
            <div className="text-center py-16 bg-gradient-to-br from-rose-50/50 to-pink-50/50 rounded-2xl border border-rose-100/50">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-white shadow-lg shadow-rose-100/50 flex items-center justify-center mb-5">
                <span className="text-4xl">💅</span>
              </div>
              <h3 className="text-xl font-display font-bold text-gray-900">Coming Soon</h3>
              <p className="text-gray-400 mt-2 max-w-md mx-auto">Featured beauty professionals will appear here once providers start joining our platform.</p>
              <Link href="/join" className="inline-flex items-center mt-6 px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25">
                Be the First to Join
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="bg-gradient-to-b from-white to-blush/30 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Testimonials</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">Loved by Perth Locals</h2>
            <p className="text-gray-400 mt-3">See what our community is saying</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="premium-card bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-rose-100 flex items-center justify-center text-sm font-semibold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.suburb}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SUBURBS ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Local Discovery</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">Explore Perth Suburbs</h2>
            <p className="text-gray-400 mt-3">Find beauty services near you</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {popularSuburbs.map((suburb) => (
              <Link key={suburb.slug} href={`/${suburb.slug}`} className="premium-card text-center p-4 rounded-xl bg-white border border-gray-100 hover:border-rose-200 group">
                <svg className="w-5 h-5 mx-auto mb-2 text-gray-300 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{suburb.name}</span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/suburbs" className="text-primary hover:text-primary-dark font-medium transition-colors inline-flex items-center gap-1 group">
              View all suburbs
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOR PROVIDERS CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-10 sm:p-16">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(232,120,138,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(212,165,116,0.3) 0%, transparent 50%)" }} />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-rose-400 text-sm font-semibold tracking-wide uppercase mb-3">For Beauty Professionals</p>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 leading-tight">
                  Grow Your Beauty Business with Appilico
                </h2>
                <p className="text-gray-400 leading-relaxed mb-8">
                  Join Perth&apos;s fastest-growing beauty marketplace. Create your free profile, showcase your work, collect reviews, and get discovered by thousands of local customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/join" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25">
                    List Your Business — Free
                  </Link>
                  <Link href="/about" className="inline-flex items-center justify-center px-8 py-3.5 border border-gray-600 text-gray-300 rounded-full font-medium hover:border-gray-500 hover:text-white transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: "📍", title: "Local SEO", desc: "Get found by customers in your suburb" },
                  { icon: "⭐", title: "Reviews", desc: "Build trust with verified reviews" },
                  { icon: "📸", title: "Portfolio", desc: "Showcase your best work" },
                  { icon: "📊", title: "Analytics", desc: "Track views & enquiries" },
                ].map((f) => (
                  <div key={f.title} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <span className="text-2xl mb-2 block">{f.icon}</span>
                    <h3 className="text-sm font-semibold text-white">{f.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEO CONTENT ===== */}
      <section className="py-16 px-4 bg-gradient-to-b from-blush/20 to-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-8 text-gray-900">Beauty Services in Perth</h2>
          <div className="prose prose-lg mx-auto text-gray-500 prose-headings:font-display prose-headings:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <p>
              Appilico Beauty is Perth&apos;s premier platform for discovering and connecting with local beauty professionals. Whether you&apos;re looking for a <Link href="/category/nails">nail salon</Link>, <Link href="/category/hair">hair stylist</Link>, <Link href="/category/lashes">lash technician</Link>, or <Link href="/category/makeup">makeup artist</Link>, our marketplace makes it easy to find, compare, and connect with the perfect beauty service.
            </p>
            <p>
              Browse verified professionals across Perth suburbs including <Link href="/subiaco">Subiaco</Link>, <Link href="/fremantle">Fremantle</Link>, <Link href="/joondalup">Joondalup</Link>, <Link href="/claremont">Claremont</Link>, <Link href="/scarborough">Scarborough</Link>, and more. Every provider is reviewed by real customers so you can choose with confidence.
            </p>
            <p>
              From bridal makeup and hair styling to regular nail appointments and skin treatments, Appilico Beauty connects you with skilled professionals who meet your beauty needs and budget.
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
            description: "Perth's premier beauty and wellness marketplace. Discover top-rated salons, spas, and beauty professionals.",
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
            sameAs: [],
          }),
        }}
      />
    </>
  );
}
