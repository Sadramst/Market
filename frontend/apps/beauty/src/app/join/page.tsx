import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";

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

const steps = [
  { num: "1", title: "Create Account", desc: "Sign up with your email in under 30 seconds" },
  { num: "2", title: "Build Your Profile", desc: "Add your business info, services, and gallery photos" },
  { num: "3", title: "Get Discovered", desc: "Start appearing in search results and attracting clients" },
];

export default function JoinPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50/80 to-white" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(232,120,138,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,165,116,0.08) 0%, transparent 50%)" }} />

        <div className="relative max-w-5xl mx-auto px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-full text-sm text-rose-600 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Join Perth&apos;s Fastest-Growing Beauty Platform
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-bold text-gray-900 mb-6 leading-[1.1]">
            Grow Your Beauty<br />
            <span className="gradient-text">Business Online</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create your free profile, showcase your work, and get discovered by thousands of Perth locals searching for beauty services every day.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            >
              Create Free Account
            </Link>
            <Link
              href="#benefits"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-200 text-gray-600 rounded-full text-lg font-medium hover:border-rose-200 hover:text-primary transition-colors"
            >
              Learn More
            </Link>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            No credit card required · Free forever plan · Set up in 5 minutes
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="relative -mt-6 z-10 max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/80 border border-gray-50 p-8">
          <h2 className="text-center text-sm font-semibold text-primary tracking-wide uppercase mb-6">Three Simple Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center relative">
                {i < steps.length - 1 && (
                  <div className="hidden sm:block absolute top-5 left-[60%] w-[80%] h-px border-t-2 border-dashed border-rose-100" />
                )}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-sm mb-3">
                  {s.num}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
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

      {/* Final CTA */}
      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 p-10 sm:p-16 text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(232,120,138,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(212,165,116,0.3) 0%, transparent 50%)" }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join hundreds of Perth beauty professionals already growing their business with Appilico.</p>
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full text-lg font-semibold hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Create Free Account
            </Link>
            <p className="text-sm text-gray-500 mt-6">
              Already have an account? <Link href="/login" className="text-rose-400 hover:text-rose-300 underline underline-offset-2">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
