export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

export async function adminApi<T>(token: string, path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
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