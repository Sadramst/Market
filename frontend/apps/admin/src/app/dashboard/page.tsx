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

      {/* Quick Actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/dashboard/providers?status=pending" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium hover:bg-indigo-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          Review pending providers
        </Link>
        <Link href="/dashboard/reviews?status=pending" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          Moderate reviews
        </Link>
        <Link href="/dashboard/imports" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
          Import providers
        </Link>
        <Link href="/dashboard/settings" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Platform settings
        </Link>
        <a href="https://beauty.appilico.com.au" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium hover:bg-rose-100 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View beauty site
        </a>
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
