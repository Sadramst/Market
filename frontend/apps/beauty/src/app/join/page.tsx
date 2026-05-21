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
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-dark)' }}>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <p className="text-[12px] font-medium uppercase tracking-[0.15em] mb-4" style={{ fontFamily: 'var(--font-body)', color: 'var(--brand-gold)' }}>
              Join Perth&apos;s Fastest-Growing Beauty Platform
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-on-dark)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.1 }}>
              List Your Beauty<br /><em style={{ color: 'var(--brand-rose)' }}>Business for Free</em>
            </h1>
            <p className="text-[17px] font-light max-w-2xl mx-auto mt-4 leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'rgba(250,247,244,0.7)' }}>
              Create your free profile, showcase your work, and get discovered by thousands of Perth locals.
            </p>
          </div>

          {/* Registration Form */}
          <JoinForm />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="text-center mb-12">
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 400 }}>
            Everything You Need to <em>Grow</em>
          </h2>
          <p className="text-[15px] font-light mt-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>Built specifically for Perth beauty professionals</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <div key={b.title} className="premium-card p-7 animate-fade-in-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', animationDelay: `${i * 0.05}s` }}>
              <span className="text-[32px] block mb-4">{b.icon}</span>
              <h3 className="text-[15px] font-medium mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-primary)' }}>{b.title}</h3>
              <p className="text-[13px] font-light leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
