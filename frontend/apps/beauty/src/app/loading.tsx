export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 rounded w-1/3" style={{ background: 'var(--bg-secondary)' }} />
        <div className="h-4 rounded w-1/2" style={{ background: 'var(--bg-secondary)' }} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <div className="h-36" style={{ background: 'var(--bg-secondary)' }} />
              <div className="p-4 space-y-3">
                <div className="h-4 rounded w-3/4" style={{ background: 'var(--bg-secondary)' }} />
                <div className="h-3 rounded w-1/2" style={{ background: 'var(--bg-secondary)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
