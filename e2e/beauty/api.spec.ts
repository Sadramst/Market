import { test, expect } from "@playwright/test";

const API = "https://api.appilico.com.au/api";

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
});
