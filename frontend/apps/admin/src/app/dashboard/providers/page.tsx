import Link from "next/link";

export default function ProvidersPage() {
  // TODO: Fetch from API with auth token
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Provider Management</h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["All", "Pending", "Approved", "Suspended", "Rejected"].map((status) => (
          <Link
            key={status}
            href={`/dashboard/providers?status=${status.toLowerCase()}`}
            className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            {status}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Business</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                No providers registered yet. They will appear here once users create business profiles.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
