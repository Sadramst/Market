"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Provider {
  id: string;
  businessName: string;
  slug: string;
  providerType: string;
  status: string;
  averageRating: number;
  totalReviews: number;
  city?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
  Rejected: "bg-gray-100 text-gray-600",
};

export default function ProvidersPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const status = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const res = await fetch(`${API_URL}/providers/search?page=${page}&pageSize=20${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const items = json.data.items ?? json.data ?? [];
        setProviders(items);
        const total = json.data.totalCount ?? json.pagination?.totalItems ?? items.length;
        setTotalPages(Math.max(1, Math.ceil(total / 20)));
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [token, page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    setActing(id);
    try {
      await fetch(`${API_URL}/providers/admin/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status, reason: `${status} by admin` }),
      });
      await load();
    } catch { /* ignore */ }
    setActing(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Provider Management</h1>
        <span className="text-sm text-gray-400">{providers.length} shown</span>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {["all", "Pending", "Approved", "Suspended", "Rejected"].map((s) => (
          <Link
            key={s}
            href={`/dashboard/providers?status=${s.toLowerCase()}`}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${statusFilter === s.toLowerCase() ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}
          >
            {s === "all" ? "All" : s}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading providers...</td></tr>
            ) : providers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No providers found.</td></tr>
            ) : providers.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 text-sm">{p.businessName}</p>
                  <p className="text-xs text-gray-400">{p.slug}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.city || "—"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[p.status] || "bg-gray-100 text-gray-600"}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {p.averageRating > 0 ? `${p.averageRating.toFixed(1)} ★ (${p.totalReviews})` : "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {p.status !== "Approved" && (
                      <button onClick={() => updateStatus(p.id, "Approved")} disabled={acting === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    {p.status !== "Suspended" && (
                      <button onClick={() => updateStatus(p.id, "Suspended")} disabled={acting === p.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50">
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-30">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}
