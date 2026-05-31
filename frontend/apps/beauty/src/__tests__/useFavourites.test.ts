import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useFavourites, readFavourites } from "@appilico/shared/hooks";

const SAMPLE = {
  slug: "glow-beauty-perth",
  businessName: "Glow Beauty Perth",
  city: "Perth",
  categories: ["nails"],
  averageRating: 4.8,
  totalReviews: 24,
};

const SAMPLE_2 = {
  slug: "lush-lashes-subiaco",
  businessName: "Lush Lashes Subiaco",
  city: "Subiaco",
  categories: ["lashes"],
};

describe("useFavourites", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  afterEach(() => {
    window.localStorage.clear();
  });

  it("starts empty", () => {
    const { result } = renderHook(() => useFavourites());
    expect(result.current.count).toBe(0);
    expect(result.current.favourites).toEqual([]);
  });

  it("adds a provider and persists it to localStorage", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.addFavourite(SAMPLE));
    expect(result.current.count).toBe(1);
    expect(result.current.isFavourite(SAMPLE.slug)).toBe(true);
    expect(readFavourites()[0].slug).toBe(SAMPLE.slug);
    expect(typeof readFavourites()[0].savedAt).toBe("number");
  });

  it("does not add the same provider twice", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.addFavourite(SAMPLE));
    act(() => result.current.addFavourite(SAMPLE));
    expect(result.current.count).toBe(1);
  });

  it("toggles a provider on and off", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.toggleFavourite(SAMPLE));
    expect(result.current.isFavourite(SAMPLE.slug)).toBe(true);
    act(() => result.current.toggleFavourite(SAMPLE));
    expect(result.current.isFavourite(SAMPLE.slug)).toBe(false);
    expect(result.current.count).toBe(0);
  });

  it("removes a specific provider", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.addFavourite(SAMPLE));
    act(() => result.current.addFavourite(SAMPLE_2));
    expect(result.current.count).toBe(2);
    act(() => result.current.removeFavourite(SAMPLE.slug));
    expect(result.current.count).toBe(1);
    expect(result.current.isFavourite(SAMPLE.slug)).toBe(false);
    expect(result.current.isFavourite(SAMPLE_2.slug)).toBe(true);
  });

  it("clears all favourites", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.addFavourite(SAMPLE));
    act(() => result.current.addFavourite(SAMPLE_2));
    act(() => result.current.clearFavourites());
    expect(result.current.count).toBe(0);
    expect(readFavourites()).toEqual([]);
  });

  it("newest favourite appears first", () => {
    const { result } = renderHook(() => useFavourites());
    act(() => result.current.addFavourite(SAMPLE));
    act(() => result.current.addFavourite(SAMPLE_2));
    expect(result.current.favourites[0].slug).toBe(SAMPLE_2.slug);
  });

  it("keeps multiple hook instances in sync", () => {
    const a = renderHook(() => useFavourites());
    const b = renderHook(() => useFavourites());
    act(() => a.result.current.addFavourite(SAMPLE));
    expect(b.result.current.isFavourite(SAMPLE.slug)).toBe(true);
  });

  it("ignores corrupted localStorage data", () => {
    window.localStorage.setItem("appilico_favourites", "not-json{");
    expect(readFavourites()).toEqual([]);
    const { result } = renderHook(() => useFavourites());
    expect(result.current.count).toBe(0);
  });
});
