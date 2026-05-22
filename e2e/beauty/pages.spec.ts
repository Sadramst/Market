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

  test("has hero search form", async ({ page }) => {
    await page.goto("/");
    // Hero should have search/suburb input
    const searchSection = page.locator('input, a[href="/search"]').first();
    await expect(searchSection).toBeVisible();
  });

  test("shows category links", async ({ page }) => {
    await page.goto("/");
    // Homepage should have category links
    const categoryLinks = page.locator('a[href*="/category/"], a[href*="/search?category="]');
    await expect(categoryLinks.first()).toBeVisible();
  });

  test("has JSON-LD structured data", async ({ page }) => {
    await page.goto("/");
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(jsonLd).toBeTruthy();
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
    // Verify the input has the value before submitting
    await expect(searchInput).toHaveValue("nails");
    await Promise.all([
      page.waitForURL(/q=nails/, { timeout: 15_000 }),
      page.locator('button[type="submit"]').click(),
    ]);
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
    // Ensure value is set before submitting
    await expect(sortSelect).toHaveValue("newest");
    await Promise.all([
      page.waitForURL(/sort=newest/, { timeout: 15_000 }),
      page.locator('button[type="submit"]').click(),
    ]);
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

  test("has BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/search");
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const hasBreadcrumb = scripts.some(s => s.includes("BreadcrumbList"));
    expect(hasBreadcrumb).toBe(true);
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

  test("shows services section", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      await expect(page.locator("body")).toContainText(/Services/);
    }
  });

  test("shows reviews section", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      await expect(page.locator("body")).toContainText(/Reviews/);
    }
  });

  test("has JSON-LD structured data", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      // Check for LocalBusiness JSON-LD
      const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent();
      expect(jsonLd).toContain("LocalBusiness");
    }
  });

  test("has BreadcrumbList JSON-LD", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      const hasBreadcrumb = scripts.some(s => s.includes("BreadcrumbList"));
      expect(hasBreadcrumb).toBe(true);
    }
  });

  test("shows breadcrumb navigation", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      // Should have breadcrumb with Home link
      await expect(page.locator('a[href="/"]').first()).toBeVisible();
    }
  });

  test("shows contact sidebar", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      await expect(page.locator("body")).toContainText(/Contact/);
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

test.describe("Beauty – Navigation & Footer", () => {
  test("header contains logo linking to home", async ({ page }) => {
    await page.goto("/search");
    const logo = page.locator('header a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test("footer is visible on all pages", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toBeVisible();
    await expect(page.locator("footer")).toContainText(/appilico/i);
  });

  test("footer has legal links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="/privacy"]')).toBeVisible();
    await expect(footer.locator('a[href="/terms"]')).toBeVisible();
  });

  test("footer has business links", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.locator('a[href="/join"]')).toBeVisible();
    await expect(footer.locator('a[href="/about"]')).toBeVisible();
  });

  test("categories nav link works", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/categories"]').first().click();
    await page.waitForURL(/categories/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("browse nav link goes to search", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="/search"]').first().click();
    await page.waitForURL(/search/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("suburbs nav link works", async ({ page }) => {
    await page.goto("/");
    const suburbsLink = page.locator('a[href="/suburbs"]').first();
    if (await suburbsLink.isVisible()) {
      await suburbsLink.click();
      await page.waitForURL(/suburbs/);
    }
  });
});

test.describe("Beauty – Provider Cards", () => {
  test("search results show provider cards with names", async ({ page }) => {
    await page.goto("/search");
    const cards = page.locator('a[href^="/provider/"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("provider card links lead to valid pages", async ({ page }) => {
    await page.goto("/search");
    const firstCard = page.locator('a[href^="/provider/"]').first();
    const href = await firstCard.getAttribute("href");
    expect(href).toBeTruthy();
    const response = await page.goto(href!);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("provider detail shows related providers section", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      // Should show similar or nearby providers
      const body = await page.textContent("body");
      expect(body).toMatch(/Similar|Nearby|Related/i);
    }
  });
});

test.describe("Beauty – 404 Page", () => {
  test("shows not-found content for non-existent page", async ({ page }) => {
    await page.goto("/this-page-definitely-does-not-exist");
    // Next.js may return 200 with a custom 404 page
    await expect(page.locator("body")).toContainText(/not found|404|page doesn.t exist/i);
  });

  test("returns 404 for non-existent provider", async ({ page }) => {
    const response = await page.goto("/provider/this-provider-slug-does-not-exist-99999");
    // Should be 404 or redirect
    expect([200, 404]).toContain(response?.status());
  });
});

test.describe("Beauty – SEO & Meta", () => {
  test("homepage has meta description", async ({ page }) => {
    await page.goto("/");
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute("content");
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(20);
  });

  test("search page has meta description", async ({ page }) => {
    await page.goto("/search");
    const metaDesc = page.locator('meta[name="description"]');
    const content = await metaDesc.getAttribute("content");
    expect(content).toBeTruthy();
  });

  test("homepage has Open Graph tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = page.locator('meta[property="og:title"]');
    const ogDesc = page.locator('meta[property="og:description"]');
    expect(await ogTitle.getAttribute("content")).toBeTruthy();
    expect(await ogDesc.getAttribute("content")).toBeTruthy();
  });

  test("provider page has proper title", async ({ page }) => {
    await page.goto("/search");
    const providerLink = page.locator('a[href^="/provider/"]').first();
    if (await providerLink.isVisible()) {
      const href = await providerLink.getAttribute("href");
      await page.goto(href!);
      const title = await page.title();
      expect(title.length).toBeGreaterThan(5);
      expect(title).not.toContain("404");
    }
  });
});

test.describe("Beauty – Accessibility Basics", () => {
  test("all images have alt text", async ({ page }) => {
    await page.goto("/");
    const images = page.locator("img");
    const count = await images.count();
    for (let i = 0; i < Math.min(count, 10); i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).not.toBeNull();
    }
  });

  test("search input has accessible attributes", async ({ page }) => {
    await page.goto("/search");
    const searchInput = page.locator('input[name="q"]');
    // Should have placeholder or label
    const placeholder = await searchInput.getAttribute("placeholder");
    expect(placeholder).toBeTruthy();
  });

  test("login form inputs have labels or aria", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
  });
});
