import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { categoryJsonLd } from "@/lib/seo";
import { Breadcrumbs, EmptyState } from "@/components/ui";

type Suburb = { name: string; slug: string; state: string; postCode: string };
type Category = { name: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<{ suburb: string; category: string }> }): Promise<Metadata> {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const suburb = await fetchApi<Suburb>(`/locations/suburbs/${suburbSlug}`, { revalidate: 3600 });
  const category = await fetchApi<Category>(`/categories/slug/${catSlug}`, { revalidate: 3600 });
  if (!suburb || !category) return { title: "Not Found" };
  return {
    title: `${category.name} in ${suburb.name} — Beauty Services`,
    description: `Find the best ${category.name.toLowerCase()} services in ${suburb.name}, ${suburb.state}. Compare prices, read reviews, and book appointments.`,
    alternates: { canonical: `https://beauty.appilico.com.au/${suburbSlug}/${catSlug}` },
  };
}

export default async function SuburbCategoryPage({ params }: { params: Promise<{ suburb: string; category: string }> }) {
  const { suburb: suburbSlug, category: catSlug } = await params;
  const [suburb, category] = await Promise.all([
    fetchApi<Suburb>(`/locations/suburbs/${suburbSlug}`, { revalidate: 3600 }),
    fetchApi<Category>(`/categories/slug/${catSlug}`, { revalidate: 3600 }),
  ]);
  if (!suburb || !category) notFound();

  const providersData = await fetchApi<{
    items: Array<{ slug: string; businessName: string; averageRating: number; totalReviews: number }>;
    pagination: { totalCount: number };
  }>(`/providers/search?suburb=${suburbSlug}&category=${catSlug}&providerType=0&pageSize=12`, { revalidate: 300 });

  const providers = providersData?.items ?? [];
  const totalCount = providersData?.pagination?.totalCount ?? 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: suburb.name, href: `/${suburb.slug}` },
          { label: category.name },
        ]} />

        <h1 className="text-3xl font-display font-bold mb-2">
          {category.name} in {suburb.name}
        </h1>
        <p className="text-gray-500 mb-8">{totalCount} providers found</p>

        {providers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((p) => (
              <Link key={p.slug} href={`/provider/${p.slug}`} className="group bg-white rounded-xl border border-gray-100 hover:border-rose-200 hover:shadow-lg transition-all overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                  <span className="text-5xl font-display text-rose-300">{p.businessName.charAt(0)}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors">{p.businessName}</h3>
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    {p.averageRating > 0 ? (
                      <>
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span>{p.averageRating.toFixed(1)} ({p.totalReviews})</span>
                      </>
                    ) : <span className="text-gray-400">New</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon="🔍"
            title={`No ${category.name.toLowerCase()} providers in ${suburb.name} yet`}
            description="Try browsing nearby suburbs or check back soon!"
          />
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd(category, suburb)) }}
      />
    </>
  );
}
