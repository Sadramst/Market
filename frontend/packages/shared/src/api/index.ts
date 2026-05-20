import type { ApiResponse } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
  revalidate?: number | false;
  tags?: string[];
};

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = "GET", body, headers = {}, token, revalidate, tags } = options;

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Next.js ISR/SSR cache options
  if (method === "GET") {
    if (revalidate !== undefined) {
      (config as Record<string, unknown>).next = { revalidate, ...(tags ? { tags } : {}) };
    } else if (tags) {
      (config as Record<string, unknown>).next = { tags };
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return errorData ?? {
        success: false,
        message: `Request failed with status ${response.status}`,
        errors: [],
        timestamp: new Date().toISOString(),
      };
    }
    return await response.json();
  } catch {
    return {
      success: false,
      message: "Network error — unable to reach server",
      errors: ["NETWORK_ERROR"],
      timestamp: new Date().toISOString(),
    };
  }
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  token: string
): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return response.json();
}

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    apiClient("/auth/login", { method: "POST", body: { email, password } }),
  register: (data: { firstName: string; lastName: string; email: string; password: string; confirmPassword: string }) =>
    apiClient("/auth/register", { method: "POST", body: data }),
  refresh: (refreshToken: string) =>
    apiClient("/auth/refresh", { method: "POST", body: { refreshToken } }),
  getProfile: (token: string) =>
    apiClient("/auth/me", { token }),
  updateProfile: (token: string, data: Record<string, unknown>) =>
    apiClient("/auth/me", { method: "PUT", body: data, token }),
};

// Providers API
export const providersApi = {
  search: (params: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) query.append(key, String(value));
    });
    return apiClient(`/providers/search?${query.toString()}`);
  },
  getBySlug: (slug: string) => apiClient(`/providers/${slug}`),
  getById: (id: string) => apiClient(`/providers/id/${id}`),
  create: (data: Record<string, unknown>, token: string) =>
    apiClient("/providers", { method: "POST", body: data, token }),
  update: (id: string, data: Record<string, unknown>, token: string) =>
    apiClient(`/providers/${id}`, { method: "PUT", body: data, token }),
};

// Categories API
export const categoriesApi = {
  getBeauty: () => apiClient("/categories/beauty"),
  getIT: () => apiClient("/categories/it"),
  getBySlug: (slug: string) => apiClient(`/categories/${slug}`),
};

// Reviews API
export const reviewsApi = {
  getByProvider: (providerId: string, page = 1, pageSize = 10) =>
    apiClient(`/reviews/provider/${providerId}?page=${page}&pageSize=${pageSize}`),
  create: (data: Record<string, unknown>, token: string) =>
    apiClient("/reviews", { method: "POST", body: data, token }),
};

// Locations API
export const locationsApi = {
  searchSuburbs: (search?: string) =>
    apiClient(`/locations/suburbs${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  getSuburbBySlug: (slug: string) => apiClient(`/locations/suburbs/${slug}`),
};

// Social API
export const socialApi = {
  follow: (providerId: string, token: string) =>
    apiClient(`/social/follow/${providerId}`, { method: "POST", token }),
  unfollow: (providerId: string, token: string) =>
    apiClient(`/social/follow/${providerId}`, { method: "DELETE", token }),
  favorite: (providerId: string, token: string) =>
    apiClient(`/social/favorite/${providerId}`, { method: "POST", token }),
  unfavorite: (providerId: string, token: string) =>
    apiClient(`/social/favorite/${providerId}`, { method: "DELETE", token }),
  getFollows: (token: string) => apiClient("/social/follows", { token }),
  getFavorites: (token: string) => apiClient("/social/favorites", { token }),
};
