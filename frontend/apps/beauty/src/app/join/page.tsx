import type { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { JoinForm } from "./JoinForm";

export const metadata: Metadata = generatePageMeta({
  title: "List Your Beauty Business — Join Appilico",
  description: "Register your beauty salon, spa, or freelance beauty business on Perth's premier beauty marketplace. Get discovered by local customers.",
  path: "/join",
});

const benefits = [
  { icon: "📍", title: "Local Visibility", desc: "Appear in suburb-specific search results so nearby customers find you first" },
  { icon: "⭐", title: "Build Reputation", desc: "Collect verified reviews and ratings that build trust with potential clients" },
  { icon: "📸", title: "Showcase Your Work", desc: "Upload portfolio galleries to show off your best transformations" },
  { icon: "💬", title: "Direct Connection", desc: "Customers contact you directly — no middleman, no commission" },
  { icon: "📊", title: "Business Insights", desc: "Track profile views, search appearances, and customer enquiries" },
  { icon: "🆓", title: "Free Forever Plan", desc: "Your basic listing is always free. Premium features coming soon." },
];

export default function JoinPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream via-white to-white" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 15% 85%, rgba(212,98,122,0.06) 0%, transparent 50%), radial-gradient(circle at 85% 15%, rgba(196,154,108,0.06) 0%, transparent 50%)" }} />

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-[13px] text-gray-500 mb-8 shadow-sm">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-soft" />
              Join Perth&apos;s Fastest-Growing Beauty Platform
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 leading-[1.1]">
              List Your Beauty<br />
              <span className="gradient-text">Business for Free</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Create your free profile, showcase your work, and get discovered by thousands of Perth locals.
            </p>
          </div>

          {/* Registration Form */}
          <JoinForm />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="max-w-5xl mx-auto px-4 py-24">
        <div className="text-center mb-14">
          <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.2em]">Why Appilico</span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">Everything you need to grow</h2>
          <p className="text-gray-400 mt-2 text-[15px]">Built specifically for Perth beauty professionals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div key={b.title} className="premium-card p-7 bg-white rounded-2xl border border-gray-100/80 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush to-primary-light/50 flex items-center justify-center mb-4">
                <span className="text-2xl">{b.icon}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-[13px] text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
