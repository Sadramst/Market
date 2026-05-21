import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { Breadcrumbs } from "@/components/ui";
import { ClaimForm } from "./ClaimForm";

type Provider = {
  id: string;
  slug: string;
  businessName: string;
  city?: string;
  isClaimed?: boolean;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 300 });
  if (!provider) return { title: "Business Not Found" };

  return {
    title: `Claim ${provider.businessName} — Appilico Beauty`,
    description: `Claim your listing for ${provider.businessName} on Appilico Beauty. Update your details, respond to reviews and unlock premium features.`,
    robots: { index: false, follow: false },
  };
}

export default async function ClaimPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await fetchApi<Provider>(`/providers/${slug}`, { revalidate: 300 });
  if (!provider) notFound();

  return (
    <>
      {/* Hero */}
      <section className="py-16" style={{ background: 'linear-gradient(135deg, #1C1410 0%, #2a1f1a 50%, #1C1410 100%)' }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: provider.businessName, href: `/provider/${slug}` }, { label: "Claim Listing" }]} />
          <h1 className="mt-6" style={{ fontFamily: 'var(--font-display)', color: 'white', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400, fontStyle: 'italic' }}>
            Claim <span style={{ color: 'var(--brand-gold)' }}>{provider.businessName}</span>
          </h1>
          <p className="mt-3 text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'rgba(255,255,255,0.7)' }}>
            Verify your ownership to update business details, respond to reviews, and unlock premium features.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {provider.isClaimed ? (
          <div className="text-center p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <p className="text-[18px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>This listing has already been claimed</p>
            <p className="text-[14px] font-light mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
              If you believe this is an error, please <Link href="/contact" className="underline" style={{ color: 'var(--brand-rose)' }}>contact us</Link>.
            </p>
          </div>
        ) : (
          <>
            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: "✏️", title: "Update Details", desc: "Edit your business info, services and photos" },
                { icon: "💬", title: "Reply to Reviews", desc: "Engage with customers and build trust" },
                { icon: "📊", title: "Analytics", desc: "See how customers find your business" },
              ].map((b) => (
                <div key={b.title} className="p-4 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="text-[14px] font-medium mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{b.title}</h3>
                  <p className="text-[12px] font-light mt-1" style={{ color: 'var(--text-muted)' }}>{b.desc}</p>
                </div>
              ))}
            </div>

            <ClaimForm slug={slug} businessName={provider.businessName} />
          </>
        )}
      </div>
    </>
  );
}
