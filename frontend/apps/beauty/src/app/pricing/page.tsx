import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";
import { PLANS } from "@/lib/stripe";

export const metadata: Metadata = generatePageMeta({
  title: "Pricing — Appilico Beauty",
  description: "Choose the perfect plan for your beauty business. Start free and upgrade as you grow. Pro and Premium plans with priority placement and advanced features.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <section style={{ background: "var(--gradient-hero)", padding: "64px 24px 56px", textAlign: "center" }}>
        <p className="text-[13px] font-medium uppercase tracking-[0.15em] mb-4" style={{ fontFamily: "var(--font-body)", color: "var(--brand-rose)" }}>
          Simple Pricing
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--text-primary)", fontWeight: 400, marginBottom: 16 }}>
          Grow Your Beauty <em style={{ color: "var(--brand-rose)" }}>Business</em>
        </h1>
        <p className="text-[17px] font-light max-w-[500px] mx-auto" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
          Start free. Upgrade when you&apos;re ready. No lock-in contracts.
        </p>
      </section>

      <section style={{ padding: "56px 24px", background: "var(--bg-primary)" }}>
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative flex flex-col overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: plan.popular ? "2px solid var(--brand-rose)" : "1px solid var(--border)",
                borderRadius: 12,
                boxShadow: plan.popular ? "var(--shadow-lg)" : "var(--shadow-sm)",
              }}
            >
              {plan.popular && (
                <div className="text-center py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ background: "var(--brand-rose)", fontFamily: "var(--font-body)" }}>
                  Most Popular
                </div>
              )}

              <div style={{ padding: "32px 28px" }}>
                <h2 className="text-[1.25rem]" style={{ fontFamily: "var(--font-heading)", fontWeight: 600, color: "var(--text-primary)" }}>
                  {plan.name}
                </h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-[2.5rem]" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontWeight: 400 }}>
                    ${plan.price}
                  </span>
                  <span className="text-[14px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
                    /month
                  </span>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[14px]" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>
                      <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--brand-rose)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  {plan.id === "free" ? (
                    <Link
                      href="/join"
                      className="block w-full text-center py-3 text-[14px] font-medium transition-all"
                      style={{ border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <form action={`/api/checkout?plan=${plan.id}`} method="POST">
                      <button
                        type="submit"
                        className="block w-full text-center py-3 text-[14px] font-medium text-white transition-all"
                        style={{ background: plan.popular ? "var(--brand-rose)" : "var(--text-primary)", borderRadius: 2, fontFamily: "var(--font-body)" }}
                      >
                        {plan.cta}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-[700px] mx-auto mt-20">
          <h2 className="text-center mb-10" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 400 }}>
            Frequently Asked <em>Questions</em>
          </h2>
          {[
            { q: "Can I cancel anytime?", a: "Yes, you can cancel or downgrade your subscription at any time. No lock-in contracts, no cancellation fees." },
            { q: "Is the free plan really free?", a: "Absolutely. Your basic listing is free forever. We only charge for premium features that help you grow faster." },
            { q: "How does billing work?", a: "We use Stripe for secure payment processing. You'll be billed monthly and can manage your subscription from your dashboard." },
            { q: "What happens if I downgrade?", a: "You keep your premium features until the end of your current billing period, then revert to the free plan." },
          ].map((faq) => (
            <div key={faq.q} className="py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h3 className="text-[15px] font-medium mb-2" style={{ fontFamily: "var(--font-body)", color: "var(--text-primary)" }}>{faq.q}</h3>
              <p className="text-[14px] font-light leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--text-secondary)" }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
