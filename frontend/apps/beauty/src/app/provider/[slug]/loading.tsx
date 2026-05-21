export default function Loading() {
  return (
    <>
      {/* Banner skeleton */}
      <div className="h-64 animate-pulse" style={{ background: 'var(--bg-secondary)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative pb-16">
        {/* Profile header skeleton */}
        <div className="p-6 sm:p-8 animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div className="flex items-end gap-5">
            <div className="w-28 h-28 flex-shrink-0" style={{ borderRadius: '12px', background: 'var(--bg-secondary)' }} />
            <div className="flex-1 space-y-3">
              <div className="h-7 rounded w-56" style={{ background: 'var(--bg-secondary)' }} />
              <div className="h-4 rounded w-40" style={{ background: 'var(--bg-secondary)' }} />
              <div className="h-4 rounded w-32" style={{ background: 'var(--bg-secondary)' }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About skeleton */}
            <div className="p-6 animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="h-5 rounded w-20 mb-4" style={{ background: 'var(--bg-secondary)' }} />
              <div className="space-y-2">
                <div className="h-3 rounded w-full" style={{ background: 'var(--bg-secondary)' }} />
                <div className="h-3 rounded w-5/6" style={{ background: 'var(--bg-secondary)' }} />
                <div className="h-3 rounded w-4/6" style={{ background: 'var(--bg-secondary)' }} />
              </div>
            </div>

            {/* Services skeleton */}
            <div className="p-6 animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="h-5 rounded w-24 mb-4" style={{ background: 'var(--bg-secondary)' }} />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="py-4 flex justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
                  <div className="space-y-2">
                    <div className="h-4 rounded w-32" style={{ background: 'var(--bg-secondary)' }} />
                    <div className="h-3 rounded w-20" style={{ background: 'var(--bg-secondary)' }} />
                  </div>
                  <div className="h-4 rounded w-16" style={{ background: 'var(--bg-secondary)' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div>
            <div className="p-6 animate-pulse" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div className="h-5 rounded w-20 mb-4" style={{ background: 'var(--bg-secondary)' }} />
              <div className="space-y-3">
                <div className="h-4 rounded w-full" style={{ background: 'var(--bg-secondary)' }} />
                <div className="h-4 rounded w-3/4" style={{ background: 'var(--bg-secondary)' }} />
                <div className="h-4 rounded w-1/2" style={{ background: 'var(--bg-secondary)' }} />
              </div>
              <div className="h-12 rounded mt-6" style={{ background: 'var(--bg-secondary)' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
