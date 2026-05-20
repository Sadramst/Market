export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-rose-50 flex items-center justify-center mb-6">
        <span className="text-4xl">💅</span>
      </div>
      <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex justify-center gap-3">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Back to Home
        </a>
        <a
          href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-full font-medium hover:border-rose-200 hover:text-primary transition-all"
        >
          Browse Providers
        </a>
      </div>
    </div>
  );
}
