"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDate, type PaginatedData } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface Review {
  id: string;
  userName: string;
  providerName?: string;
  rating: number;
  title?: string;
  comment?: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

const FILTERS = ["all", "Pending", "Approved", "Rejected"];

export default function ReviewsPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const data = await adminApi<PaginatedData<Review>>(token, `/reviews/admin/all?page=${page}&pageSize=50${status}`);
      setReviews(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reviews");
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
      await adminApi(token, `/reviews/admin/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update review");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Review Moderation</h1>
          <p className="text-sm text-gray-400 mt-1">Approve trustworthy reviews and remove low-quality submissions.</p>
        </div>
        <span className="text-sm text-gray-400">{reviews.length} shown</span>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-3 mb-6">
        {FILTERS.map((filter) => {
          const active = statusFilter.toLowerCase() === filter.toLowerCase();
          return (
            <Link key={filter} href={`/dashboard/reviews?status=${filter.toLowerCase()}`} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}>
              {filter === "all" ? "All" : filter}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reviewer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Review</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No reviews found.</td></tr>
            ) : reviews.map((review) => (
              <tr key={review.id} className="hover:bg-gray-50/50 align-top">
                <td className="px-6 py-4 text-sm text-gray-900">
                  <p>{review.userName || "Anonymous"}</p>
                  <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{review.providerName || "-"}</td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-sm font-medium text-gray-900">{review.title || "Customer review"}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{review.comment || "No comment supplied."}</p>
                </td>
                <td className="px-6 py-4 text-sm text-amber-500 whitespace-nowrap">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[review.status] || "bg-gray-100 text-gray-600"}`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {review.status !== "Approved" && (
                      <button onClick={() => updateStatus(review.id, "Approved")} disabled={acting === review.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    {review.status !== "Rejected" && (
                      <button onClick={() => updateStatus(review.id, "Rejected")} disabled={acting === review.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50">
                        Reject
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