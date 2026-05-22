import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://beauty.appilico.com.au";

export function generatePageMeta({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Appilico Beauty",
      locale: "en_AU",
      type: "website",
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function providerJsonLd(provider: {
  businessName: string;
  slug: string;
  description?: string;
  averageRating: number;
  totalReviews: number;
  city?: string;
  state?: string;
  phone?: string;
  logoUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: provider.businessName,
    url: `${SITE_URL}/provider/${provider.slug}`,
    description: provider.description,
    ...(provider.logoUrl ? { image: provider.logoUrl } : {}),
    ...(provider.phone ? { telephone: provider.phone } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: provider.city,
      addressRegion: provider.state || "WA",
      addressCountry: "AU",
    },
    ...(provider.totalReviews > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: provider.averageRating,
            reviewCount: provider.totalReviews,
          },
        }
      : {}),
  };
}

export function categoryJsonLd(category: { name: string; slug: string }, suburb?: { name: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: suburb ? `${category.name} in ${suburb.name}` : category.name,
    url: `${SITE_URL}${suburb ? `/${suburb.slug}/${category.slug}` : `/category/${category.slug}`}`,
    areaServed: suburb
      ? { "@type": "City", name: suburb.name }
      : { "@type": "State", name: "Western Australia" },
    provider: {
      "@type": "Organization",
      name: "Appilico Beauty",
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.url ? { item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}` } : {}),
    })),
  };
}
