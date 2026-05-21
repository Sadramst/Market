import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi, type ProviderDetail } from "../../../lib/api";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const provider = await fetchApi<ProviderDetail>(`/providers/${slug}`, { revalidate: 300, tags: ["services-provider", slug] });
  if (!provider) return {};
  return {
    title: provider.businessName,
    description: provider.tagline || provider.description || `View ${provider.businessName} on Appilico Services.`,
  };
}

export default async function ProviderPage({ params }: PageProps) {
  const { slug } = await params;
  const provider = await fetchApi<ProviderDetail>(`/providers/${slug}`, { revalidate: 300, tags: ["services-provider", slug] });
  if (!provider) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/search" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Back to browse</Link>

      <section className="mt-6 rounded-3xl bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_58%,#ecfeff_100%)] px-6 py-10 sm:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-blue-600 shadow-sm">{provider.isVerified ? "Verified" : provider.hasRealData ? "Source checked" : "New listing"}</span>
              {provider.city && <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-500 shadow-sm">{provider.city}</span>}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-950">{provider.businessName}</h1>
            {provider.tagline && <p className="mt-4 text-lg text-gray-600">{provider.tagline}</p>}
            {provider.description && <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500">{provider.description}</p>}
          </div>
          <div className="rounded-2xl border border-white/70 bg-white/90 p-5 shadow-lg shadow-blue-900/[0.06] md:w-80">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-400">Contact</h2>
            <div className="mt-4 space-y-3 text-sm">
              {provider.website && <a href={provider.website} className="block rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700" target="_blank" rel="noreferrer">Visit website</a>}
              {provider.email && <a href={`mailto:${provider.email}`} className="block rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600">Email provider</a>}
              {provider.phone && <a href={`tel:${provider.phone}`} className="block rounded-xl border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-600">Call {provider.phone}</a>}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-950">Services</h2>
          {provider.services && provider.services.length > 0 ? (
            <div className="mt-5 divide-y divide-gray-100">
              {provider.services.map((service) => (
                <div key={`${service.categoryName}-${service.name}`} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{service.name}</h3>
                      {service.description && <p className="mt-1 text-sm text-gray-500">{service.description}</p>}
                    </div>
                    {service.priceFrom && <span className="text-sm font-semibold text-gray-700">From ${service.priceFrom}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Service details are being reviewed.</p>
          )}
        </section>

        <aside className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-950">Coverage</h2>
          {provider.serviceAreas && provider.serviceAreas.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.serviceAreas.map((area) => <span key={area} className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">{area}</span>)}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">Perth metro availability to be confirmed.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
