const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function fetchApi<T>(path: string, options?: { revalidate?: number; tags?: string[] }): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: options?.revalidate ?? 300, tags: options?.tags },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export function siteUrl(path: string = "") {
  return `${SITE_URL}${path}`;
}

export { API_URL, SITE_URL };
