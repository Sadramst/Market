"use client";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-5 w-56 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="h-10 w-80 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-5 w-40 bg-gray-100 rounded animate-pulse mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-gray-100" />
            <div className="p-4">
              <div className="h-5 w-40 bg-gray-100 rounded mb-2" />
              <div className="h-4 w-24 bg-gray-50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
