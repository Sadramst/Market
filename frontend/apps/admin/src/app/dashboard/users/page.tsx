export default function UsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">Admin User</td>
              <td className="px-6 py-4 text-sm text-gray-500">admin@appilico.com</td>
              <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">SuperAdmin</span></td>
              <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span></td>
              <td className="px-6 py-4 text-sm text-gray-400">Seeded</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">Moderator</td>
              <td className="px-6 py-4 text-sm text-gray-500">moderator@appilico.com</td>
              <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Moderator</span></td>
              <td className="px-6 py-4"><span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Active</span></td>
              <td className="px-6 py-4 text-sm text-gray-400">Seeded</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
