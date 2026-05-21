"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDate, type PaginatedData } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  providerId?: string;
  roles: string[];
}

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "50" });
      if (search.trim()) params.set("search", search.trim());
      if (role !== "all") params.set("role", role);
      if (status !== "all") params.set("status", status);

      const data = await adminApi<PaginatedData<AdminUser>>(token, `/users?${params.toString()}`);
      setUsers(data.items ?? []);
      setTotalPages(data.pagination?.totalPages ?? 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }, [token, page, search, role, status]);

  useEffect(() => { load(); }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-400 mt-1">View customers, providers, moderators, and platform admins.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Search users"
            className="w-56 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <select value={role} onChange={(event) => { setRole(event.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
            <option value="all">All roles</option>
            <option value="SuperAdmin">Super admins</option>
            <option value="Moderator">Moderators</option>
            <option value="Provider">Providers</option>
            <option value="Customer">Customers</option>
          </select>
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-400">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Roles</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users found.</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-900">{user.fullName || "Unnamed user"}</p>
                  <p className="text-xs text-gray-400">{user.providerId ? "Provider account" : "Customer/admin account"}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs text-gray-400">{user.phoneNumber || (user.emailConfirmed ? "Email verified" : "Email unverified")}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(user.roles.length ? user.roles : ["Customer"]).map((item) => (
                      <span key={item} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">{item}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
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