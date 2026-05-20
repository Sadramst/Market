"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <span className="text-5xl block mb-4">😔</span>
      <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-400 mb-6 max-w-md mx-auto">We couldn&apos;t load this page. Please try again.</p>
      <button onClick={reset} className="px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors">
        Try Again
      </button>
    </div>
  );
}
