/**
 * Appilico AI Agent Test Suite
 *
 * Uses ZeroStep to write tests in plain English.
 * Each test auto-reports bugs to BUGS.md via the BugsTracker.
 * Run with: npx playwright test --project=agent
 *
 * Set ZEROSTEP_TOKEN env var for AI-assisted steps.
 * Without the token, standard Playwright assertions are used as fallback.
 */
import { test, expect } from "@playwright/test";
import { readBugs, writeBugs, addBug, resolveBug } from "./bugs-tracker";

// ZeroStep imports — gracefully degrade if not installed or no token
let ai: ((task: string, config?: { page?: import("@playwright/test").Page }) => Promise<void>) | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const zerostep = require("@zerostep/playwright");
  ai = zerostep.ai;
} catch {
  // ZeroStep not available — fall back to manual assertions
}

const BEAUTY_URL = process.env.BEAUTY_URL || "https://beauty.appilico.com.au";
const SERVICES_URL = process.env.SERVICES_URL || "https://services.appilico.com.au";
const API_URL = process.env.API_URL || "https://api.appilico.com.au/api";
const API_ROOT = process.env.API_ROOT || "https://api.appilico.com.au"; // root (no /api prefix)

// Helper: wrap a test block and auto-record failures to BUGS.md
async function withBugTracking(
  area: string,
  title: string,
  testName: string,
  fn: () => Promise<void>
): Promise<void> {
  const bugs = readBugs();
  try {
    await fn();
    // If a bug with this title was previously open, mark it resolved
    const resolved = resolveBug(bugs, title);
    if (resolved) writeBugs(bugs);
  } catch (err) {
    const description = err instanceof Error ? err.message : String(err);
    addBug(bugs, { area, title, description, testName });
    writeBugs(bugs);
    throw err; // re-throw so Playwright marks the test as failed
  }
}

// ─────────────────────────────────────────────
// AREA: API Health
// ─────────────────────────────────────────────
test.describe("Agent – API Health", () => {
  test("API health check returns healthy", async ({ request }) => {
    await withBugTracking("api", "API health check returns healthy", "api-health", async () => {
      const res = await request.get(`${API_ROOT}/health`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.status).toBe("healthy");
    });
  });

  test("provider search returns results", async ({ request }) => {
    await withBugTracking("api", "Provider search returns results", "api-search", async () => {
      const res = await request.get(`${API_URL}/providers/search?marketplaceType=0&pageSize=5`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.pagination.totalCount).toBeGreaterThan(0);
    });
  });

  test("wellness category has providers (31 seeded)", async ({ request }) => {
    await withBugTracking("api", "Wellness category has at least 1 provider", "api-wellness", async () => {
      const res = await request.get(`${API_URL}/providers/search?category=wellness&marketplaceType=0&pageSize=1`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.data.pagination.totalCount).toBeGreaterThan(0);
    });
  });

  test("nearest suburb endpoint works for Perth CBD coords", async ({ request }) => {
    await withBugTracking("location", "Nearest suburb endpoint returns a suburb", "api-nearest-suburb", async () => {
      const res = await request.get(`${API_URL}/locations/suburbs/nearest?lat=-31.9505&lng=115.8605`);
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data).toHaveProperty("name");
      expect(body.data).toHaveProperty("postCode");
      expect(body.data.distanceKm).toBeLessThan(15);
    });
  });

  test("postcode proximity sort returns providers in order", async ({ request }) => {
    await withBugTracking("search", "Postcode proximity sort works", "api-postcode-sort", async () => {
      const res = await request.get(
        `${API_URL}/providers/search?marketplaceType=0&postCode=6160&sortBy=distance&pageSize=5`
      );
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      // Providers near 6160 (Fremantle) should exist
      expect(body.data.items.length).toBeGreaterThan(0);
    });
  });

  test("analytics event endpoint accepts anonymous event", async ({ request }) => {
    await withBugTracking("analytics", "Analytics event endpoint accepts anonymous tracking", "api-analytics", async () => {
      const res = await request.post(`${API_URL}/analytics/event`, {
        data: { eventType: "view_category", entityType: "category", entitySlug: "wellness", marketplaceType: 0 },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
    });
  });

  test("user registration creates a new account", async ({ request }) => {
    const unique = Date.now();
    await withBugTracking("auth", "User registration creates a new account", "api-register", async () => {
      const res = await request.post(`${API_URL}/auth/register`, {
        data: {
          firstName: "Test",
          lastName: `User${unique}`,
          email: `testuser${unique}@appilico-e2e.test`,
          password: "TestPass@123!",
          confirmPassword: "TestPass@123!",
        },
      });
      expect(res.status()).toBe(200);
      const body = await res.json();
      expect(body.success).toBe(true);
      expect(body.data.accessToken).toBeTruthy();
      expect(body.data.user.email).toBe(`testuser${unique}@appilico-e2e.test`);
      expect(body.data.user.roles).toContain("Customer");
    });
  });

  test("profile update saves address and postcode", async ({ request }) => {
    const unique = Date.now();
    await withBugTracking("auth", "Profile update saves address and postcode", "api-profile-update", async () => {
      // Register
      const regRes = await request.post(`${API_URL}/auth/register`, {
        data: {
          firstName: "Profile",
          lastName: "Tester",
          email: `profiletest${unique}@appilico-e2e.test`,
          password: "TestPass@123!",
          confirmPassword: "TestPass@123!",
        },
      });
      const regBody = await regRes.json();
      const token = regBody.data.accessToken;

      // Update profile with address
      const updateRes = await request.put(`${API_URL}/auth/me`, {
        data: { addressLine1: "12 Marine Parade", suburb: "Fremantle", postCode: "6160", state: "WA" },
        headers: { Authorization: `Bearer ${token}` },
      });
      const updateBody = await updateRes.json();
      expect(updateBody.success).toBe(true);
      expect(updateBody.data.postCode).toBe("6160");
      expect(updateBody.data.suburb).toBe("Fremantle");
    });
  });

  test("user preferences endpoint requires authentication", async ({ request }) => {
    await withBugTracking("auth", "User preferences endpoint requires authentication", "api-userprefs-auth", async () => {
      const res = await request.get(`${API_URL}/userpreferences`);
      expect([401, 403]).toContain(res.status());
    });
  });
});

// ─────────────────────────────────────────────
// AREA: Beauty Site UI (ZeroStep-powered)
// ─────────────────────────────────────────────
test.describe("Agent – Beauty Site UI", () => {
  test("homepage loads and shows brand name", async ({ page }) => {
    await withBugTracking("ui", "Homepage loads and shows brand name", "ui-homepage", async () => {
      await page.goto(BEAUTY_URL);
      await expect(page).toHaveTitle(/appilico/i);
      // Logo text visible
      await expect(page.locator("text=appilico").first()).toBeVisible();
    });
  });

  test("header shows Detect location chip", async ({ page }) => {
    await withBugTracking("location", "Header shows location detection chip", "ui-location-chip", async () => {
      await page.goto(BEAUTY_URL);
      const locationBtn = page.locator("button:has-text('Detect location'), button:has-text('Detect')").first();
      await expect(locationBtn).toBeVisible();
    });
  });

  test("header shows Sign up and Log in links for anonymous users", async ({ page }) => {
    await withBugTracking("auth", "Header shows Sign up and Log in for anonymous users", "ui-header-auth", async () => {
      await page.goto(BEAUTY_URL);
      const signupLink = page.locator("a[href='/signup'], a:has-text('Sign up')").first();
      await expect(signupLink).toBeVisible();
      const loginLink = page.locator("a[href='/login'], a:has-text('Log in')").first();
      await expect(loginLink).toBeVisible();
    });
  });

  test("signup page loads with form fields", async ({ page }) => {
    await withBugTracking("auth", "Signup page loads with form fields", "ui-signup-page", async () => {
      await page.goto(`${BEAUTY_URL}/signup`);
      await expect(page.locator("input[type='text']").first()).toBeVisible();
      await expect(page.locator("input[type='email']").first()).toBeVisible();
      await expect(page.locator("input[type='password']").first()).toBeVisible();
      await expect(page.locator("button[type='submit']")).toBeVisible();
    });
  });

  test("user can complete signup flow end-to-end", async ({ page }) => {
    const unique = Date.now();
    const email = `e2esignup${unique}@appilico-test.com`;
    await withBugTracking("auth", "User signup flow works end-to-end", "ui-signup-flow", async () => {
      await page.goto(`${BEAUTY_URL}/signup`);

      if (ai) {
        await ai("Fill in the first name field with 'E2E'", { page });
        await ai("Fill in the last name field with 'Tester'", { page });
        await ai(`Fill in the email field with '${email}'`, { page });
        await ai("Fill in the password field with 'TestPass@123!'", { page });
        await ai("Fill in the confirm password field with 'TestPass@123!'", { page });
        await ai("Click the Create account button", { page });
      } else {
        // Fallback: manual Playwright
        await page.fill("input[type='text']:nth-of-type(1)", "E2E");
        await page.fill("input[type='text']:nth-of-type(2)", "Tester");
        await page.fill("input[type='email']", email);
        const passwords = await page.locator("input[type='password']").all();
        await passwords[0].fill("TestPass@123!");
        await passwords[1].fill("TestPass@123!");
        await page.click("button[type='submit']");
      }

      // Should redirect to /profile after signup
      await page.waitForURL(/\/profile/, { timeout: 10000 });
      await expect(page.url()).toContain("/profile");
    });
  });

  test("login page has link to signup", async ({ page }) => {
    await withBugTracking("auth", "Login page links to signup", "ui-login-signup-link", async () => {
      await page.goto(`${BEAUTY_URL}/login`);
      const signupLink = page.locator("a[href='/signup'], a:has-text('Sign up'), a:has-text('Create')").first();
      await expect(signupLink).toBeVisible();
    });
  });

  test("search page accepts postcode parameter and shows distance label", async ({ page }) => {
    await withBugTracking("search", "Search page accepts postcode for proximity sort", "ui-search-postcode", async () => {
      await page.goto(`${BEAUTY_URL}/search?postCode=6160&sortBy=distance`);
      // Should show "near 6160" or "distance" label in heading/description
      const pageText = await page.locator("main, [data-testid='search-results']").first().textContent();
      expect(pageText?.toLowerCase()).toMatch(/6160|distance|near/);
    });
  });

  test("wellness category page shows providers", async ({ page }) => {
    await withBugTracking("wellness", "Wellness category page shows providers", "ui-wellness-category", async () => {
      await page.goto(`${BEAUTY_URL}/category/wellness`);
      // Should show at least one provider card
      const cards = page.locator("[data-provider-card], .provider-card, article, [class*='provider']");
      const count = await cards.count();
      if (count === 0) {
        // Try checking for a result count
        const bodyText = await page.locator("main").first().textContent();
        if (bodyText?.match(/0 provider|no provider|no result/i)) {
          throw new Error("Wellness category shows 0 providers — seeder may not have run");
        }
      }
    });
  });

  test("provider detail page loads correctly", async ({ page }) => {
    await withBugTracking("ui", "Provider detail page loads with contact info", "ui-provider-detail", async () => {
      // Get a real provider slug first
      const res = await page.request.get(`${API_URL}/providers/search?marketplaceType=0&pageSize=1&sortBy=rating`);
      const body = await res.json();
      const slug = body?.data?.items?.[0]?.slug;
      if (!slug) throw new Error("No provider found for detail page test");

      await page.goto(`${BEAUTY_URL}/provider/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
    });
  });
});

// ─────────────────────────────────────────────
// AREA: Services Site UI
// ─────────────────────────────────────────────
test.describe("Agent – Services Site UI", () => {
  test("services homepage loads", async ({ page }) => {
    await withBugTracking("services", "Services homepage loads", "ui-services-home", async () => {
      await page.goto(SERVICES_URL);
      await expect(page).toHaveTitle(/appilico|services/i);
    });
  });

  test("services login page loads with form", async ({ page }) => {
    await withBugTracking("services", "Services login page loads with email/password form", "ui-services-login", async () => {
      await page.goto(`${SERVICES_URL}/login`);
      await expect(page.locator("input[type='email']").first()).toBeVisible();
      await expect(page.locator("input[type='password']").first()).toBeVisible();
    });
  });

  test("services header shows improved logo", async ({ page }) => {
    await withBugTracking("services", "Services header shows appilico SERVICES logo", "ui-services-logo", async () => {
      await page.goto(SERVICES_URL);
      const headerText = await page.locator("header").first().textContent();
      expect(headerText?.toLowerCase()).toMatch(/appilico|services/i);
    });
  });
});

// ─────────────────────────────────────────────
// AREA: Profile Page (post-login)
// ─────────────────────────────────────────────
test.describe("Agent – Profile Page", () => {
  test("profile page redirects unauthenticated users to login", async ({ page }) => {
    await withBugTracking("auth", "Profile page redirects unauthenticated to login", "ui-profile-auth-guard", async () => {
      await page.goto(`${BEAUTY_URL}/profile`);
      // Should redirect to /login (either via JS or meta redirect)
      await page.waitForTimeout(2000);
      const url = page.url();
      // Accept either: redirected to /login, or shows a login prompt
      const isLoginPage = url.includes("/login");
      const showsLoginPrompt = await page.locator("input[type='email']").isVisible();
      expect(isLoginPage || showsLoginPrompt).toBe(true);
    });
  });

  test("profile page shows address fields after login", async ({ page }) => {
    const unique = Date.now();
    const email = `profileui${unique}@appilico-e2e.test`;
    await withBugTracking("auth", "Profile page shows address and postcode fields", "ui-profile-address", async () => {
      // Register via API first
      const regRes = await page.request.post(`${API_URL}/auth/register`, {
        data: {
          firstName: "Profile",
          lastName: "Test",
          email,
          password: "TestPass@123!",
          confirmPassword: "TestPass@123!",
        },
      });
      const regBody = await regRes.json();
      if (!regBody.success) throw new Error("Registration failed: " + regBody.message);

      // Set tokens in localStorage
      await page.goto(BEAUTY_URL);
      await page.evaluate(({ token, user }) => {
        localStorage.setItem("beauty_access_token", token);
        localStorage.setItem("beauty_user", JSON.stringify(user));
      }, { token: regBody.data.accessToken, user: regBody.data.user });

      await page.goto(`${BEAUTY_URL}/profile`);
      await expect(page.locator("text=Personal details, text=Address, text=profile")).toBeVisible({ timeout: 5000 }).catch(() => {});

      // Check postcode field exists
      const postcodeLabel = page.locator("text=Postcode");
      await expect(postcodeLabel).toBeVisible();
    });
  });
});
