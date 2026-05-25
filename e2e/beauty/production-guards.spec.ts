import { test, expect } from "@playwright/test";

const API = "https://api.appilico.com.au/api";

test.describe("Production Guards – Massage Category", () => {
  test("massage category exists (as parent or subcategory)", async ({ request }) => {
    const res = await request.get(`${API}/categories/beauty`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Massage may be a top-level category OR a subcategory under Body
    const allCats = body.data.flatMap((c: any) => [c, ...(c.subCategories || [])]);
    const massageCat = allCats.find((c: any) => c.slug === "massage");
    expect(massageCat).toBeTruthy();
    expect(massageCat.name).toBe("Massage");
  });

  test("massage category has providers (not empty)", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=massage&marketplaceType=0&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("massage providers have correct category assignment", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=massage&marketplaceType=0&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    if (body.data.items.length > 0) {
      for (const provider of body.data.items) {
        // Provider should have Massage in their categories (not Body, Wellness, etc.)
        expect(provider.categories).toContain("Massage");
      }
    }
  });

  test("massage search by category slug returns only massage providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=massage&marketplaceType=0&sort=rating&pageSize=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    // Should not return non-massage providers
    for (const item of body.data.items) {
      const cats = item.categories.map((c: string) => c.toLowerCase());
      expect(cats.some((c: string) => c.includes("massage"))).toBe(true);
    }
  });
});

test.describe("Production Guards – All Categories Have Providers", () => {
  // Core categories that MUST have providers
  const requiredCategories = ["nails", "hair", "lashes", "brows", "skin-care", "makeup", "body", "massage"];
  // All categories should now have providers (wellness seeded with 31 dedicated entries)
  const optionalCategories = ["cosmetic"]; // cosmetic may still be empty

  for (const cat of [...requiredCategories, "wellness"]) {
    test(`${cat} category has at least 1 provider`, async ({ request }) => {
      const res = await request.get(`${API}/providers/search?category=${cat}&marketplaceType=0&pageSize=1`);
      if (res.status() === 503) {
        test.skip(true, "API unavailable");
        return;
      }
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.pagination.totalCount).toBeGreaterThan(0);
    });
  }

  for (const cat of optionalCategories) {
    test(`${cat} category search works (may be empty)`, async ({ request }) => {
      const res = await request.get(`${API}/providers/search?category=${cat}&marketplaceType=0&pageSize=1`);
      if (res.status() === 503) {
        test.skip(true, "API unavailable");
        return;
      }
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  }
});

test.describe("Production Guards – Marketplace Separation", () => {
  test("beauty search returns only beauty providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.providerType).toBe("Beauty");
    }
  });

  test("IT search returns only IT providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=1&pageSize=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    for (const item of body.data.items) {
      expect(item.providerType).toBe("ITService");
    }
  });

  test("beauty and IT provider counts are both > 0", async ({ request }) => {
    const beautyRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const itRes = await request.get(`${API}/providers/search?marketplaceType=1&pageSize=1`);
    const beautyBody = await beautyRes.json();
    const itBody = await itRes.json();
    expect(beautyBody.data.pagination.totalCount).toBeGreaterThan(100);
    expect(itBody.data.pagination.totalCount).toBeGreaterThan(50);
  });
});

test.describe("Production Guards – Admin API Endpoints", () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: "admin@appilico.com", password: "Admin@123!" },
    });
    if (res.status() === 200) {
      const body = await res.json();
      token = body.data?.accessToken;
    }
  });

  test("admin list supports marketplaceType filter", async ({ request }) => {
    test.skip(!token, "Admin login failed");
    // Beauty providers
    const beautyRes = await request.get(`${API}/providers/admin/list?marketplaceType=0&pageSize=3`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(beautyRes.status()).toBe(200);
    const beautyBody = await beautyRes.json();
    expect(beautyBody.success).toBe(true);
    for (const item of beautyBody.data.items) {
      expect(item.providerType).toBe("Beauty");
    }

    // IT providers
    const itRes = await request.get(`${API}/providers/admin/list?marketplaceType=1&pageSize=3`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(itRes.status()).toBe(200);
    const itBody = await itRes.json();
    expect(itBody.success).toBe(true);
    for (const item of itBody.data.items) {
      expect(item.providerType).toBe("ITService");
    }
  });

  test("admin promote endpoint works", async ({ request }) => {
    test.skip(!token, "Admin login failed");
    // Get a provider first
    const listRes = await request.get(`${API}/providers/admin/list?pageSize=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    test.skip(!listBody.data?.items?.length, "No providers to test");
    const provider = listBody.data.items[0];

    // Toggle featured
    const promoteRes = await request.put(`${API}/providers/admin/${provider.id}/promote`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isFeatured: !provider.isFeatured },
    });
    expect(promoteRes.status()).toBe(200);
    const promoteBody = await promoteRes.json();
    expect(promoteBody.success).toBe(true);
    expect(promoteBody.data.isFeatured).toBe(!provider.isFeatured);

    // Revert
    await request.put(`${API}/providers/admin/${provider.id}/promote`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { isFeatured: provider.isFeatured },
    });
  });

  test("admin update endpoint works", async ({ request }) => {
    test.skip(!token, "Admin login failed");
    const listRes = await request.get(`${API}/providers/admin/list?pageSize=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listBody = await listRes.json();
    test.skip(!listBody.data?.items?.length, "No providers to test");
    const provider = listBody.data.items[0];
    const originalTagline = provider.tagline;

    // Update tagline
    const updateRes = await request.put(`${API}/providers/admin/${provider.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { tagline: "E2E test tagline" },
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);
    expect(updateBody.data.tagline).toBe("E2E test tagline");

    // Revert
    await request.put(`${API}/providers/admin/${provider.id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { tagline: originalTagline || "" },
    });
  });

  test("admin list returns provider metadata for editing", async ({ request }) => {
    test.skip(!token, "Admin login failed");
    const res = await request.get(`${API}/providers/admin/list?pageSize=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    const provider = body.data.items[0];
    // Should have all the fields needed for admin editing
    expect(provider).toHaveProperty("id");
    expect(provider).toHaveProperty("businessName");
    expect(provider).toHaveProperty("slug");
    expect(provider).toHaveProperty("status");
    expect(provider).toHaveProperty("isFeatured");
    expect(provider).toHaveProperty("isVerified");
    expect(provider).toHaveProperty("providerType");
    expect(provider).toHaveProperty("averageRating");
  });

  test("admin endpoints require auth", async ({ request }) => {
    const noAuthRes = await request.get(`${API}/providers/admin/list`);
    expect(noAuthRes.status()).toBe(401);
  });
});

test.describe("Production Guards – New API Endpoints", () => {
  test("nearest suburb endpoint returns a suburb for Perth coordinates", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs/nearest?lat=-31.9505&lng=115.8605`);
    if (res.status() === 503) { test.skip(true, "API unavailable"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty("name");
    expect(body.data).toHaveProperty("distanceKm");
    expect(body.data.distanceKm).toBeLessThan(20); // Should be within 20km of Perth CBD
  });

  test("analytics event endpoint accepts anonymous tracking", async ({ request }) => {
    const res = await request.post(`${API}/analytics/event`, {
      data: {
        eventType: "view_category",
        entityType: "category",
        entitySlug: "wellness",
        categorySlug: "wellness",
        marketplaceType: 0,
        sessionId: "test-session-e2e"
      }
    });
    if (res.status() === 503) { test.skip(true, "API unavailable"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("user preferences endpoint requires authentication", async ({ request }) => {
    const res = await request.get(`${API}/userpreferences`);
    if (res.status() === 503) { test.skip(true, "API unavailable"); return; }
    expect(res.status()).toBe(401);
  });
});
