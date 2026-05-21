import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Provider Login | Appilico Beauty",
  description: "Sign in to manage your Appilico Beauty provider profile.",
};

export default function LoginPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid gap-10 lg:grid-cols-[1fr_440px] lg:items-center">
        <section>
          <Link href="/" className="text-[13px] font-medium" style={{ color: 'var(--brand-rose)', fontFamily: 'var(--font-body)' }}>Back to marketplace</Link>
          <h1 className="mt-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: 'clamp(2.25rem, 5vw, 4.5rem)', fontWeight: 400, lineHeight: 1 }}>
            Manage your beauty profile
          </h1>
          <p className="mt-5 max-w-xl text-[16px] leading-7 font-light" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
            Keep contact details, services, claim status, and customer enquiries ready for women comparing real Perth beauty providers.
          </p>
        </section>
        <section className="p-6 sm:p-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: 'var(--shadow-sm)' }}>
          <h2 className="text-[22px] mb-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>Sign in</h2>
          <p className="mb-6 text-[14px]" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>Provider and admin accounts</p>
          <LoginForm />
        </section>
      </div>
    </div>
  );
}
