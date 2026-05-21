declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
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
