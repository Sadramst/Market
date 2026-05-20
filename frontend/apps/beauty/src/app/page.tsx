import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beauty Services Near You",
  description:
    "Discover the best beauty professionals in Perth. Browse nails, hair, lashes, brows, skin care, and more.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary-light)] py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-4">
            Find Your Perfect
            <span className="text-[var(--primary)]"> Beauty Pro</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-8 max-w-2xl mx-auto">
            Discover top-rated beauty professionals in Perth. Compare services,
            read reviews, and book with confidence.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-2 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="What service are you looking for?"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <input
              type="text"
              placeholder="Suburb or postcode"
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--foreground)]"
            />
            <button className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-semibold hover:bg-[var(--primary-dark)] transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { name: "Nails", icon: "💅", slug: "nails" },
            { name: "Hair", icon: "💇‍♀️", slug: "hair" },
            { name: "Lashes", icon: "👁️", slug: "lashes" },
            { name: "Brows", icon: "✨", slug: "brows" },
            { name: "Skin Care", icon: "🧴", slug: "skin-care" },
            { name: "Makeup", icon: "💄", slug: "makeup" },
            { name: "Body", icon: "🌸", slug: "body" },
            { name: "Cosmetic", icon: "💉", slug: "cosmetic" },
            { name: "Wellness", icon: "🧘", slug: "wellness" },
          ].map((category) => (
            <a
              key={category.slug}
              href={`/category/${category.slug}`}
              className="flex flex-col items-center p-6 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all group"
            >
              <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="font-medium text-[var(--foreground)] group-hover:text-[var(--primary)]">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured Providers */}
      <section className="w-full bg-[var(--muted)] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Featured Professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Fetch featured providers from API */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--border)] hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-[var(--primary-light)] to-[var(--accent)]" />
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">
                  Coming Soon...
                </h3>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Featured beauty professionals will appear here once providers
                  start registering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="w-full max-w-4xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          Beauty Services in Perth
        </h2>
        <div className="prose prose-lg mx-auto text-[var(--muted-foreground)]">
          <p>
            Appilico Beauty is Perth&apos;s premier platform for discovering and
            connecting with local beauty professionals. Whether you&apos;re looking
            for a nail salon, hair stylist, lash technician, or makeup artist,
            our marketplace makes it easy to find, compare, and book the
            perfect beauty service.
          </p>
          <p>
            Browse verified professionals across Perth suburbs including
            Subiaco, Fremantle, Joondalup, Claremont, Scarborough, and more.
            Every provider is reviewed by real customers so you can book with
            confidence.
          </p>
        </div>
      </section>
    </div>
  );
}
