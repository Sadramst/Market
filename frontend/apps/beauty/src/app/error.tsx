"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="text-6xl mb-4 block">😔</span>
      <h1 className="text-[24px] mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>Something went wrong</h1>
      <p className="text-[15px] font-light mb-6" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
        We hit an unexpected error. Please try again or go back to the homepage.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 text-[14px] font-medium text-white transition-all"
          style={{ background: 'var(--brand-rose)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 text-[14px] font-medium transition-all"
          style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)', borderRadius: '2px', fontFamily: 'var(--font-body)' }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
