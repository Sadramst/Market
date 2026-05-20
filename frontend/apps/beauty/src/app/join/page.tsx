import type { Metadata } from "next";
import Link from "next/link";
import { generatePageMeta } from "@/lib/seo";

export const metadata: Metadata = generatePageMeta({
  title: "List Your Beauty Business — Join Appilico",
  description: "Register your beauty salon, spa, or freelance beauty business on Perth's premier beauty marketplace. Get discovered by local customers.",
  path: "/join",
});

const benefits = [
  { icon: "📍", title: "Local Visibility", desc: "Get found by customers searching for beauty services in your suburb" },
  { icon: "⭐", title: "Build Reputation", desc: "Collect reviews and ratings to build trust with potential clients" },
  { icon: "📸", title: "Showcase Your Work", desc: "Upload gallery images to show off your best work" },
  { icon: "💬", title: "Direct Messaging", desc: "Connect directly with potential customers through our platform" },
  { icon: "📊", title: "Business Insights", desc: "Track profile views, enquiries, and performance metrics" },
  { icon: "🆓", title: "Free to Start", desc: "Create your profile and start getting discovered at no cost" },
];

export default function JoinPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 mb-4">
          List Your Beauty Business
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Join Perth&apos;s growing beauty marketplace. Create your free profile and start getting discovered by local customers.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {benefits.map((b) => (
          <div key={b.title} className="p-6 bg-white rounded-xl border border-gray-100">
            <span className="text-3xl mb-3 block">{b.icon}</span>
            <h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3>
            <p className="text-sm text-gray-500">{b.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-12">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-500 mb-6">Create your free account and set up your business profile in minutes.</p>
        {/* TODO: Wire to registration API */}
        <Link
          href="/register"
          className="inline-block px-8 py-3 bg-primary text-white rounded-full text-lg font-medium hover:bg-primary-dark transition-colors"
        >
          Create Free Account
        </Link>
        <p className="text-sm text-gray-400 mt-4">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
