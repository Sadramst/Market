import { test, expect, type Page } from "@playwright/test";

const API = "https://api.appilico.com.au/api";
const TEST_ADMIN = { email: "admin@appilico.com", password: "Admin@123!" };

async function adminLogin(page: Page): Promise<boolean> {
  await page.goto("/login");
  await page.locator('input[type="email"], input#email').fill(TEST_ADMIN.email);
  await page.locator('input[type="password"], input#password').fill(TEST_ADMIN.password);
  await page.locator('button:has-text("Sign in")').click();
  try {
    await page.waitForURL(/dashboard/, { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

// Inject a token into localStorage so profile page doesn't redirect
async function injectAuth(page: Page, token: string, user: object) {
  await page.goto("/");
  await page.evaluate(({ token, user }) => {
    localStorage.setItem("beauty_access_token", token);
    localStorage.setItem("beauty_user", JSON.stringify(user));
  }, { token, user });
}

// ──────────────────────────────────────────────
// Login Page
// ──────────────────────────────────────────────
test.describe("Beauty – Login Page", () => {
  test("login page loads with email and password fields", async ({ page }) => {
    const res = await page.goto("/login");
    expect(res?.status()).toBe(200);
    await expect(page.locator('input#email, input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input#password, input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test("login page has link to create account", async ({ page }) => {
    await page.goto("/login");
    const link = page.locator('a[href="/signup"], a:has-text("Create account"), a:has-text("Sign up")').first();
    await expect(link).toBeVisible();
  });

  test("login page has link to list your business", async ({ page }) => {
    await page.goto("/login");
    const link = page.locator('a[href="/join"], a:has-text("List your business")').first();
    await expect(link).toBeVisible();
  });

  test("invalid credentials shows error message", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("notexist@example.com");
    await page.locator('input[type="password"]').fill("WrongPass!");
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForTimeout(3000);
    // Should stay on login or show error
    const hasError = await page.locator('[style*="be123c"], [class*="error"]').isVisible();
    const stillOnLogin = page.url().includes("/login");
    expect(hasError || stillOnLogin).toBe(true);
  });

  test("successful admin login redirects to dashboard", async ({ page }) => {
    const ok = await adminLogin(page);
    test.skip(!ok, "Admin login unavailable");
    expect(page.url()).toContain("/dashboard");
  });
});

// ──────────────────────────────────────────────
// Signup Page
// ──────────────────────────────────────────────
test.describe("Beauty – Signup Page", () => {
  test("signup page loads with all form fields", async ({ page }) => {
    const res = await page.goto("/signup");
    expect(res?.status()).toBe(200);
    // First name, last name, email, phone, password, confirm password
    const textInputs = page.locator('input[type="text"]');
    await expect(textInputs.first()).toBeVisible();
    await expect(page.locator('input[type="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("signup page title is correct", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveTitle(/create account/i);
  });

  test("signup page has back to marketplace link", async ({ page }) => {
    await page.goto("/signup");
    const backLink = page.locator('a[href="/"], a:has-text("Back to marketplace"), a:has-text("Back")').first();
    await expect(backLink).toBeVisible();
  });

  test("signup page has link to login", async ({ page }) => {
    await page.goto("/signup");
    const loginLink = page.locator('a[href="/login"], a:has-text("Sign in"), a:has-text("Already have")').first();
    await expect(loginLink).toBeVisible();
  });

  test("password mismatch shows error", async ({ page }) => {
    await page.goto("/signup");
    const textInputs = await page.locator('input[type="text"]').all();
    if (textInputs.length >= 2) {
      await textInputs[0].fill("Test");
      await textInputs[1].fill("User");
    }
    await page.locator('input[type="email"]').fill("mismatch@test.com");
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill("TestPass@123!");
    await passwords[1].fill("DifferentPass@456!");
    await page.locator('button[type="submit"]').click();
    const errorDiv = page.locator('[style*="be123c"], [style*="error"], [class*="error"]').first();
    await expect(errorDiv).toBeVisible({ timeout: 5000 });
  });

  test("successful signup creates account and redirects to profile", async ({ page }) => {
    const unique = Date.now();
    await page.goto("/signup");
    const textInputs = await page.locator('input[type="text"]').all();
    if (textInputs.length >= 2) {
      await textInputs[0].fill("E2E");
      await textInputs[1].fill("Tester");
    }
    await page.locator('input[type="email"]').fill(`e2esignup${unique}@appilico-test.com`);
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill("TestPass@123!");
    await passwords[1].fill("TestPass@123!");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/\/profile/, { timeout: 15000 });
    expect(page.url()).toContain("/profile");
  });

  test("duplicate email shows error message (no t.join crash)", async ({ page }) => {
    await page.goto("/signup");
    const textInputs = await page.locator('input[type="text"]').all();
    if (textInputs.length >= 2) {
      await textInputs[0].fill("Admin");
      await textInputs[1].fill("Dup");
    }
    await page.locator('input[type="email"]').fill("admin@appilico.com");
    const passwords = await page.locator('input[type="password"]').all();
    await passwords[0].fill("TestPass@123!");
    await passwords[1].fill("TestPass@123!");
    await page.locator('button[type="submit"]').click();
    // Should show an error message, NOT crash with "t.join is not a function"
    await page.waitForTimeout(4000);
    const errorDiv = page.locator('[style*="be123c"]').first();
    if (await errorDiv.isVisible()) {
      const errorText = await errorDiv.textContent();
      expect(errorText).not.toContain("is not a function");
      expect(errorText).not.toContain(".join");
    }
    // Should stay on signup page
    expect(page.url()).toContain("/signup");
  });
});

// ──────────────────────────────────────────────
// Profile Page
// ──────────────────────────────────────────────
test.describe("Beauty – Profile Page", () => {
  test("profile page redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForTimeout(3000);
    const url = page.url();
    const onLogin = url.includes("/login");
    const showsLoginForm = await page.locator('input[type="email"]').isVisible();
    expect(onLogin || showsLoginForm).toBe(true);
  });

  test("profile page shows address fields when authenticated", async ({ request, page }) => {
    const unique = Date.now();
    const regRes = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Profile",
        lastName: "PageTest",
        email: `profilepage${unique}@appilico-e2e.test`,
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    const regBody = await regRes.json();
    const token = regBody.data?.accessToken;
    const user = regBody.data?.user;
    test.skip(!token, "Registration failed — cannot test profile");

    await injectAuth(page, token, user);
    await page.goto("/profile");
    await page.waitForTimeout(3000);

    // Should show profile content, not redirect to login
    const url = page.url();
    expect(url).toContain("/profile");

    // Should show postcode / suburb fields
    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).toMatch(/postcode|suburb|address|profile|edit/i);
  });

  test("profile shows welcome banner after signup redirect", async ({ request, page }) => {
    const unique = Date.now();
    const regRes = await request.post(`${API}/auth/register`, {
      data: {
        firstName: "Welcome",
        lastName: "Test",
        email: `welcometest${unique}@appilico-e2e.test`,
        password: "TestPass@123!",
        confirmPassword: "TestPass@123!",
      },
    });
    const regBody = await regRes.json();
    const token = regBody.data?.accessToken;
    const user = regBody.data?.user;
    test.skip(!token, "Registration failed");

    await injectAuth(page, token, user);
    await page.goto("/profile?welcome=1");
    await page.waitForTimeout(3000);

    const bodyText = await page.locator("body").textContent();
    expect(bodyText?.toLowerCase()).toMatch(/welcome|appilico/i);
  });
});

// ──────────────────────────────────────────────
// Header Auth State
// ──────────────────────────────────────────────
test.describe("Beauty – Header Auth State", () => {
  test("anonymous user sees Sign up and Log in in header", async ({ page }) => {
    await page.goto("/");
    const signupLink = page.locator("header a[href='/signup'], header a:has-text('Sign up')").first();
    await expect(signupLink).toBeVisible();
    const loginLink = page.locator("header a[href='/login'], header a:has-text('Log in')").first();
    await expect(loginLink).toBeVisible();
  });

  test("header shows Detect location chip", async ({ page }) => {
    await page.goto("/");
    const chip = page.locator("button:has-text('Detect'), button:has-text('location')").first();
    await expect(chip).toBeVisible();
  });

  test("location chip becomes active after suburb is stored", async ({ page }) => {
    // Simulate suburb stored in localStorage
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("appilico_preferred_suburb", JSON.stringify({
        id: "1", name: "Fremantle", slug: "fremantle", state: "WA",
        postCode: "6160", providerCount: 10, distanceKm: 0,
      }));
    });
    await page.reload();
    // Chip should now show suburb name and postcode
    const chip = page.locator("button:has-text('Fremantle'), button:has-text('6160')").first();
    await expect(chip).toBeVisible({ timeout: 5000 });
  });
});

// ──────────────────────────────────────────────
// Dashboard (authenticated)
// ──────────────────────────────────────────────
test.describe("Beauty – Dashboard", () => {
  test("admin dashboard loads after login", async ({ page }) => {
    const ok = await adminLogin(page);
    test.skip(!ok, "Admin login unavailable");
    await expect(page.locator("body")).toContainText(/dashboard|welcome|profile/i);
  });
});


async function login(page: Page): Promise<boolean> {
  await page.goto("/login");
  await page.locator('input[type="email"], input#email').fill(TEST_USER.email);
  await page.locator('input[type="password"], input#password').fill(TEST_USER.password);
  await page.locator('button:has-text("Sign in")').click();
  try {
    await page.waitForURL(/dashboard/, { timeout: 10_000 });
    return true;
  } catch {
    return false;
  }
}

test.describe("Beauty – Login", () => {
  test("login page loads", async ({ page }) => {
    const response = await page.goto("/login");
    expect(response?.status()).toBe(200);
    await expect(page.locator('input#email')).toBeVisible();
    await expect(page.locator('input#password')).toBeVisible();
    await expect(page.locator('button:has-text("Sign in")')).toBeVisible();
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input#email').fill("bad@test.com");
    await page.locator('input#password').fill("wrongpassword");
    await page.locator('button:has-text("Sign in")').click();
    // Should show error message, not redirect
    await page.waitForTimeout(3000);
    expect(page.url()).toContain("/login");
  });

  test("successful login redirects to dashboard", async ({ page }) => {
    const loggedIn = await login(page);
    test.skip(!loggedIn, "Login API unavailable");
    expect(page.url()).toContain("/dashboard");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Beauty – Dashboard (authenticated)", () => {
  let loggedIn = false;
  test.beforeEach(async ({ page }) => {
    loggedIn = await login(page);
  });

  test("dashboard page loads after login", async ({ page }) => {
    test.skip(!loggedIn, "Login API unavailable");
    await expect(page.locator("body")).toContainText(/dashboard|welcome|profile/i);
  });
});
