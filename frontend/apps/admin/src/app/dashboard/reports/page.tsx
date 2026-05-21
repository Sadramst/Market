"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDate, type PaginatedData } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface Report {
  id: string;
  reporterName: string;
  reporterEmail: string;
  targetType: string;
  targetId: string;
  targetLabel?: string;
  reason: string;
  description?: string;
  status: string;
  resolutionNotes?: string;
  createdAt: string;
  resolvedAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Reviewing: "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Dismissed: "bg-gray-100 text-gray-600",
};

const FILTERS = ["all", "Pending", "Reviewing", "Resolved", "Dismissed"];

export default function ReportsPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [reports, setReports] = useState<Report[]>([]);
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
      const data = await adminApi<PaginatedData<Report>>(token, `/reports?page=${page}&pageSize=50${status}`);
      setReports(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load reports");
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
      await adminApi(token, `/reports/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, resolutionNotes: `${status} by admin` }),
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update report");
    } finally {
      setActing(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Content Reports</h1>
          <p className="text-sm text-gray-400 mt-1">Triage reported providers, reviews, messages, and gallery assets.</p>
        </div>
        <span className="text-sm text-gray-400">{reports.length} shown</span>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-3 mb-6">
        {FILTERS.map((filter) => {
          const active = statusFilter.toLowerCase() === filter.toLowerCase();
          return (
            <Link key={filter} href={`/dashboard/reports?status=${filter.toLowerCase()}`} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}>
              {filter === "all" ? "All" : filter}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reporter</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Target</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No reports submitted yet.</td></tr>
            ) : reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50/50 align-top">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{report.reporterName || "Unknown"}</p>
                  <p className="text-xs text-gray-400">{report.reporterEmail || "No email"}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-700">{report.targetType}</p>
                  <p className="text-xs text-gray-400 line-clamp-1">{report.targetLabel || report.targetId}</p>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-sm font-medium text-gray-900">{report.reason}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{report.description || "No details supplied."}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[report.status] || "bg-gray-100 text-gray-600"}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(report.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {report.status !== "Reviewing" && report.status !== "Resolved" && (
                      <button onClick={() => updateStatus(report.id, "Reviewing")} disabled={acting === report.id} className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium disabled:opacity-50">Review</button>
                    )}
                    {report.status !== "Resolved" && (
                      <button onClick={() => updateStatus(report.id, "Resolved")} disabled={acting === report.id} className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium disabled:opacity-50">Resolve</button>
                    )}
                    {report.status !== "Dismissed" && (
                      <button onClick={() => updateStatus(report.id, "Dismissed")} disabled={acting === report.id} className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 font-medium disabled:opacity-50">Dismiss</button>
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