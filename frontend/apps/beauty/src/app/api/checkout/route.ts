import { NextRequest, NextResponse } from "next/server";
import { getStripe, PLANS } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const planId = url.searchParams.get("plan");
  const providerId = url.searchParams.get("providerId");

  if (!planId) {
    return NextResponse.json({ error: "Missing plan parameter" }, { status: 400 });
  }

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan || plan.id === "free" || !("priceId" in plan) || !plan.priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe is not configured yet. Contact support." }, { status: 503 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://beauty.appilico.com.au";
  const metadata = {
    planId: plan.id,
    ...(providerId ? { providerId } : {}),
  };

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?billing=success`,
    cancel_url: `${siteUrl}/pricing?cancelled=true`,
    metadata,
    subscription_data: { metadata },
  });

  return NextResponse.redirect(session.url!, 303);
}
