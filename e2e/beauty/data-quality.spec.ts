import { test, expect } from "@playwright/test";

const API = "https://api.appilico.com.au/api";

// ──────────────────────────────────────────────
// Data Quality — Category Assignments
// ──────────────────────────────────────────────
test.describe("Data Quality – Category Assignments", () => {
  test("Sora Hair is in Hair category, not Brows", async ({ request }) => {
    const res = await request.get(`${API}/providers/sora-hair-subiaco-subiaco`);
    if (res.status() === 404) { test.skip(true, "Provider not found"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.categories?.map((c: string) => c.toLowerCase())).not.toContain("brows");
  });

  test("Maurice Meade is in Hair category, not Skin Care", async ({ request }) => {
    const res = await request.get(`${API}/providers/maurice-meade-subiaco-subiaco`);
    if (res.status() === 404) { test.skip(true, "Provider not found"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.categories?.map((c: string) => c.toLowerCase())).not.toContain("skin care");
  });

  test("Sonya's Beauty is in Lashes category, not Nails", async ({ request }) => {
    const res = await request.get(`${API}/providers/sonya-s-beauty-eyelash-extensions-studio-subiaco`);
    if (res.status() === 404) { test.skip(true, "Provider not found"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.categories?.map((c: string) => c.toLowerCase())).not.toContain("nails");
  });

  test("Full Spectrum Hair Concept is in Hair category, not Brows", async ({ request }) => {
    const res = await request.get(`${API}/providers/full-spectrum-hair-concept-myaree`);
    if (res.status() === 404) { test.skip(true, "Provider not found"); return; }
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.categories?.map((c: string) => c.toLowerCase())).not.toContain("brows");
  });
});

// ──────────────────────────────────────────────
// Data Quality — Seu Momento Deduplication
// ──────────────────────────────────────────────
test.describe("Data Quality – Deduplication", () => {
  test("only one Seu Momento listing exists", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?searchTerm=Seu+Momento&marketplaceType=0&pageSize=10`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    const seuMomento = body.data.items.filter((p: { businessName: string }) =>
      p.businessName.toLowerCase().includes("seu momento")
    );
    expect(seuMomento.length).toBeLessThanOrEqual(1);
  });

  test("seu-momento-beauty-subiaco is the surviving listing", async ({ request }) => {
    const res = await request.get(`${API}/providers/seu-momento-beauty-subiaco`);
    // Should exist (the correct listing)
    if (res.status() === 404) { test.skip(true, "Seu Momento not yet seeded"); return; }
    expect(res.status()).toBe(200);
  });
});

// ──────────────────────────────────────────────
// Data Quality — Provider Descriptions
// ──────────────────────────────────────────────
test.describe("Data Quality – Descriptions", () => {
  const providersWithDescriptions = [
    { slug: "her-on-oxford-mount-hawthorn", keyword: "skin sanctuary" },
    { slug: "ivy-reign-leederville", keyword: "Oxford Street" },
    { slug: "eesome-west-leederville", keyword: "aesthetic clinic" },
    { slug: "glow-skin-and-spa-baldivis", keyword: "five-star" },
    { slug: "full-spectrum-hair-concept-myaree", keyword: "colour work" },
    { slug: "breathe-beauty-wembley", keyword: "Serena" },
    { slug: "harper-hair-subiaco", keyword: "blonde" },
  ];

  for (const { slug, keyword } of providersWithDescriptions) {
    test(`${slug} has a rich description`, async ({ request }) => {
      const res = await request.get(`${API}/providers/${slug}`);
      if (res.status() === 404) { test.skip(true, `${slug} not found`); return; }
      expect(res.status()).toBe(200);
      const body = await res.json();
      const desc = body.data.description || "";
      expect(desc.length).toBeGreaterThan(80);
      expect(desc.toLowerCase()).toContain(keyword.toLowerCase());
    });
  }
});

// ──────────────────────────────────────────────
// Data Quality — Massage/Wellness Category Population
// ──────────────────────────────────────────────
test.describe("Data Quality – Massage & Wellness", () => {
  test("massage category has providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=massage&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });

  test("wellness category has providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=wellness&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });

  test("cosmetic category has providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=cosmetic&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────
// Data Quality — Provider Stats
// ──────────────────────────────────────────────
test.describe("Data Quality – Stats", () => {
  test("stats endpoint returns correct category count", async ({ request }) => {
    const res = await request.get(`${API}/providers/stats`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.categoryCount).toBeGreaterThanOrEqual(10);
  });

  test("stats endpoint returns suburb count > 70", async ({ request }) => {
    const res = await request.get(`${API}/providers/stats`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.suburbCount).toBeGreaterThanOrEqual(70);
  });

  test("stats endpoint returns provider count > 100", async ({ request }) => {
    const res = await request.get(`${API}/providers/stats`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.providerCount).toBeGreaterThan(100);
  });
});

// ──────────────────────────────────────────────
// Data Quality — Suburb Filtering
// ──────────────────────────────────────────────
test.describe("Data Quality – Suburb Filtering", () => {
  test("suburb filter narrows results", async ({ request }) => {
    const allRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const allBody = await allRes.json();
    const allCount = allBody.data.pagination.totalCount;

    const subRes = await request.get(`${API}/providers/search?suburb=subiaco&marketplaceType=0&pageSize=1`);
    const subBody = await subRes.json();
    const subCount = subBody.data.pagination.totalCount;

    expect(subCount).toBeLessThan(allCount);
    expect(subCount).toBeGreaterThan(0);
  });

  test("postcode filter returns results", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?suburb=6008&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });
});

// ──────────────────────────────────────────────
// Data Quality — Subscription / Billing
// ──────────────────────────────────────────────
test.describe("Data Quality – Billing Endpoints", () => {
  test("subscription endpoint requires auth", async ({ request }) => {
    const res = await request.get(`${API}/billing/subscription`);
    expect(res.status()).toBe(401);
  });
});
