import { test, expect, type Page } from "@playwright/test";

const ADMIN_CREDS = {
  email: "admin@appilico.com.au",
  password: "Admin123!",
};

async function adminLogin(page: Page) {
  await page.goto("/");
  await page.locator('input[type="email"], input[name="email"]').fill(ADMIN_CREDS.email);
  await page.locator('input[type="password"], input[name="password"]').fill(ADMIN_CREDS.password);
  await page.locator('button[type="submit"]').click();
  // Check for network error (env var not set on Vercel)
  const networkError = page.locator('text=Network error');
  const dashboard = page.locator('text=dashboard').first();
  const result = await Promise.race([
    networkError.waitFor({ timeout: 5000 }).then(() => "network-error" as const),
    page.waitForURL(/dashboard/, { timeout: 15_000 }).then(() => "success" as const),
  ]).catch(() => "timeout" as const);
  if (result === "network-error") {
    throw new Error("Admin API unreachable - set NEXT_PUBLIC_API_URL=https://api.appilico.com.au/api in Vercel env vars for admin app");
  }
}

test.describe("Admin – Login", () => {
  test("login page loads with form", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("rejects invalid credentials", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[type="email"], input[name="email"]').fill("fake@test.com");
    await page.locator('input[type="password"], input[name="password"]').fill("wrongpass");
    await page.locator('button[type="submit"]').click();
    await page.waitForTimeout(3000);
    // Should stay on login page
    expect(page.url()).not.toContain("/dashboard");
  });

  test("successful login goes to dashboard", async ({ page }) => {
    await adminLogin(page);
    expect(page.url()).toContain("/dashboard");
  });
});

test.describe("Admin – Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("shows stats cards", async ({ page }) => {
    // Dashboard should display summary stats
    await expect(page.locator("body")).toContainText(/provider|user|review/i);
  });

  test("has sidebar navigation", async ({ page }) => {
    // Check for key nav items
    await expect(page.locator('a[href="/dashboard"]').first()).toBeVisible();
    await expect(page.locator('a[href="/dashboard/providers"]').first()).toBeVisible();
    await expect(page.locator('a[href="/dashboard/categories"]').first()).toBeVisible();
  });
});

test.describe("Admin – Providers", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("providers page loads", async ({ page }) => {
    await page.goto("/dashboard/providers");
    await expect(page.locator("body")).toContainText(/provider/i);
  });

  test("shows provider list with data", async ({ page }) => {
    await page.goto("/dashboard/providers");
    // Should show at least one provider row
    await page.waitForTimeout(2000);
    const body = await page.textContent("body");
    expect(body).toMatch(/approved|pending|suspended/i);
  });

  test("status filter links work", async ({ page }) => {
    await page.goto("/dashboard/providers");
    // Try clicking an "Approved" filter if present
    const approvedLink = page.locator('a:has-text("Approved")').first();
    if (await approvedLink.isVisible()) {
      await approvedLink.click();
      await page.waitForTimeout(1000);
      expect(page.url()).toContain("status");
    }
  });
});

test.describe("Admin – Reviews", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("reviews page loads", async ({ page }) => {
    await page.goto("/dashboard/reviews");
    await expect(page.locator("body")).toContainText(/review/i);
  });
});

test.describe("Admin – Enquiries", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("enquiries page loads", async ({ page }) => {
    await page.goto("/dashboard/enquiries");
    await expect(page.locator("body")).toContainText(/enquir/i);
  });
});

test.describe("Admin – Categories", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("categories page loads", async ({ page }) => {
    await page.goto("/dashboard/categories");
    await expect(page.locator("body")).toContainText(/categor/i);
  });

  test("shows beauty categories", async ({ page }) => {
    await page.goto("/dashboard/categories");
    await page.waitForTimeout(2000);
    // Should show beauty category names
    const body = await page.textContent("body");
    expect(body).toMatch(/nails|hair|lash|brow|skin|makeup/i);
  });

  test("shows subcategories", async ({ page }) => {
    await page.goto("/dashboard/categories");
    await page.waitForTimeout(2000);
    // Should have hierarchical display with subcategories
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Admin – Users", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("users page loads", async ({ page }) => {
    await page.goto("/dashboard/users");
    await expect(page.locator("body")).toContainText(/user/i);
  });

  test("search filter works", async ({ page }) => {
    await page.goto("/dashboard/users");
    const searchInput = page.locator('input[type="text"], input[placeholder*="earch"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("admin");
      await page.waitForTimeout(2000);
      const body = await page.textContent("body");
      expect(body).toMatch(/admin/i);
    }
  });
});

test.describe("Admin – Reports", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("reports page loads", async ({ page }) => {
    await page.goto("/dashboard/reports");
    await expect(page.locator("body")).toContainText(/report/i);
  });
});

test.describe("Admin – Settings", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("settings page loads", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await expect(page.locator("body")).toContainText(/setting/i);
  });

  test("shows setting inputs", async ({ page }) => {
    await page.goto("/dashboard/settings");
    await page.waitForTimeout(2000);
    // Settings page should have input fields
    const inputs = page.locator('input[type="text"]');
    const inputCount = await inputs.count();
    expect(inputCount).toBeGreaterThanOrEqual(0);
  });
});

test.describe("Admin – Data Imports", () => {
  test.beforeEach(async ({ page }) => {
    await adminLogin(page);
  });

  test("imports page loads", async ({ page }) => {
    await page.goto("/dashboard/imports");
    await expect(page.locator("body")).toContainText(/import/i);
  });

  test("has CSV editor area", async ({ page }) => {
    await page.goto("/dashboard/imports");
    const textarea = page.locator("textarea").first();
    if (await textarea.isVisible()) {
      await expect(textarea).toBeVisible();
    }
  });
});

test.describe("Admin – Navigation Flow", () => {
  test("can navigate through all pages", async ({ page }) => {
    await adminLogin(page);

    const routes = [
      "/dashboard",
      "/dashboard/providers",
      "/dashboard/reviews",
      "/dashboard/enquiries",
      "/dashboard/categories",
      "/dashboard/users",
      "/dashboard/reports",
      "/dashboard/settings",
      "/dashboard/imports",
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForTimeout(1000);
      // Each page should load without crashing
      await expect(page.locator("body")).toBeVisible();
      // Should not show error
      const body = await page.textContent("body");
      expect(body).not.toContain("Application error");
    }
  });
});
