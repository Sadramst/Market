import type { MetadataRoute } from "next";

const BASE_URL = "https://beauty.appilico.com.au";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/suburbs`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/join`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic pages from API
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Suburbs
    const suburbsRes = await fetch(`${API}/locations/suburbs`, { next: { revalidate: 86400 } });
    if (suburbsRes.ok) {
      const suburbsJson = await suburbsRes.json();
      const suburbs = suburbsJson.success ? suburbsJson.data : [];
      for (const s of suburbs) {
        dynamicPages.push({
          url: `${BASE_URL}/${s.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    // Categories
    const catsRes = await fetch(`${API}/categories/beauty`, { next: { revalidate: 86400 } });
    if (catsRes.ok) {
      const catsJson = await catsRes.json();
      const cats = catsJson.success ? catsJson.data : [];
      for (const c of cats) {
        dynamicPages.push({
          url: `${BASE_URL}/category/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }

    // Providers
    const providersRes = await fetch(`${API}/providers?providerType=0&pageSize=1000`, { next: { revalidate: 86400 } });
    if (providersRes.ok) {
      const providersJson = await providersRes.json();
      const items = providersJson.success ? providersJson.data?.items ?? [] : [];
      for (const p of items) {
        dynamicPages.push({
          url: `${BASE_URL}/provider/${p.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // API unavailable — return static pages only
  }

  return [...staticPages, ...dynamicPages];
}
