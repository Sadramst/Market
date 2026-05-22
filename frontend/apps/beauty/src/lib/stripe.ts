import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "month" as const,
    features: [
      "Basic business listing",
      "Up to 5 gallery photos",
      "Appear in search results",
      "Customer enquiry form",
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    interval: "month" as const,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Everything in Free",
      "Featured in category pages",
      "Unlimited gallery photos",
      "Priority in search results",
      "Business insights dashboard",
      "Instagram feed integration",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 59,
    interval: "month" as const,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      "Everything in Pro",
      "Homepage featured placement",
      "Verified badge",
      "Priority customer support",
      "Custom profile URL",
      "Monthly performance report",
    ],
    cta: "Go Premium",
    popular: false,
  },
] as const;
