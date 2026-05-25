import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: 1,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    viewport: { width: 1440, height: 900 },
  },
  projects: [
    {
      name: "beauty",
      testDir: "./e2e/beauty",
      use: { baseURL: "https://beauty.appilico.com.au" },
    },
    {
      name: "services",
      testDir: "./e2e/services",
      use: { baseURL: "https://service.appilico.com.au" },
    },
    {
      name: "admin",
      testDir: "./e2e/admin",
      use: { baseURL: "https://admin.appilico.com.au" },
    },
    {
      name: "agent",
      testDir: "./e2e/agent",
      use: { baseURL: "https://beauty.appilico.com.au" },
      timeout: 60_000,
    },
  ],
});
