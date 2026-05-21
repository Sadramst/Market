"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDate, type PaginatedData } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

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

const FILTERS = ["all", "Pending", "Approved", "Suspended", "Rejected"];

export default function ProvidersPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const data = await adminApi<PaginatedData<Provider>>(token, `/providers/admin/list?page=${page}&pageSize=20${status}`);
      setProviders(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load providers");
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    setActing(id);
    setError(null);
    try {
      await adminApi(token, `/providers/admin/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ newStatus: status, adminNotes: `${status} by admin` }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update provider");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Provider Operations</h1>
          <p className="text-sm text-gray-400 mt-1">Approve, suspend, and monitor marketplace supply.</p>
        </div>
        <span className="text-sm text-gray-400">{providers.length} shown</span>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-3 mb-6">
        {FILTERS.map((filter) => {
          const active = statusFilter.toLowerCase() === filter.toLowerCase();
          return (
            <Link
              key={filter}
              href={`/dashboard/providers?status=${filter.toLowerCase()}`}
              className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}
            >
              {filter === "all" ? "All" : filter}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Marketplace</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading providers...</td></tr>
            ) : providers.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No providers found.</td></tr>
            ) : providers.map((provider) => (
              <tr key={provider.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 text-sm">{provider.businessName}</p>
                  <p className="text-xs text-gray-400">{provider.slug} · {formatDate(provider.createdAt)}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{provider.providerType}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{provider.city || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[provider.status] || "bg-gray-100 text-gray-600"}`}>
                    {provider.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {provider.averageRating > 0 ? `${provider.averageRating.toFixed(1)} ★ (${provider.totalReviews})` : "-"}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {provider.status !== "Approved" && (
                      <button onClick={() => updateStatus(provider.id, "Approved")} disabled={acting === provider.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    {provider.status !== "Suspended" && (
                      <button onClick={() => updateStatus(provider.id, "Suspended")} disabled={acting === provider.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50">
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
          <button onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-30">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-30">Next</button>
        </div>
      )}
    </div>
  );
}