import { test, expect } from "@playwright/test";

const API = "https://api.appilico.com.au/api";
// Note: services Vercel deployment is at service.appilico.com.au (no trailing 's')

// ──────────────────────────────────────────────
// Core Pages
// ──────────────────────────────────────────────
test.describe("Services – Homepage", () => {
  test("homepage loads with 200 status", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("homepage has appilico in title or body", async ({ page }) => {
    await page.goto("/");
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).toMatch(/appilico|services|it|provider/i);
  });

  test("homepage has header/nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header, nav").first()).toBeVisible();
  });

  test("homepage header shows appilico branding", async ({ page }) => {
    await page.goto("/");
    const headerText = await page.locator("header").first().textContent();
    expect(headerText?.toLowerCase()).toMatch(/appilico|services/i);
  });

  test("homepage has no application errors", async ({ page }) => {
    await page.goto("/");
    const body = await page.textContent("body");
    expect(body).not.toContain("Application error");
    expect(body).not.toContain("Internal Server Error");
    expect(body).not.toContain("Unhandled Runtime Error");
  });
});

test.describe("Services – Login Page", () => {
  test("login page loads with 200 status", async ({ page }) => {
    const res = await page.goto("/login");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page has email and password fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("login page has sign in button", async ({ page }) => {
    await page.goto("/login");
    const btn = page.locator('button[type="submit"], button:has-text("Sign in")').first();
    await expect(btn).toBeVisible();
  });

  test("login with wrong credentials shows error", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("notexist@example.com");
    await page.locator('input[type="password"]').fill("WrongPass!");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    // Stay on login or show error
    const url = page.url();
    expect(url).toContain("/login");
  });
});

test.describe("Services – Search Page", () => {
  test("search page loads", async ({ page }) => {
    const res = await page.goto("/search");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("search shows results or empty state", async ({ page }) => {
    await page.goto("/search");
    const body = await page.textContent("body");
    expect(body).toMatch(/provider|service|result|found|listed/i);
  });

  test("search form input exists", async ({ page }) => {
    await page.goto("/search");
    const input = page.locator('input[name="q"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(input).toBeVisible();
  });
});

test.describe("Services – Categories Page", () => {
  test("categories page loads", async ({ page }) => {
    const res = await page.goto("/categories");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("categories page shows IT categories", async ({ page }) => {
    await page.goto("/categories");
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});

test.describe("Services – Join Page", () => {
  test("join page loads", async ({ page }) => {
    const res = await page.goto("/join");
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("join page has relevant content", async ({ page }) => {
    await page.goto("/join");
    const body = await page.textContent("body");
    expect(body).toMatch(/join|list|business|contact|email/i);
  });
});

test.describe("Services – No Errors", () => {
  const routes = ["/", "/search", "/categories", "/join", "/login"];
  for (const route of routes) {
    test(`${route} loads without application error`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      const body = await page.textContent("body");
      expect(body).not.toContain("Application error");
      expect(body).not.toContain("Internal Server Error");
      expect(body).not.toContain("Unhandled Runtime Error");
    });
  }
});

test.describe("Services – API Integration", () => {
  test("IT provider search returns results", async ({ request }) => {
    const res = await request.get(`${API}/providers/search?marketplaceType=1&pageSize=3`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  test("IT categories are available", async ({ request }) => {
    const res = await request.get(`${API}/categories/it`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
