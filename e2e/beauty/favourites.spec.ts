import { test, expect } from "@playwright/test";

test.describe("Beauty – Saved / Favourites", () => {
  test("favourites page loads and shows empty state when nothing saved", async ({ page }) => {
    const response = await page.goto("/favourites");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/saved/i);
    await expect(page.locator("body")).toContainText(/no saved providers|browse providers/i);
  });

  test("header has a Saved link to /favourites", async ({ page }) => {
    await page.goto("/");
    const saved = page.locator('a[href="/favourites"]').first();
    await expect(saved).toBeVisible();
  });

  test("saving a provider from search shows it on the favourites page", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });

    const heart = page.locator('[data-testid="favourite-button"]').first();
    await expect(heart).toBeVisible();
    await heart.click();

    // Heart should now be pressed
    await expect(heart).toHaveAttribute("aria-pressed", "true");

    // Favourites page should now list at least one saved provider
    await page.goto("/favourites", { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toContainText(/saved/i);
    await expect(page.locator("body")).toContainText(/shortlisted on this device/i);
    const cards = page.locator('a[href^="/provider/"]');
    await expect(cards.first()).toBeVisible();
  });

  test("favourites persist across reloads and can be cleared", async ({ page }) => {
    await page.goto("/search", { waitUntil: "networkidle" });
    await page.locator('[data-testid="favourite-button"]').first().click();

    await page.goto("/favourites", { waitUntil: "networkidle" });
    await expect(page.locator("body")).toContainText(/shortlisted on this device/i);

    // Reload — still saved (localStorage)
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("body")).toContainText(/shortlisted on this device/i);

    // Clear all → empty state
    await page.getByRole("button", { name: /clear all/i }).click();
    await expect(page.locator("body")).toContainText(/no saved providers/i);
  });
});
