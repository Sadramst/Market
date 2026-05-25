"use client";

import { useEffect } from "react";
import { useAnalytics } from "@appilico/shared/hooks";

interface Props {
  providerSlug: string;
  categorySlug?: string;
  suburbSlug?: string;
}

/**
 * Client-only component that fires a "view_provider" analytics event on mount.
 * Rendered inside server-side provider pages.
 */
export function ProviderViewTracker({ providerSlug, categorySlug, suburbSlug }: Props) {
  const { track } = useAnalytics(0); // 0 = Beauty marketplace

  useEffect(() => {
    track({
      eventType: "view_provider",
      entityType: "provider",
      entitySlug: providerSlug,
      categorySlug,
      suburbSlug,
      referrerPage: typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSlug]);

  return null;
}
