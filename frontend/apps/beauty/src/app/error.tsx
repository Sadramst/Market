"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="text-6xl mb-4 block">😔</span>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 mb-6">
        We hit an unexpected error. Please try again or go back to the homepage.
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-colors"
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-6 py-3 border border-gray-200 text-gray-700 rounded-full font-medium hover:border-rose-200 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
