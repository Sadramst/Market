import { Star } from "lucide-react";

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "w-3.5 h-3.5", md: "w-4 h-4", lg: "w-5 h-5" }[size];
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={sizeClass}
          style={{ color: star <= Math.round(rating) ? 'var(--brand-rose)' : 'var(--border)' }}
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          strokeWidth={star <= Math.round(rating) ? 0 : 1.5}
        />
      ))}
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center py-20">
      {icon && <div className="flex justify-center mb-4">{typeof icon === 'string' ? <span className="text-[48px]">{icon}</span> : icon}</div>}
      <h3 className="text-[20px]" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontWeight: 600 }}>{title}</h3>
      <p className="text-[14px] mt-2 max-w-md mx-auto" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>{description}</p>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="shimmer overflow-hidden" style={{ border: '1px solid var(--border)', borderRadius: '12px' }}>
          <div className="h-36" style={{ background: 'var(--bg-secondary)' }} />
          <div className="p-4 space-y-3">
            <div className="h-4 w-3/4" style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }} />
            <div className="h-3 w-1/2" style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }} />
            <div className="flex justify-between">
              <div className="h-3 w-1/4" style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }} />
              <div className="h-3 w-1/4" style={{ background: 'var(--bg-secondary)', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-[12px]" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-muted)' }}>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: 'var(--border)' }}>/</span>}
            {item.href ? (
              <a href={item.href} className="transition-colors" style={{ color: 'var(--text-muted)' }}>{item.label}</a>
            ) : (
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" }) {
  const styles: Record<string, { bg: string; color: string }> = {
    default: { bg: 'var(--bg-secondary)', color: 'var(--text-secondary)' },
    success: { bg: 'rgba(16,185,129,0.1)', color: '#059669' },
    warning: { bg: 'rgba(245,158,11,0.1)', color: '#d97706' },
    danger: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626' },
  };
  const s = styles[variant];
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium" style={{ background: s.bg, color: s.color, borderRadius: '4px' }}>
      {children}
    </span>
  );
}
