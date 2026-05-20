"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../../lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Review {
  id: string;
  userName: string;
  providerName?: string;
  rating: number;
  title: string;
  comment: string;
  status: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Try admin endpoint first, fall back to provider-level
      const res = await fetch(`${API_URL}/reviews?page=1&pageSize=50`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success && json.data) {
        const items = json.data.items ?? json.data ?? [];
        setReviews(items);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, status: string) {
    if (!token) return;
    setActing(id);
    try {
      await fetch(`${API_URL}/reviews/admin/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      await load();
    } catch { /* ignore */ }
    setActing(null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Review Moderation</h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reviewer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Review</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading reviews...</td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No reviews found.</td></tr>
            ) : reviews.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 text-sm text-gray-900">{r.userName || "Anonymous"}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{r.title}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{r.comment}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${r.status === "Approved" ? "bg-emerald-100 text-emerald-700" : r.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {r.status !== "Approved" && (
                      <button onClick={() => updateStatus(r.id, "Approved")} disabled={acting === r.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium disabled:opacity-50">
                        Approve
                      </button>
                    )}
                    {r.status !== "Rejected" && (
                      <button onClick={() => updateStatus(r.id, "Rejected")} disabled={acting === r.id} className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium disabled:opacity-50">
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
    </div>
  );
}
