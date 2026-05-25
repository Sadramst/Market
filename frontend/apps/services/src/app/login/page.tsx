import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Appilico Services",
  description: "Sign in to your Appilico Services account to manage your IT service provider profile and enquiries.",
};

export default function LoginPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <section>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors mb-8">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to marketplace
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight leading-none mb-5">
            Manage your<br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">IT service profile</span>
          </h1>
          <p className="text-gray-500 text-[16px] leading-7 max-w-md">
            Access your provider dashboard, respond to client enquiries, manage your service listings, and track your visibility across Perth&apos;s #1 IT marketplace.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              "View and respond to client enquiries",
              "Update your services and pricing",
              "Track profile views and leads",
              "Manage your featured listing",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-[14px] text-gray-600">
                <span className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </span>
                {f}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">Sign in</h2>
          <p className="text-[13px] text-gray-500 mb-6">Provider and admin accounts</p>
          <LoginForm />
        </section>
      </div>
    </div>
  );
}
