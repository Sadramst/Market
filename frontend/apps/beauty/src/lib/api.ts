const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export async function fetchApi<T>(path: string, options?: { revalidate?: number; tags?: string[] }): Promise<T | null> {
  const url = `${API_URL}${path}`;
  try {
    const res = await fetch(url, {
      next: { revalidate: options?.revalidate ?? 300, tags: options?.tags },
    });
    if (!res.ok) {
      console.error(`[fetchApi] ${url} → ${res.status} ${res.statusText}`);
      return null;
    }
    const json = await res.json();
    if (!json.success) {
      console.error(`[fetchApi] ${url} → success=false`, json.message);
    }
    return json.success ? json.data : null;
  } catch (err) {
    console.error(`[fetchApi] ${url} → exception:`, err);
    return null;
  }
}

export function siteUrl(path: string = "") {
  return `${SITE_URL}${path}`;
}

export { API_URL, SITE_URL };
