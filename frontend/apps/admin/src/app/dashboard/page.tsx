"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, formatDateTime } from "../../lib/api";
import { useAuth } from "../../lib/auth";

interface ActivityItem {
  type: string;
  title: string;
  detail?: string;
  status?: string;
  occurredAt: string;
}

interface Stats {
  totalProviders: number;
  approvedProviders: number;
  pendingProviders: number;
  suspendedProviders: number;
  rejectedProviders: number;
  beautyProviders: number;
  itProviders: number;
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  totalEnquiries: number;
  newEnquiries: number;
  repliedEnquiries: number;
  totalReports: number;
  pendingReports: number;
  categories: number;
  suburbs: number;
  generatedAt: string;
  recentActivity: ActivityItem[];
}

const emptyStats: Stats = {
  totalProviders: 0,
  approvedProviders: 0,
  pendingProviders: 0,
  suspendedProviders: 0,
  rejectedProviders: 0,
  beautyProviders: 0,
  itProviders: 0,
  totalUsers: 0,
  activeUsers: 0,
  adminUsers: 0,
  totalReviews: 0,
  pendingReviews: 0,
  approvedReviews: 0,
  rejectedReviews: 0,
  totalEnquiries: 0,
  newEnquiries: 0,
  repliedEnquiries: 0,
  totalReports: 0,
  pendingReports: 0,
  categories: 0,
  suburbs: 0,
  generatedAt: "",
  recentActivity: [],
};

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>(emptyStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        setStats(await adminApi<Stats>(token!, "/admin/stats"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin stats");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  const statCards = [
    { label: "Providers", value: stats.totalProviders, detail: `${stats.pendingProviders} pending`, href: "/dashboard/providers?status=pending", color: "from-indigo-500 to-indigo-600" },
    { label: "Users", value: stats.totalUsers, detail: `${stats.activeUsers} active`, href: "/dashboard/users", color: "from-sky-500 to-blue-600" },
    { label: "Reviews", value: stats.totalReviews, detail: `${stats.pendingReviews} pending`, href: "/dashboard/reviews?status=pending", color: "from-amber-500 to-orange-500" },
    { label: "Enquiries", value: stats.totalEnquiries, detail: `${stats.newEnquiries} new`, href: "/dashboard/enquiries?status=new", color: "from-emerald-500 to-teal-600" },
    { label: "Reports", value: stats.totalReports, detail: `${stats.pendingReports} pending`, href: "/dashboard/reports?status=pending", color: "from-rose-500 to-red-600" },
    { label: "SEO Surface", value: stats.categories + stats.suburbs, detail: `${stats.categories} categories, ${stats.suburbs} suburbs`, href: "/dashboard/categories", color: "from-violet-500 to-purple-600" },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Operational Command Center</h1>
          <p className="text-sm text-gray-400 mt-1">Live marketplace health, moderation pressure, and growth signals.</p>
        </div>
        <p className="text-xs text-gray-400">{stats.generatedAt ? `Updated ${formatDateTime(stats.generatedAt)}` : "Loading live data"}</p>
      </div>

      {error && <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg shadow-gray-200/50 group-hover:scale-105 transition-transform`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{loading ? "..." : stat.value.toLocaleString("en-AU")}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-900">Recent Marketplace Activity</h2>
            <span className="text-xs text-gray-400">Latest provider, review, and enquiry events</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              <p className="py-10 text-center text-sm text-gray-400">Loading activity...</p>
            ) : stats.recentActivity.length === 0 ? (
              <p className="py-10 text-center text-sm text-gray-400">No recent activity yet.</p>
            ) : stats.recentActivity.map((item, index) => (
              <div key={`${item.type}-${item.occurredAt}-${index}`} className="flex items-start justify-between gap-4 rounded-xl border border-gray-100 px-4 py-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{item.type}</span>
                    {item.status && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">{item.status}</span>}
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">{item.title}</p>
                  {item.detail && <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">{item.detail}</p>}
                </div>
                <span className="whitespace-nowrap text-xs text-gray-400">{formatDateTime(item.occurredAt)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-semibold mb-4">Marketplace Mix</h2>
          <div className="space-y-4">
            <Metric label="Beauty providers" value={stats.beautyProviders} total={Math.max(1, stats.totalProviders)} />
            <Metric label="IT providers" value={stats.itProviders} total={Math.max(1, stats.totalProviders)} />
            <Metric label="Approved listings" value={stats.approvedProviders} total={Math.max(1, stats.totalProviders)} />
            <Metric label="Pending reviews" value={stats.pendingReviews} total={Math.max(1, stats.totalReviews)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, total }: { label: string; value: number; total: number }) {
  const percent = Math.min(100, Math.round((value / total) * 100));

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-300">{label}</span>
        <span className="font-semibold">{value.toLocaleString("en-AU")}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-indigo-400" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
