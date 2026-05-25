import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Appilico Beauty",
  description: "Join Appilico Beauty to save your favourite providers, get personalised recommendations and book Perth's best beauty professionals.",
};

export default function SignupPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_460px] lg:items-center">
        {/* Left — value prop */}
        <section>
          <Link href="/" className="text-[13px] font-medium" style={{ color: "var(--brand-rose)", fontFamily: "var(--font-body)" }}>
            ← Back to marketplace
          </Link>
          <h1
            className="mt-6"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)", fontSize: "clamp(2.25rem, 5vw, 4rem)", fontWeight: 400, lineHeight: 1 }}
          >
            Join Perth&apos;s<br />
            <em style={{ color: "var(--brand-rose)" }}>Beauty</em> Community
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-7 font-light" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
            Create a free account to discover providers near you, save favourites, and get tailored beauty recommendations for Perth.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "📍 Set your suburb and see nearby providers first",
              "❤️  Save favourite salons and studios",
              "🔔 Get notified when providers in your area join",
              "⭐  Leave reviews and help the community",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px]" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Right — form */}
        <section
          className="p-6 sm:p-8"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-sm)" }}
        >
          <h2 className="text-[22px] mb-1" style={{ fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
            Create your account
          </h2>
          <p className="mb-6 text-[14px]" style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
            Free forever. No credit card needed.
          </p>
          <SignupForm />
        </section>
      </div>
    </div>
  );
}
