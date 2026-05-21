export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface ProviderSummary {
  slug: string;
  businessName: string;
  tagline?: string;
  city?: string;
  averageRating: number;
  totalReviews: number;
  categories?: string[];
  isVerified?: boolean;
  hasRealData?: boolean;
}

export interface ProviderDetail extends ProviderSummary {
  description?: string;
  phone?: string;
  email?: string;
  website?: string;
  providerType?: string;
  services?: Array<{ name: string; description?: string; priceFrom?: number; durationMinutes?: number; categoryName?: string }>;
  serviceAreas?: string[];
}

export interface ProviderSearchResult {
  items: ProviderSummary[];
  pagination: { currentPage: number; totalPages: number; totalCount: number };
}

export async function fetchApi<T>(path: string, options: { revalidate?: number; tags?: string[] } = {}) {
  try {
    const response = await fetch(`${API_URL}${path}`, { next: options });
    const json = (await response.json()) as ApiEnvelope<T>;
    if (!response.ok || !json.success) {
      return null;
    }

    return json.data ?? null;
  } catch {
    return null;
  }
}

export function providerSearchPath(params: Record<string, string>) {
  const query = new URLSearchParams({ marketplaceType: "1", ...params });
  return `/providers/search?${query.toString()}`;
}
