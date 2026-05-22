import type { MetadataRoute } from "next";
import { BEAUTY_CATEGORIES } from "@/lib/categories";
import { PERTH_SUBURBS } from "@/lib/suburbs";
import { fetchApi } from "@/lib/api";

const BASE_URL = "https://beauty.appilico.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/suburbs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/join`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Category pages (from constant)
  const categoryPages: MetadataRoute.Sitemap = BEAUTY_CATEGORIES.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Suburb pages (from constant)
  const suburbPages: MetadataRoute.Sitemap = PERTH_SUBURBS.map((s) => ({
    url: `${BASE_URL}/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Suburb × Category combo pages
  const comboPages: MetadataRoute.Sitemap = [];
  for (const s of PERTH_SUBURBS) {
    for (const c of BEAUTY_CATEGORIES) {
      comboPages.push({
        url: `${BASE_URL}/${s.slug}/${c.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      });
    }
  }

  // Provider pages (from API)
  let providerPages: MetadataRoute.Sitemap = [];
  try {
    const data = await fetchApi<{
      items: Array<{ slug: string }>;
    }>("/providers/search?pageSize=500&marketplaceType=0", { revalidate: 3600 });
    if (data?.items) {
      providerPages = data.items.map((p) => ({
        url: `${BASE_URL}/provider/${p.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch {
    // API unavailable, skip provider pages
  }

  return [...staticPages, ...categoryPages, ...suburbPages, ...comboPages, ...providerPages];
}
