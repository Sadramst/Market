const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const REQUEST_TIMEOUT_MS = 10000;
const NETWORK_RETRY_COUNT = 1;

function withTimeout(timeoutMs: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return {
    signal: controller.signal,
    clear: () => clearTimeout(timeoutId),
  };
}

function isRetryableError(error: unknown) {
  if (!(error instanceof Error)) return false;
  return error.name === "AbortError" || error.name === "TypeError";
}

export async function fetchApi<T>(path: string, options?: { revalidate?: number; tags?: string[] }): Promise<T | null> {
  let attempt = 0;

  while (attempt <= NETWORK_RETRY_COUNT) {
    const timeout = withTimeout(REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_URL}${path}`, {
        next: { revalidate: options?.revalidate ?? 300, tags: options?.tags },
        signal: timeout.signal,
      });

      if (!res.ok) {
        console.error(`API request failed: ${path} returned ${res.status}`);
        return null;
      }

      const json = await res.json();
      if (!json.success) {
        console.error(`API request failed: ${path} returned unsuccessful payload`);
        return null;
      }

      return json.data;
    } catch (error) {
      if (attempt >= NETWORK_RETRY_COUNT || !isRetryableError(error)) {
        console.error(`API request error for ${path}:`, error);
        return null;
      }
    } finally {
      timeout.clear();
    }

    attempt += 1;
  }

  return null;
}

export function siteUrl(path: string = "") {
  return `${SITE_URL}${path}`;
}

export { API_URL, SITE_URL };
