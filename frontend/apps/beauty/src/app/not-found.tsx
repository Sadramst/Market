export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--bg-secondary)' }}>
        <span className="text-4xl">💅</span>
      </div>
      <h1 className="mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 400 }}>
        Page Not Found
      </h1>
      <p className="max-w-md mx-auto mb-8 text-[15px] font-light" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex justify-center gap-3">
        <a href="/" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-white" style={{ background: 'var(--brand-rose)', borderRadius: '2px' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          Back to Home
        </a>
        <a href="/search" className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium" style={{ border: '1px solid var(--border)', borderRadius: '2px', color: 'var(--text-secondary)' }}>
          Browse Providers
        </a>
      </div>
    </div>
  );
}
