"use client";

import { useEffect, useState } from "react";

interface LiveStats {
  activeUsers: number;
  todayVisits: number;
  topPages: Array<{ path: string; views: number }>;
  lastUpdated: string;
}

export default function LiveVisitorsCard() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchStats() {
    setLoading(true);
    try {
      // TODO: Replace with real API endpoint for analytics
      const res = await fetch("/api/admin/live-analytics");
      if (!res.ok) throw new Error("Failed to fetch live stats");
      setStats(await res.json());
    } catch (e) {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 p-6 shadow-sm flex flex-col min-w-[260px]">
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </span>
        <div>
          <div className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">Live Visitors</div>
          <div className="text-2xl font-bold text-gray-900">
            {loading ? "..." : stats?.activeUsers ?? 0}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 mb-2">Currently on site</div>
      <div className="flex gap-6 text-xs text-gray-700 mb-2">
        <div>
          <span className="font-bold text-lg">{loading ? "..." : stats?.todayVisits ?? 0}</span>
          <span className="ml-1">today</span>
        </div>
        <div>
          <span className="font-bold text-lg">{loading ? "..." : stats?.topPages?.[0]?.views ?? 0}</span>
          <span className="ml-1">top page</span>
        </div>
      </div>
      <div className="mt-2">
        <div className="text-xs text-gray-400 mb-1">Top Pages</div>
        <ul className="space-y-1">
          {stats?.topPages?.slice(0, 3).map((p) => (
            <li key={p.path} className="flex justify-between text-xs">
              <span className="truncate max-w-[120px]">{p.path}</span>
              <span className="font-medium text-gray-700">{p.views}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-[10px] text-gray-300 mt-3">{stats?.lastUpdated ? `Updated ${stats.lastUpdated}` : ""}</div>
    </div>
  );
}
