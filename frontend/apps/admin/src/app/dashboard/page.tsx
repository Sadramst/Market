export default function DashboardPage() {
  // TODO: Fetch real stats from API
  const stats = [
    { label: "Total Providers", value: "0", change: "+0 today", icon: "🏪" },
    { label: "Pending Approvals", value: "0", change: "Requires action", icon: "⏳" },
    { label: "Total Reviews", value: "0", change: "+0 this week", icon: "⭐" },
    { label: "Registered Users", value: "0", change: "+0 this week", icon: "👥" },
    { label: "Active Reports", value: "0", change: "Open", icon: "🚩" },
    { label: "Categories", value: "21", change: "9 beauty + 12 IT", icon: "📂" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Review Pending Providers", href: "/dashboard/providers?status=pending", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
          { label: "Moderate Reviews", href: "/dashboard/reviews?status=pending", color: "bg-blue-50 text-blue-700 border-blue-200" },
          { label: "Manage Categories", href: "/dashboard/categories", color: "bg-green-50 text-green-700 border-green-200" },
          { label: "View Reports", href: "/dashboard/reports", color: "bg-red-50 text-red-700 border-red-200" },
        ].map((action) => (
          <a key={action.label} href={action.href} className={`p-4 rounded-xl border ${action.color} hover:shadow-md transition-all text-sm font-medium`}>
            {action.label}
          </a>
        ))}
      </div>
    </div>
  );
}
