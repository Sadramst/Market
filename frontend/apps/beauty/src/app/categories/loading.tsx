"use client";

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="h-5 w-48 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="h-10 w-72 bg-gray-100 rounded animate-pulse mb-2" />
      <div className="h-5 w-96 bg-gray-100 rounded animate-pulse mb-10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 shrink-0" />
              <div className="flex-1">
                <div className="h-5 w-24 bg-gray-100 rounded mb-2" />
                <div className="h-4 w-full bg-gray-50 rounded mb-1" />
                <div className="h-4 w-3/4 bg-gray-50 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
