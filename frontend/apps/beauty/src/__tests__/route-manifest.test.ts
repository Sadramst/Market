import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const appRoots = {
  beauty: path.resolve(process.cwd(), "src/app"),
  services: path.resolve(process.cwd(), "../services/src/app"),
  admin: path.resolve(process.cwd(), "../admin/src/app"),
};

const routes = {
  beauty: [
    "page.tsx",
    "search/page.tsx",
    "categories/page.tsx",
    "suburbs/page.tsx",
    "about/page.tsx",
    "contact/page.tsx",
    "privacy/page.tsx",
    "terms/page.tsx",
    "join/page.tsx",
    "login/page.tsx",
    "dashboard/page.tsx",
    "provider/[slug]/page.tsx",
    "claim/[slug]/page.tsx",
    "category/[slug]/page.tsx",
    "[suburb]/page.tsx",
    "[suburb]/[category]/page.tsx",
  ],
  services: [
    "page.tsx",
    "search/page.tsx",
    "categories/page.tsx",
    "category/[slug]/page.tsx",
    "provider/[slug]/page.tsx",
    "join/page.tsx",
  ],
  admin: [
    "page.tsx",
    "dashboard/page.tsx",
    "dashboard/providers/page.tsx",
    "dashboard/reviews/page.tsx",
    "dashboard/enquiries/page.tsx",
    "dashboard/categories/page.tsx",
    "dashboard/imports/page.tsx",
    "dashboard/users/page.tsx",
    "dashboard/reports/page.tsx",
    "dashboard/settings/page.tsx",
  ],
};

describe("route manifests", () => {
  for (const [app, appRoutes] of Object.entries(routes)) {
    it(`${app} app has page files for linked routes`, () => {
      const missing = appRoutes.filter((route) => !existsSync(path.join(appRoots[app as keyof typeof appRoots], route)));
      expect(missing).toEqual([]);
    });
  }
});
