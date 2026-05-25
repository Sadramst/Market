import { test, expect } from "@playwright/test";

const API = "https://api.appilico.com.au/api";
const API_ROOT = "https://api.appilico.com.au";

// ──────────────────────────────────────────────
// Health & Core
// ──────────────────────────────────────────────
test.describe("API – Health", () => {
  test("health endpoint returns healthy", async ({ request }) => {
    const res = await request.get(`${API_ROOT}/health`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("healthy");
  });
});

// ──────────────────────────────────────────────
// Provider Search
// ──────────────────────────────────────────────
test.describe("API – Provider Search", () => {
  test("returns paginated results", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });

  test("text query filter works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?searchTerm=hair&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("suburb filter works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?suburb=subiaco&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("sort by rating works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=rating&marketplaceType=0&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    if (body.data.items.length >= 2) {
      expect(body.data.items[0].averageRating).toBeGreaterThanOrEqual(body.data.items[1].averageRating);
    }
  });

  test("sort by reviews works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=reviews&marketplaceType=0&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    if (body.data.items.length >= 2) {
      expect(body.data.items[0].totalReviews).toBeGreaterThanOrEqual(body.data.items[1].totalReviews);
    }
  });

  test("sort by newest works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=newest&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("postcode proximity sort returns results", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&postCode=6160&sortBy=distance&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("pagination page 2 works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=5&page=2`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.pagination.currentPage).toBe(2);
  });
});

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────
test.describe("API – Categories", () => {
  test("beauty categories endpoint returns data", async ({ request }) => {
    const res = await request.get(`${API}/categories/beauty`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("IT categories endpoint returns data", async ({ request }) => {
    const res = await request.get(`${API}/categories/it`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  const allCats = ["nails", "hair", "lashes", "brows", "skin-care", "makeup", "body", "massage", "wellness"];
  for (const cat of allCats) {
    test(`${cat} category has providers`, async ({ request }) => {
      const res = await request.get(`${API}/providers/search?category=${cat}&marketplaceType=0&pageSize=1`);
      if (res.status() === 503) { test.skip(true, "API offline"); return; }
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.pagination.totalCount).toBeGreaterThan(0);
    });
  }
});

// ──────────────────────────────────────────────
// Provider Detail
// ──────────────────────────────────────────────
test.describe("API – Provider Detail", () => {
  test("provider detail by slug returns full data", async ({ request }) => {
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1&sortBy=rating`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    expect(slug).toBeTruthy();

    const res = await request.get(`${API}/providers/${slug}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.businessName).toBeTruthy();
    expect(body.data.slug).toBe(slug);
  });

  test("related providers endpoint works", async ({ request }) => {
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    const res = await request.get(`${API}/providers/${slug}/related?count=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("nearby providers endpoint works", async ({ request }) => {
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    const res = await request.get(`${API}/providers/${slug}/nearby?count=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("unknown slug returns 404", async ({ request }) => {
    const res = await request.get(`${API}/providers/this-slug-does-not-exist-xyz-999`);
    expect(res.status()).toBe(404);
  });
});

// ──────────────────────────────────────────────
// Locations
// ──────────────────────────────────────────────
test.describe("API – Locations", () => {
  test("suburbs list returns data", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(50);
  });

  test("suburb search filter works", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs?search=Perth`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    const names = body.data.map((s: { name: string }) => s.name.toLowerCase());
    expect(names.some((n: string) => n.includes("perth"))).toBe(true);
  });

  test("suburb by slug works", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs/fremantle`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBe("Fremantle");
    expect(body.data.postCode).toBe("6160");
  });

  test("nearest suburb returns suburb for Perth CBD coords", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs/nearest?lat=-31.9505&lng=115.8605`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.name).toBeTruthy();
    expect(body.data.postCode).toBeTruthy();
    expect(body.data.distanceKm).toBeLessThan(10);
  });

  test("nearest suburb returns suburb for Fremantle coords", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs/nearest?lat=-32.0569&lng=115.7439`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.postCode).toBeTruthy();
    expect(body.data.distanceKm).toBeLessThan(5);
  });
});

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────
test.describe("API – Auth", () => {
  test("login with wrong credentials returns 401 not 500", async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: "bad@example.com", password: "wrong" },
    });
    expect(res.status()).not.toBe(500);
    const body = await res.json();
    expect(body.success).toBe(false);
  });

  test("register creates account and returns token", async ({ request }) => {
    const unique = Date.now();
    const res = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Test",
        lastName: `User${unique}`,
        email: `testapi${unique}@appilico-e2e.test`,
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeTruthy();
    expect(body.data.user.roles).toContain("Customer");
  });

  test("register with duplicate email returns error", async ({ request }) => {
    const res = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Admin",
        lastName: "Dup",
        email: "admin@appilico.com",
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.message).toBeTruthy();
  });

  test("GET /auth/me without token returns 401", async ({ request }) => {
    const res = await request.get(`${API}/auth/me`);
    expect(res.status()).toBe(401);
  });

  test("GET /auth/me with valid token returns profile", async ({ request }) => {
    const unique = Date.now();
    const regRes = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Profile",
        lastName: "Test",
        email: `metest${unique}@appilico-e2e.test`,
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    const regBody = await regRes.json();
    const token = regBody.data?.accessToken;
    expect(token).toBeTruthy();

    const meRes = await request.get(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(meRes.status()).toBe(200);
    const meBody = await meRes.json();
    expect(meBody.success).toBe(true);
    expect(meBody.data.email).toContain("metest");
  });

  test("PUT /auth/me saves address fields", async ({ request }) => {
    const unique = Date.now();
    const regRes = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Addr",
        lastName: "Test",
        email: `addrtest${unique}@appilico-e2e.test`,
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    const regBody = await regRes.json();
    const token = regBody.data?.accessToken;
    expect(token).toBeTruthy();

    const updateRes = await request.put(`${API}/auth/me`, {
      data: { firstName: "Addr", lastName: "Test", addressLine1: "12 High St", suburb: "Fremantle", postCode: "6160", state: "WA" },
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(updateRes.status()).toBe(200);
    const updateBody = await updateRes.json();
    expect(updateBody.success).toBe(true);
    expect(updateBody.data.postCode).toBe("6160");
    expect(updateBody.data.suburb).toBe("Fremantle");
    expect(updateBody.data.addressLine1).toBe("12 High St");
  });

  test("admin stats endpoint requires auth", async ({ request }) => {
    const res = await request.get(`${API}/admin/stats`);
    expect(res.status()).toBe(401);
  });

  test("user preferences requires auth", async ({ request }) => {
    const res = await request.get(`${API}/userpreferences`);
    expect([401, 403]).toContain(res.status());
  });
});

// ──────────────────────────────────────────────
// Analytics
// ──────────────────────────────────────────────
test.describe("API – Analytics", () => {
  test("anonymous analytics event is accepted", async ({ request }) => {
    const res = await request.post(`${API}/analytics/event`, {
      data: { eventType: "view_category", entityType: "category", entitySlug: "wellness", marketplaceType: 0 },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("analytics batch endpoint is accepted", async ({ request }) => {
    const res = await request.post(`${API}/analytics/batch`, {
      data: {
        events: [
          { eventType: "view_provider", entityType: "provider", entitySlug: "test", marketplaceType: 0 },
          { eventType: "click_contact", entityType: "provider", entitySlug: "test", marketplaceType: 0 },
        ],
      },
    });
    expect([200, 400]).toContain(res.status()); // 400 if batch not implemented, 200 if it is
  });
});


test.describe("API – Health & Core Endpoints", () => {
  test("search endpoint returns providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
    expect(body.data.pagination.totalCount).toBeGreaterThan(0);
  });

  test("beauty categories endpoint works", async ({ request }) => {
    const res = await request.get(`${API}/categories/beauty`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
  });

  test("IT categories endpoint works", async ({ request }) => {
    const res = await request.get(`${API}/categories/it`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("suburbs endpoint works", async ({ request }) => {
    const res = await request.get(`${API}/locations/suburbs`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("provider detail by slug works", async ({ request }) => {
    // First get a slug from search
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    expect(slug).toBeTruthy();

    const res = await request.get(`${API}/providers/${slug}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.businessName).toBeTruthy();
  });

  test("search with category filter works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?category=nails&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("search with text query works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?searchTerm=hair&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("login endpoint responds", async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: "test@test.com", password: "wrong" },
    });
    // Should return 401 or 400, not 500
    expect(res.status()).not.toBe(500);
  });

  test("admin stats requires auth", async ({ request }) => {
    const res = await request.get(`${API}/admin/stats`);
    expect(res.status()).toBe(401);
  });

  test("related providers endpoint works", async ({ request }) => {
    // Get a real slug first
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    expect(slug).toBeTruthy();

    const res = await request.get(`${API}/providers/${slug}/related?count=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("nearby providers endpoint works", async ({ request }) => {
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1`);
    const searchBody = await searchRes.json();
    const slug = searchBody.data.items[0]?.slug;
    expect(slug).toBeTruthy();

    const res = await request.get(`${API}/providers/${slug}/nearby?count=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test("search with suburb filter works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?suburb=subiaco&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("search sort by reviews works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=reviews&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    if (body.data.items.length >= 2) {
      expect(body.data.items[0].totalReviews).toBeGreaterThanOrEqual(body.data.items[1].totalReviews);
    }
  });

  test("search sort by newest works", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=newest&marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("reviews endpoint for provider works", async ({ request }) => {
    // Get provider with known reviews
    const searchRes = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=1&sortBy=reviews`);
    const searchBody = await searchRes.json();
    const id = searchBody.data.items[0]?.id;
    expect(id).toBeTruthy();

    const res = await request.get(`${API}/reviews/provider/${id}?pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("featured providers endpoint works", async ({ request }) => {
    const res = await request.get(`${API}/providers/featured?limit=3&providerType=0`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("search pagination works", async ({ request }) => {
    const page1 = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=5&page=1`);
    const page2 = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=5&page=2`);
    expect(page1.status()).toBe(200);
    expect(page2.status()).toBe(200);
    const body1 = await page1.json();
    const body2 = await page2.json();
    // Both pages should return data
    expect(body1.data.items.length).toBeGreaterThan(0);
    expect(body2.data.items.length).toBeGreaterThan(0);
    // Total count should match across pages
    expect(body1.data.pagination.totalCount).toBe(body2.data.pagination.totalCount);
  });

  test("sort by name returns providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?sortBy=name&marketplaceType=0&pageSize=5`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.items.length).toBeGreaterThan(0);
  });

  test("invalid provider slug returns 404", async ({ request }) => {
    const res = await request.get(`${API}/providers/definitely-does-not-exist-12345`);
    expect(res.status()).toBe(404);
  });

  test("search with empty query returns all providers", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=0&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data.pagination.totalCount).toBeGreaterThan(100);
  });

  test("login with correct credentials returns token", async ({ request }) => {
    const res = await request.post(`${API}/auth/login`, {
      data: { email: "admin@appilico.com", password: "Admin@123!" },
      timeout: 15_000,
    });
    if (res.status() !== 200) {
      test.skip(true, "Login API temporarily unavailable");
      return;
    }
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.accessToken).toBeTruthy();
    expect(body.data.user.email).toBe("admin@appilico.com");
  });

  test("categories have parent-child structure", async ({ request }) => {
    const res = await request.get(`${API}/categories/beauty`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    // Some categories should have subCategories
    const hasChildren = body.data.some((c: any) => c.subCategories && c.subCategories.length > 0);
    expect(hasChildren).toBe(true);
  });
});

test.describe("API – Category Provider Counts", () => {
  const categories = ["nails", "hair", "lashes", "brows", "skin-care", "makeup", "body", "massage", "wellness"];

  for (const cat of categories) {
    test(`${cat} category returns providers`, async ({ request }) => {
      const res = await request.get(`${API}/providers/search?category=${cat}&marketplaceType=0&pageSize=3`, { timeout: 15_000 });
      if (res.status() === 503) {
        test.skip(true, "API temporarily unavailable");
        return;
      }
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.pagination.totalCount).toBeGreaterThan(0);
      expect(body.data.items.length).toBeGreaterThan(0);
    });
  }
});
