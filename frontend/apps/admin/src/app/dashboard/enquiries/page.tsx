"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDateTime, type PaginatedData } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface Enquiry {
  id: string;
  providerId: string;
  providerName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  serviceInterest?: string;
  status: string;
  providerReply?: string;
  createdAt: string;
  readAt?: string;
  repliedAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-emerald-100 text-emerald-700",
  Read: "bg-blue-100 text-blue-700",
  Replied: "bg-indigo-100 text-indigo-700",
  Archived: "bg-gray-100 text-gray-600",
};

const FILTERS = ["all", "New", "Read", "Replied", "Archived"];

export default function EnquiriesPage() {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") || "all";
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const status = statusFilter !== "all" ? `&status=${statusFilter}` : "";
      const data = await adminApi<PaginatedData<Enquiry>>(token, `/enquiries/admin/all?page=${page}&pageSize=50${status}`);
      setEnquiries(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load enquiries");
    } finally {
      setLoading(false);
    }
  }, [token, page, statusFilter]);

  useEffect(() => { setPage(1); }, [statusFilter]);
  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Enquiry Inbox</h1>
          <p className="text-sm text-gray-400 mt-1">Monitor customer demand and provider response quality across the marketplace.</p>
        </div>
        <span className="text-sm text-gray-400">{enquiries.length} shown</span>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="flex flex-wrap gap-3 mb-6">
        {FILTERS.map((filter) => {
          const active = statusFilter.toLowerCase() === filter.toLowerCase();
          return (
            <Link key={filter} href={`/dashboard/enquiries?status=${filter.toLowerCase()}`} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"}`}>
              {filter === "all" ? "All" : filter}
            </Link>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Provider</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Message</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading enquiries...</td></tr>
            ) : enquiries.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No enquiries found.</td></tr>
            ) : enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="hover:bg-gray-50/50 align-top">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{enquiry.customerName}</p>
                  <p className="text-xs text-gray-400">{enquiry.customerEmail}</p>
                  {enquiry.customerPhone && <p className="text-xs text-gray-400">{enquiry.customerPhone}</p>}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{enquiry.providerName}</p>
                  {enquiry.serviceInterest && <p className="text-xs text-gray-400">{enquiry.serviceInterest}</p>}
                </td>
                <td className="px-6 py-4 max-w-xl">
                  <p className="line-clamp-2 text-sm text-gray-700">{enquiry.message}</p>
                  {enquiry.providerReply && <p className="mt-2 line-clamp-1 text-xs text-indigo-500">Reply: {enquiry.providerReply}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[enquiry.status] || "bg-gray-100 text-gray-600"}`}>
                    {enquiry.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(enquiry.createdAt)}</td>
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