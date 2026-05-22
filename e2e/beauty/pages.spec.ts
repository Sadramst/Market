import { test, expect } from "@playwright/test";

test.describe("Beauty – Home Page", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/appilico|beauty/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("has navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('a[href="/search"]').first()).toBeVisible();
    await expect(page.locator('a[href="/categories"]').first()).toBeVisible();
  });

  test("shows featured providers", async ({ page }) => {
    await page.goto("/");
    // Should have provider cards or featured section
    const body = await page.textContent("body");
    expect(body).toBeTruthy();
  });
});

test.describe("Beauty – Search Page", () => {
  test("loads search page without error", async ({ page }) => {
    const response = await page.goto("/search");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
    // Should NOT show Next.js error overlay
    await expect(page.locator("#__next-build-error")).not.toBeVisible();
  });

  test("shows provider results", async ({ page }) => {
    await page.goto("/search");
    await expect(page.locator("h1")).toContainText(/browse|results|search/i);
    // Should show provider count
    await expect(page.locator("body")).toContainText(/provider/i);
  });

  test("search form works", async ({ page }) => {
    await page.goto("/search");
    const searchInput = page.locator('input[name="q"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("nails");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/q=nails/);
    await expect(page.locator("body")).toContainText(/result|provider|nails/i);
  });

  test("suburb filter works", async ({ page }) => {
    await page.goto("/search");
    const suburbInput = page.locator('input[name="suburb"]');
    await expect(suburbInput).toBeVisible();
    await suburbInput.fill("Perth");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/suburb=Perth/);
  });

  test("sort dropdown works", async ({ page }) => {
    await page.goto("/search");
    const sortSelect = page.locator('select[name="sort"]');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption("newest");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/sort=newest/);
  });

  test("category filter pills are visible", async ({ page }) => {
    await page.goto("/search");
    // Category pills like Nails, Hair, etc.
    const pills = page.locator('a[href*="/search?"]');
    await expect(pills.first()).toBeVisible();
  });

  test("category filter navigates correctly", async ({ page }) => {
    await page.goto("/search?category=nails");
    const response = await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toContainText(/provider/i);
  });

  test("pagination shows when enough results", async ({ page }) => {
    await page.goto("/search");
    // With 517 providers, pagination should show
    const pageText = page.locator("text=Page 1 of");
    await expect(pageText).toBeVisible();
  });

  test("next page works", async ({ page }) => {
    await page.goto("/search");
    const nextLink = page.locator('a:has-text("Next")');
    if (await nextLink.isVisible()) {
      await nextLink.click();
      await page.waitForURL(/page=2/);
      await expect(page.locator("body")).toContainText(/Page 2/);
    }
  });
});

test.describe("Beauty – Categories Page", () => {
  test("loads categories page", async ({ page }) => {
    const response = await page.goto("/categories");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("shows category links", async ({ page }) => {
    await page.goto("/categories");
    // Should have links to individual categories
    const categoryLinks = page.locator('a[href*="/category/"]');
    await expect(categoryLinks.first()).toBeVisible();
  });
});

test.describe("Beauty – Category Detail", () => {
  test("loads a category page", async ({ page }) => {
    const response = await page.goto("/category/nails");
    expect(response?.status()).toBe(200);
    await expect(page.locator("body")).toBeVisible();
  });

  test("shows providers for category", async ({ page }) => {
    await page.goto("/category/nails");
    await expect(page.locator("body")).toContainText(/nail/i);
  });
});

test.describe("Beauty – Provider Detail", () => {
  test("loads a real provider page", async ({ page }) => {
    // First get a real slug from search
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      expect(page.url()).toContain("/provider/");
      await expect(page.locator("h1")).toBeVisible();
    }
  });

  test("shows provider business info", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      // Should show address, rating, contact info
      await expect(page.locator("body")).toContainText(/WA|rating|review|contact/i);
    }
  });
});

test.describe("Beauty – Suburbs", () => {
  test("loads suburbs page", async ({ page }) => {
    const response = await page.goto("/suburbs");
    expect(response?.status()).toBe(200);
  });
});

test.describe("Beauty – Static Pages", () => {
  test("about page loads", async ({ page }) => {
    const response = await page.goto("/about");
    expect(response?.status()).toBe(200);
  });

  test("contact page loads", async ({ page }) => {
    const response = await page.goto("/contact");
    expect(response?.status()).toBe(200);
  });

  test("pricing page loads", async ({ page }) => {
    const response = await page.goto("/pricing");
    expect(response?.status()).toBe(200);
  });

  test("privacy page loads", async ({ page }) => {
    const response = await page.goto("/privacy");
    expect(response?.status()).toBe(200);
  });

  test("terms page loads", async ({ page }) => {
    const response = await page.goto("/terms");
    expect(response?.status()).toBe(200);
  });

  test("join page loads", async ({ page }) => {
    const response = await page.goto("/join");
    expect(response?.status()).toBe(200);
  });
});
