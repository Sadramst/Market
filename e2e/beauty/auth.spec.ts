import { test, expect, type Page } from "@playwright/test";

// Test credentials – these are for the deployed test environment
const TEST_USER = {
  email: "admin@appilico.com.au",
  password: "Admin123!",
};

async function login(page: Page) {
  await page.goto("/login");
  await page.locator('input[type="email"], input[name="email"]').fill(TEST_USER.email);
  await page.locator('input[type="password"], input[name="password"]').fill(TEST_USER.password);
  await page.locator('button[type="submit"]').click();
  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: 10_000 });
}

test.describe("Beauty – Login", () => {
  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
    await expect(page.locator('input[type="email"], input[name="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]')).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"], input[name="email"]').fill("bad@test.com");
    await page.locator('input[type="password"], input[name="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();
    // Should show error message, not redirect
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/login");
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    await login(page);
    expect(page.url()).toContain("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Beauty – Dashboard (authenticated)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("dashboard page loads after login", async ({ page }) => {
    await expect(page.locator("body")).toContainText(/dashboard|welcome|profile/i);
  });
});
