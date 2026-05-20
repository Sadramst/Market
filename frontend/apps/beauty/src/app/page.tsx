import Link from "next/link";
import { fetchApi } from "@/lib/api";

const categories = [
  { name: "Nails", icon: "💅", slug: "nails" },
  { name: "Hair", icon: "💇‍♀️", slug: "hair" },
  { name: "Lashes", icon: "👁️", slug: "lashes" },
  { name: "Brows", icon: "✨", slug: "brows" },
  { name: "Skin Care", icon: "🧴", slug: "skin-care" },
  { name: "Makeup", icon: "💄", slug: "makeup" },
  { name: "Body", icon: "🌸", slug: "body" },
  { name: "Cosmetic", icon: "💉", slug: "cosmetic" },
  { name: "Wellness", icon: "🧘", slug: "wellness" },
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

export default async function HomePage() {
  // Fetch featured providers (SSR, revalidate every 5 min)
  const providers = await fetchApi<{ items: Array<{ slug: string; businessName: string; city: string; averageRating: number; totalReviews: number; logoUrl?: string }> }>(
    "/providers?pageSize=6&sortBy=rating",
    { revalidate: 300, tags: ["featured-providers"] }
  );

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, rgba(232,120,138,0.2) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(232,120,138,0.1) 0%, transparent 50%)" }} />
        <div className="max-w-5xl mx-auto text-center relative">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4 leading-tight">
            Find Your Perfect<br />
            <span className="text-primary">Beauty Professional</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover top-rated salons, spas, and beauty experts in Perth. Compare services, read reviews, and connect directly.
          </p>

          {/* Search Bar */}
          <form action="/search" method="GET" className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              name="q"
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
            />
            <input
              type="text"
              name="suburb"
              placeholder="Suburb or postcode"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
            />
            <button type="submit" className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors">
              Search
            </button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>Popular:</span>
            {["Nails Perth", "Hair Salon Subiaco", "Lash Extensions"].map((term) => (
              <Link key={term} href={`/search?q=${encodeURIComponent(term)}`} className="hover:text-primary transition-colors underline underline-offset-2">
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-2">Browse by Category</h2>
        <p className="text-gray-500 text-center mb-10">Find the right beauty professional for your needs</p>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="flex flex-col items-center p-4 rounded-xl bg-white border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Providers */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-2">Featured Professionals</h2>
          <p className="text-gray-500 text-center mb-10">Top-rated beauty providers in Perth</p>

          {providers?.items && providers.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.items.map((p) => (
                <Link key={p.slug} href={`/provider/${p.slug}`} className="group bg-white rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                    <span className="text-5xl font-display text-rose-300">{p.businessName.charAt(0)}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{p.businessName}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-1 text-sm">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="font-medium">{p.averageRating.toFixed(1)}</span>
                        <span className="text-gray-400">({p.totalReviews})</span>
                      </div>
                      <span className="text-xs text-gray-400">{p.city}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <span className="text-5xl mb-4 block">💅</span>
              <h3 className="text-lg font-semibold text-gray-900">Coming Soon</h3>
              <p className="text-gray-500 mt-1">Featured beauty professionals will appear here once providers start registering.</p>
              <Link href="/join" className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors">
                Be the First to Join
              </Link>
            </div>
          )}

          <div className="text-center mt-8">
            <Link href="/search" className="text-primary hover:text-primary-dark font-medium transition-colors">
              View All Providers →
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Suburbs */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-display font-bold text-center mb-2">Popular Perth Suburbs</h2>
        <p className="text-gray-500 text-center mb-10">Browse beauty services by location</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {popularSuburbs.map((suburb) => (
            <Link
              key={suburb.slug}
              href={`/${suburb.slug}`}
              className="text-center p-4 rounded-xl bg-white border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all group"
            >
              <span className="text-sm font-medium text-gray-700 group-hover:text-primary">{suburb.name}</span>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/suburbs" className="text-primary hover:text-primary-dark font-medium transition-colors">
            View All Suburbs →
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-6">Beauty Services in Perth</h2>
          <div className="prose prose-lg mx-auto text-gray-600">
            <p>
              Appilico Beauty is Perth&apos;s premier platform for discovering and connecting with local beauty professionals. Whether you&apos;re looking for a nail salon, hair stylist, lash technician, or makeup artist, our marketplace makes it easy to find, compare, and book the perfect beauty service.
            </p>
            <p>
              Browse verified professionals across Perth suburbs including Subiaco, Fremantle, Joondalup, Claremont, Scarborough, and more. Every provider is reviewed by real customers so you can book with confidence.
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
            potentialAction: {
              "@type": "SearchAction",
              target: "https://beauty.appilico.com.au/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </>
  );
}
