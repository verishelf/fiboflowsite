type AnalyticsEvent =
  | "page_view"
  | "membership_cta_click"
  | "application_start"
  | "application_complete"
  | "membership_selection"
  | "rally_registration"
  | "sponsor_inquiry"
  | "partner_inquiry"
  | "newsletter_subscribe";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId && window.gtag) {
    window.gtag("event", event, properties);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, properties);
  }
}

export function trackPageView(path: string) {
  trackEvent("page_view", { path });
}
