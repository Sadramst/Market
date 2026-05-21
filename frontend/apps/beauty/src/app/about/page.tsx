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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <section className="text-center mb-16">
        <p className="text-[12px] font-medium uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-rose)' }}>
          Est. 2026 · Perth, Western Australia
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400 }}>
          Perth&apos;s Premier<br /><em style={{ color: 'var(--brand-rose)' }}>Beauty Marketplace</em>
        </h1>
        <p className="text-[17px] font-light max-w-2xl mx-auto mt-4 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          Connecting customers with trusted beauty professionals across Western Australia.
        </p>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>Our Story</h2>
        <div className="space-y-4 text-[16px] font-light leading-[1.8]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          <p>Appilico was founded in Perth, Western Australia to help locals discover exceptional beauty professionals in their suburb. We believe everyone deserves access to trusted, reviewed, and easy-to-find beauty services.</p>
          <p>Perth&apos;s beauty industry is thriving — with talented professionals working across dozens of suburbs, from Subiaco to Fremantle, Joondalup to Scarborough. But finding the right provider has always been a challenge.</p>
          <p>That&apos;s why we built Appilico — a single place where you can discover, compare, and connect with beauty professionals based on real reviews, verified portfolios, and transparent pricing.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16 p-8 sm:p-10" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px' }}>
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>Our Mission</h2>
        <p className="text-[17px] font-light leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          To connect Perth&apos;s beauty community — making it effortless for customers to find their perfect beauty professional, and for providers to grow their business through visibility, reviews, and genuine connections.
        </p>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-3 gap-6">
          {[
            { value: `${providerCount}+`, label: "Beauty Professionals" },
            { value: `${suburbCount}+`, label: "Perth Suburbs" },
            { value: "9", label: "Service Categories" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="text-[28px]" style={{ fontFamily: 'var(--font-display)', color: 'var(--brand-rose)' }}>{stat.value}</div>
              <div className="text-[13px] mt-1" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Built in Perth */}
      <section className="mb-16">
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 600 }}>Built in Perth, for Perth</h2>
        <p className="text-[16px] font-light leading-[1.8]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
          We&apos;re a Perth-based team that understands the local beauty scene. Every feature we build is designed with Perth professionals and customers in mind — from suburb-specific search to local review verification. We&apos;re committed to supporting the growth of Perth&apos;s beauty industry.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center p-10 relative overflow-hidden" style={{ background: 'var(--gradient-dark)', borderRadius: '8px' }}>
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)', fontSize: '1.5rem', fontWeight: 400 }}>Ready to Get Started?</h2>
        <p className="mb-8 max-w-md mx-auto text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'rgba(250,247,244,0.7)' }}>Whether you&apos;re looking for beauty services or want to list your business, we&apos;re here for you.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/search" className="px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
            Browse Providers
          </Link>
          <Link href="/join" className="px-6 py-3 text-[14px] font-medium" style={{ border: '1px solid var(--brand-gold)', color: 'var(--brand-gold)', borderRadius: '2px' }}>
            List Your Business
          </Link>
        </div>
      </section>
    </div>
  );
}
