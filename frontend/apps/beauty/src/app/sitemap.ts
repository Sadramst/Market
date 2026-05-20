import type { MetadataRoute } from "next";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

const BASE_URL = "https://beauty.appilico.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/suburbs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    const [suburbsRes, catsRes, providersRes] = await Promise.all([
      fetch(`${API}/locations/suburbs`, { next: { revalidate: 86400 } }),
      fetch(`${API}/categories/beauty`, { next: { revalidate: 86400 } }),
      fetch(`${API}/providers/search?providerType=0&pageSize=1000`, { next: { revalidate: 86400 } }),
    ]);

    let suburbs: { slug: string }[] = [];

    // Category pages from constant
    for (const c of BEAUTY_CATEGORIES) {
      dynamicPages.push({
        url: `${BASE_URL}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      });
    }

    if (suburbsRes.ok) {
      const suburbsJson = await suburbsRes.json();
      suburbs = suburbsJson.success ? suburbsJson.data : [];
      for (const s of suburbs) {
        dynamicPages.push({
          url: `${BASE_URL}/${s.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }

    if (catsRes.ok) {
      // Categories already added from constant above
    }

    // Suburb × Category combo pages
    for (const s of suburbs) {
      for (const c of BEAUTY_CATEGORIES) {
        dynamicPages.push({
          url: `${BASE_URL}/${s.slug}/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    if (providersRes.ok) {
      const providersJson = await providersRes.json();
      const items = providersJson.success ? providersJson.data?.items ?? [] : [];
      for (const p of items) {
        dynamicPages.push({
          url: `${BASE_URL}/provider/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // API unavailable — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
