import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

type StripeSubscriptionWithPeriod = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
  canceled_at?: number | null;
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription && session.metadata?.providerId) {
        const subscription = await getStripe().subscriptions.retrieve(String(session.subscription));
        await syncSubscription(subscription, session.metadata.providerId, session.metadata.planId);
      }
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const providerId = subscription.metadata?.providerId;
      if (providerId) await syncSubscription(subscription, providerId, subscription.metadata?.planId);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const providerId = subscription.metadata?.providerId;
      if (providerId) await syncSubscription(subscription, providerId, subscription.metadata?.planId);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("[Stripe] Payment failed:", invoice.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

async function syncSubscription(subscription: Stripe.Subscription, providerId: string, planId?: string) {
  const webhookSecret = process.env.BILLING_WEBHOOK_SECRET;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!webhookSecret || !apiUrl) return;

  const typedSubscription = subscription as StripeSubscriptionWithPeriod;
  const priceId = subscription.items.data[0]?.price.id;
  const payload = {
    providerId,
    plan: planId === "premium" ? "Premium" : planId === "pro" ? "Pro" : "Free",
    status: mapSubscriptionStatus(subscription.status),
    stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    currentPeriodStart: toIsoDate(typedSubscription.current_period_start),
    currentPeriodEnd: toIsoDate(typedSubscription.current_period_end),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    cancelledAt: toIsoDate(typedSubscription.canceled_at ?? undefined),
  };

  await fetch(`${apiUrl}/billing/stripe/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Appilico-Webhook-Secret": webhookSecret,
    },
    body: JSON.stringify(payload),
  });
}

function mapSubscriptionStatus(status: Stripe.Subscription.Status) {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trialing";
    case "past_due":
      return "PastDue";
    case "unpaid":
      return "Unpaid";
    case "canceled":
      return "Cancelled";
    case "paused":
      return "Paused";
    default:
      return "Incomplete";
  }
}

function toIsoDate(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : undefined;
}
