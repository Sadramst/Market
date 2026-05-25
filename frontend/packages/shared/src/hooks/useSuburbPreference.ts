"use client";
import { useState, useEffect, useCallback } from "react";

export interface NearestSuburb {
  id: string;
  name: string;
  slug: string;
  state: string;
  postCode: string;
  providerCount: number;
  distanceKm: number;
}

const STORAGE_KEY = "appilico_preferred_suburb";

export function useSuburbPreference() {
  const [suburb, setSuburbState] = useState<NearestSuburb | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load persisted suburb on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSuburbState(JSON.parse(stored) as NearestSuburb);
    } catch {
      // ignore parse errors
    }
  }, []);

  const setSuburb = useCallback((s: NearestSuburb | null) => {
    setSuburbState(s);
    if (typeof window !== "undefined") {
      if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
      else localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const detectLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    setDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.appilico.com.au/api";
          const res = await fetch(`${apiUrl}/locations/suburbs/nearest?lat=${latitude}&lng=${longitude}`);
          const json = await res.json();
          if (json?.success && json?.data) {
            setSuburb(json.data as NearestSuburb);
          } else {
            setError("Could not find your suburb");
          }
        } catch {
          setError("Failed to detect location");
        } finally {
          setDetecting(false);
        }
      },
      (err) => {
        setDetecting(false);
        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission denied");
        } else {
          setError("Could not get location");
        }
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  }, [setSuburb]);

  return { suburb, setSuburb, detectLocation, detecting, error };
}
