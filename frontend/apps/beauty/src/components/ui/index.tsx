export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClass = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" }[size];
  return (
    <div className="flex items-center space-x-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${
            star <= Math.round(rating) ? "text-yellow-400" : "text-gray-200"
          } fill-current`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description: string; icon?: string }) {
  return (
    <div className="text-center py-16">
      {icon && <span className="text-5xl mb-4 block">{icon}</span>}
      <h3 className="text-lg font-semibold text-gray-900 mt-2">{title}</h3>
      <p className="text-gray-500 mt-1 max-w-md mx-auto">{description}</p>
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="aspect-[4/3] bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="flex justify-between">
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
      <ol className="flex items-center space-x-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center">
            {i > 0 && <span className="mx-2 text-gray-300">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-primary transition-colors">{item.label}</a>
            ) : (
              <span className="text-gray-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "danger" }) {
  const colors = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}
