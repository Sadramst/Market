import { test, expect } from "@playwright/test";

test.describe("Services – Home Page", () => {
  test("loads and shows content", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("has navigation", async ({ page }) => {
    await page.goto("/");
    // Should have nav links
    await expect(page.locator("nav, header").first()).toBeVisible();
  });
});

test.describe("Services – Search Page", () => {
  test("loads search page", async ({ page }) => {
    const response = await page.goto("/search");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("shows provider results or empty state", async ({ page }) => {
    await page.goto("/search");
    const body = await page.textContent("body");
    // Either shows providers or "no providers" message
    expect(body).toMatch(/provider|service|result|found|listed/i);
  });

  test("search form exists", async ({ page }) => {
    await page.goto("/search");
    const searchInput = page.locator('input[name="q"], input[type="search"], input[placeholder*="earch"]').first();
    await expect(searchInput).toBeVisible();
  });
});

test.describe("Services – Categories Page", () => {
  test("loads categories page", async ({ page }) => {
    const response = await page.goto("/categories");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("shows IT service categories", async ({ page }) => {
    await page.goto("/categories");
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});

test.describe("Services – Category Detail", () => {
  test("loads a category slug page", async ({ page }) => {
    // Navigate from categories page to find a real slug
    await page.goto("/categories");
    const categoryLink = page.locator('a[href^="/category/"]').first();
    if (await categoryLink.isVisible()) {
      const href = await categoryLink.getAttribute("href");
      await page.goto(href!);
      expect(page.url()).toContain("/category/");
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Services – Provider Detail", () => {
  test("loads a provider page from search", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      expect(page.url()).toContain("/provider/");
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Services – Join Page", () => {
  test("loads join page", async ({ page }) => {
    const response = await page.goto("/join");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("shows join form or contact info", async ({ page }) => {
    await page.goto("/join");
    const body = await page.textContent("body");
    // Should have contact or join information
    expect(body).toMatch(/join|list|business|contact|email/i);
  });
});

test.describe("Services – No errors on any page", () => {
  test("all pages load without errors", async ({ page }) => {
    const routes = ["/", "/search", "/categories", "/join"];
    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const body = await page.textContent("body");
      expect(body).not.toContain("Application error");
      expect(body).not.toContain("Internal Server Error");
    }
  });
});
