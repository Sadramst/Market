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
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  tagline?: string;
  isFeatured: boolean;
  isVerified: boolean;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Suspended: "bg-red-100 text-red-700",
  Rejected: "bg-gray-100 text-gray-600",
};

const FILTERS = ["all", "Pending", "Approved", "Suspended", "Rejected"];
const MARKETPLACE_TABS = [
  { label: "Beauty & Wellness", value: 0 },
  { label: "IT Services", value: 1 },
];

export default function ProvidersPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [marketplace, setMarketplace] = useState(0);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editForm, setEditForm] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const data = await adminApi<PaginatedData<Provider>>(token, `/providers/admin/list?page=${page}&pageSize=20${status}&marketplaceType=${marketplace}`);
      setProviders(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setTotalCount(data.pagination?.totalCount ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load providers");
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter, marketplace]);

  useEffect(() => { setPage(1); }, [statusFilter, marketplace]);
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

  async function toggleFeatured(id: string, current: boolean) {
    if (!token) return;
    setActing(id);
    setError(null);
    try {
      await adminApi(token, `/providers/admin/${id}/promote`, {
        method: "PUT",
        body: JSON.stringify({ isFeatured: !current }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to promote provider");
    } finally {
      setActing(null);
    }
  }

  function startEdit(provider: Provider) {
    setEditingProvider(provider);
    setEditForm({
      businessName: provider.businessName,
      description: provider.description || "",
      phone: provider.phone || "",
      email: provider.email || "",
      website: provider.website || "",
      city: provider.city || "",
      tagline: provider.tagline || "",
    });
  }

  async function saveEdit() {
    if (!token || !editingProvider) return;
    setActing(editingProvider.id);
    setError(null);
    try {
      await adminApi(token, `/providers/admin/${editingProvider.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      setEditingProvider(null);
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
          <p className="text-sm text-gray-400 mt-1">Approve, suspend, edit, and promote providers.</p>
        </div>
        <span className="text-sm text-gray-400">{totalCount} total</span>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {/* Marketplace Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit">
        {MARKETPLACE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setMarketplace(tab.value)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${marketplace === tab.value ? "bg-white text-indigo-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Filters */}
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

      {/* Edit Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-bold mb-4">Edit Provider</h2>
            <div className="space-y-3">
              {(["businessName", "tagline", "phone", "email", "website", "city"] as const).map((field) => (
                <div key={field}>
                  <label className="text-xs font-medium text-gray-500 uppercase">{field.replace(/([A-Z])/g, " $1")}</label>
                  <input
                    className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    value={editForm[field] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                  rows={3}
                  value={editForm.description || ""}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditingProvider(null)} className="px-4 py-2 text-sm text-gray-600 border rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} disabled={acting === editingProvider.id} className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Featured</th>
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
                <td className="px-6 py-4 text-sm text-gray-600">{provider.city || "-"}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[provider.status] || "bg-gray-100 text-gray-600"}`}>
                    {provider.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {provider.averageRating > 0 ? `${provider.averageRating.toFixed(1)} ★ (${provider.totalReviews})` : "-"}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleFeatured(provider.id, provider.isFeatured)}
                    disabled={acting === provider.id}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${provider.isFeatured ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-400 hover:bg-gray-200"}`}
                  >
                    {provider.isFeatured ? "★ Featured" : "☆ Promote"}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => startEdit(provider)} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
                      Edit
                    </button>
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