"use client";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mb-10" />

      <div className="flex flex-wrap gap-1.5 mb-10 p-4 bg-white rounded-2xl border border-gray-100">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="p-3 rounded-xl bg-white border border-gray-100 animate-pulse">
            <div className="h-4 w-20 bg-gray-100 rounded mb-1" />
            <div className="h-3 w-10 bg-gray-50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
