import { describe, it, expect } from "vitest";
import { PERTH_SUBURBS } from "@/lib/suburbs";
import { BEAUTY_CATEGORIES } from "@/lib/categories";

describe("PERTH_SUBURBS data integrity", () => {
  it("has at least 70 suburbs", () => {
    expect(PERTH_SUBURBS.length).toBeGreaterThanOrEqual(70);
    // Exact count after Phase 4 additions
    expect(PERTH_SUBURBS.length).toBe(77);
  });

  it("all suburbs have required fields", () => {
    for (const suburb of PERTH_SUBURBS) {
      expect(suburb.name).toBeTruthy();
      expect(suburb.slug).toBeTruthy();
      expect(suburb.postCode).toBeTruthy();
      expect(suburb.slug).toMatch(/^[a-z0-9-]+$/);
      expect(suburb.postCode).toMatch(/^\d{4}$/);
    }
  });

  it("has no duplicate slugs", () => {
    const slugs = PERTH_SUBURBS.map((s) => s.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("has no duplicate names", () => {
    const names = PERTH_SUBURBS.map((s) => s.name);
    const uniqueNames = new Set(names);
    expect(names.length).toBe(uniqueNames.size);
  });

  it("includes key suburbs for real providers", () => {
    const slugs = PERTH_SUBURBS.map((s) => s.slug);
    expect(slugs).toContain("subiaco");
    expect(slugs).toContain("perth");
    expect(slugs).toContain("claremont");
    expect(slugs).toContain("fremantle");
    expect(slugs).toContain("joondalup");
    expect(slugs).toContain("mount-lawley");
    expect(slugs).toContain("east-perth");
    expect(slugs).toContain("cockburn-central");
    expect(slugs).toContain("highgate");
    expect(slugs).toContain("south-perth");
  });

  it("suburbs are sorted alphabetically", () => {
    const names = PERTH_SUBURBS.map((s) => s.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});

describe("BEAUTY_CATEGORIES data integrity", () => {
  it("has at least 8 categories", () => {
    expect(BEAUTY_CATEGORIES.length).toBeGreaterThanOrEqual(8);
  });

  it("all categories have required fields", () => {
    for (const cat of BEAUTY_CATEGORIES) {
      expect(cat.name).toBeTruthy();
      expect(cat.slug).toBeTruthy();
      expect(cat.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("has no duplicate slugs", () => {
    const slugs = BEAUTY_CATEGORIES.map((c) => c.slug);
    const uniqueSlugs = new Set(slugs);
    expect(slugs.length).toBe(uniqueSlugs.size);
  });

  it("includes core beauty categories", () => {
    const slugs = BEAUTY_CATEGORIES.map((c) => c.slug);
    expect(slugs).toContain("nails");
    expect(slugs).toContain("hair");
    expect(slugs).toContain("lashes");
    expect(slugs).toContain("brows");
    expect(slugs).toContain("skin-care");
    expect(slugs).toContain("makeup");
  });
});
