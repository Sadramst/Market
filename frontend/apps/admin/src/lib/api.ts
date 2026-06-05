const LOCAL_API_URL = "http://localhost:5000/api";
const PRODUCTION_API_URL = "https://api.appilico.com.au/api";

/**
 * Resolve the API base URL at call time.
 *
 * Precedence:
 *  1. NEXT_PUBLIC_API_URL — set via Vercel env vars or .env.local.
 *  2. Hostname fallback — so the admin panel keeps working in production
 *     even when the env var was never configured: localhost serves the local
 *     API, any other host serves the production API. This is what prevents the
 *     "Network error — unable to reach server" login failure when the Vercel
 *     env var is missing.
 */
export function resolveApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return LOCAL_API_URL;
    return PRODUCTION_API_URL;
  }

  return LOCAL_API_URL;
}

export const API_URL = resolveApiBaseUrl();

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

/** Fetch an admin endpoint that returns raw JSON (not wrapped in ApiEnvelope). */
export async function adminApiFetch<T>(token: string, path: string): Promise<T | null> {
  try {
    const res = await fetch(`${resolveApiBaseUrl()}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function adminApi<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${resolveApiBaseUrl()}${path}`, { ...init, headers });
  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok || !json?.success) {
    throw new Error(json?.message || "Admin API request failed");
  }

  return json.data as T;
}

export function formatDate(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-AU", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function formatDateTime(value?: string) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}