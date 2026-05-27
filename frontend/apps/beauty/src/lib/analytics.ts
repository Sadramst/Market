declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  // Push to GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({ event: name, ...params });
  }
  // Also fire via gtag if available
  if (window.gtag) {
    window.gtag("event", name, params);
  }
}

/** Fire a Google Ads conversion (set NEXT_PUBLIC_GADS_CONVERSION_LABEL in env) */
export function trackConversion(label?: string) {
  const conversionId = process.env.NEXT_PUBLIC_GADS_ID;
  const conversionLabel = label || process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL;
  if (typeof window !== "undefined" && window.gtag && conversionId && conversionLabel) {
    window.gtag("event", "conversion", {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }
}

export const analytics = {
  providerView: (slug: string) => trackEvent("provider_view", { provider_slug: slug }),
  searchPerformed: (category?: string, suburb?: string) => trackEvent("search_performed", { category: category || "all", suburb: suburb || "all" }),
  enquirySubmitted: (providerSlug: string) => trackEvent("enquiry_submitted", { provider_slug: providerSlug }),
  reviewSubmitted: (providerSlug: string) => trackEvent("review_submitted", { provider_slug: providerSlug }),
  joinStepCompleted: (step: number) => trackEvent("join_step_completed", { step }),
  joinSubmitted: () => trackEvent("join_submitted"),
  categoryClicked: (slug: string) => trackEvent("category_clicked", { category_slug: slug }),
  suburbClicked: (slug: string) => trackEvent("suburb_clicked", { suburb_slug: slug }),
};
