import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";
import { fetchApi } from "@/lib/api";

export const metadata: Metadata = generatePageMeta({
  title: "About Appilico — Perth's Beauty Marketplace",
  description: "Learn about Appilico, Perth's premier beauty marketplace connecting customers with trusted beauty professionals across Western Australia.",
  path: "/about",
});

export default async function AboutPage() {
  const [providerData, suburbsData] = await Promise.all([
    fetchApi<{ pagination: { totalCount: number } }>("/providers/search?pageSize=1&marketplaceType=0", { revalidate: 3600 }),
    fetchApi<Array<{ name: string }>>("/locations/suburbs", { revalidate: 3600 }),
  ]);

  const providerCount = providerData?.pagination?.totalCount ?? 50;
  const suburbCount = suburbsData?.length ?? 80;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-sm text-rose-600 mb-6">
          <span className="w-2 h-2 bg-primary rounded-full" />
          Est. 2026 · Perth, Western Australia
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 leading-tight">
          Perth&apos;s Premier<br /><span className="gradient-text">Beauty Marketplace</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Connecting customers with trusted beauty professionals across Western Australia.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Story</h2>
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p>
            Appilico was founded in Perth, Western Australia to help locals discover exceptional beauty professionals in their suburb. We believe everyone deserves access to trusted, reviewed, and easy-to-find beauty services.
          </p>
          <p>
            Perth&apos;s beauty industry is thriving — with talented professionals working across dozens of suburbs, from Subiaco to Fremantle, Joondalup to Scarborough. But finding the right provider has always been a challenge. Scrolling through endless social media posts, asking friends for recommendations, or simply hoping for the best isn&apos;t good enough.
          </p>
          <p>
            That&apos;s why we built Appilico — a single place where you can discover, compare, and connect with beauty professionals based on real reviews, verified portfolios, and transparent pricing.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16 bg-gradient-to-br from-rose-50 to-pink-50/50 rounded-2xl p-8 sm:p-10 border border-rose-100/50">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          To connect Perth&apos;s beauty community — making it effortless for customers to find their perfect beauty professional, and for providers to grow their business through visibility, reviews, and genuine connections.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl font-display font-bold gradient-text">{providerCount}+</div>
            <div className="text-sm text-gray-400 mt-1">Beauty Professionals</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl font-display font-bold gradient-text">{suburbCount}+</div>
            <div className="text-sm text-gray-400 mt-1">Perth Suburbs</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl font-display font-bold gradient-text">9</div>
            <div className="text-sm text-gray-400 mt-1">Service Categories</div>
          </div>
        </div>
      </section>

      {/* Built in Perth */}
      <section className="mb-16">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Built in Perth, for Perth</h2>
        <p className="text-gray-600 leading-relaxed">
          We&apos;re a Perth-based team that understands the local beauty scene. Every feature we build is designed with Perth professionals and customers in mind — from suburb-specific search to local review verification. We&apos;re committed to supporting the growth of Perth&apos;s beauty industry.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center bg-gray-900 rounded-2xl p-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(232,120,138,0.4) 0%, transparent 50%)" }} />
        <div className="relative">
          <h2 className="text-2xl font-display font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Whether you&apos;re looking for beauty services or want to list your business, we&apos;re here for you.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-all">
              Browse Providers
            </Link>
            <Link href="/join" className="px-6 py-3 border border-gray-600 text-gray-300 rounded-full font-medium hover:border-gray-500 hover:text-white transition-colors">
              List Your Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
