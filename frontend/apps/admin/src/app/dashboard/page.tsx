"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Stats {
  providers: number;
  pending: number;
  reviews: number;
  categories: number;
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({ providers: 0, pending: 0, reviews: 0, categories: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [provRes, catRes] = await Promise.all([
          fetch(`${API_URL}/providers/search?pageSize=1`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => null),
          fetch(`${API_URL}/categories/beauty`).then(r => r.json()).catch(() => null),
        ]);
        setStats({
          providers: provRes?.data?.totalCount ?? provRes?.pagination?.totalItems ?? 0,
          pending: 0,
          reviews: 0,
          categories: catRes?.data?.length ?? 0,
        });
      } catch { /* ignore */ }
      setLoaded(true);
    }
    load();
  }, [token]);

  const statCards = [
    { label: "Total Providers", value: loaded ? String(stats.providers) : "...", change: "Active listings", color: "from-indigo-500 to-indigo-600", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )},
    { label: "Beauty Categories", value: loaded ? String(stats.categories) : "...", change: "Parent + sub", color: "from-purple-500 to-violet-600", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
    )},
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-400 mt-1">Platform health at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shadow-gray-200/50 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Review Pending Providers", href: "/dashboard/providers?status=pending", icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            ), color: "bg-amber-50 text-amber-700 border-amber-100 hover:border-amber-200" },
            { label: "Moderate Reviews", href: "/dashboard/reviews?status=pending", icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            ), color: "bg-blue-50 text-blue-700 border-blue-100 hover:border-blue-200" },
            { label: "Manage Categories", href: "/dashboard/categories", icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            ), color: "bg-emerald-50 text-emerald-700 border-emerald-100 hover:border-emerald-200" },
            { label: "View Reports", href: "/dashboard/reports", icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>
            ), color: "bg-rose-50 text-rose-700 border-rose-100 hover:border-rose-200" },
          ].map((action) => (
            <a key={action.label} href={action.href} className={`flex items-center gap-3 p-4 rounded-xl border ${action.color} transition-all text-sm font-medium hover:shadow-sm`}>
              <span className="opacity-70">{action.icon}</span>
              <span>{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Activity Feed Placeholder */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <p className="text-sm text-gray-400">Activity feed will appear here as users interact with the platform.</p>
        </div>
      </div>
    </div>
  );
}
