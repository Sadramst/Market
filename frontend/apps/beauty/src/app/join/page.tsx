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
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/80 to-white" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,120,138,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,165,116,0.08) 0%, transparent 50%)" }} />

        <div className="relative max-w-5xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full text-sm text-rose-600 mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Join Perth&apos;s Fastest-Growing Beauty Platform
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4 leading-[1.1]">
              List Your Beauty<br />
              <span className="gradient-text">Business for Free</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Create your free profile, showcase your work, and get discovered by thousands of Perth locals.
            </p>
          </div>

          {/* Registration Form */}
          <JoinForm />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-wide uppercase mb-2">Why Appilico</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900">Everything You Need to Grow</h2>
          <p className="text-gray-400 mt-3 max-w-lg mx-auto">Built specifically for Perth beauty professionals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div key={b.title} className="premium-card p-6 bg-white rounded-2xl border border-gray-100 hover:border-rose-200 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <span className="text-3xl mb-4 block">{b.icon}</span>
              <h3 className="font-semibold text-gray-900 mb-2">{b.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
