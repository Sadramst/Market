"use client";
import { useCallback, useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.appilico.com.au/api";

function getSessionId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = sessionStorage.getItem("appilico_session_id");
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    sessionStorage.setItem("appilico_session_id", id);
  }
  return id;
}

export interface TrackEventPayload {
  eventType: string;
  entityType?: string;
  entitySlug?: string;
  categorySlug?: string;
  suburbSlug?: string;
  marketplaceType?: number;
  searchQuery?: string;
  referrerPage?: string;
  latitude?: number;
  longitude?: number;
}

export function useAnalytics(marketplaceType?: number) {
  const queueRef = useRef<TrackEventPayload[]>([]);

  const flush = useCallback(() => {
    if (queueRef.current.length === 0) return;
    const events = queueRef.current.splice(0);
    const sessionId = getSessionId();
    const body = events.map(e => ({ ...e, sessionId, marketplaceType: e.marketplaceType ?? marketplaceType }));
    // Use sendBeacon for unload events, fetch for regular
    const payload = JSON.stringify(body);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${API_URL}/analytics/batch`, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(`${API_URL}/analytics/batch`, { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [marketplaceType]);

  const track = useCallback((payload: TrackEventPayload) => {
    if (typeof window === "undefined") return;
    const sessionId = getSessionId();
    const body = { ...payload, sessionId, marketplaceType: payload.marketplaceType ?? marketplaceType };
    fetch(`${API_URL}/analytics/event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {});
  }, [marketplaceType]);

  return { track, flush };
}
