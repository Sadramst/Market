import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Providers", href: "/dashboard/providers", icon: "🏪" },
  { label: "Reviews", href: "/dashboard/reviews", icon: "⭐" },
  { label: "Categories", href: "/dashboard/categories", icon: "📂" },
  { label: "Users", href: "/dashboard/users", icon: "👥" },
  { label: "Reports", href: "/dashboard/reports", icon: "🚩" },
  { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-indigo-800">
          <Link href="/dashboard" className="text-xl font-bold">
            Appilico <span className="text-indigo-300 text-sm">Admin</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-indigo-200 hover:bg-indigo-900 hover:text-white transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-indigo-800 text-xs text-indigo-400">
          {/* TODO: Show logged-in admin info */}
          <p>admin@appilico.com</p>
          <p className="mt-1">SuperAdmin</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
          {/* TODO: Notifications + user menu */}
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
