import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-950">
      <div className="max-w-md text-center px-4">
        <h1 className="text-3xl font-bold text-white mb-2">Appilico Admin</h1>
        <p className="text-indigo-300 mb-8">Platform management dashboard</p>
        {/* TODO: Login form wired to auth API */}
        <div className="bg-white rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign In</h2>
          <form className="space-y-4">
            <input type="email" placeholder="admin@appilico.com" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/50 focus:outline-none" />
            <Link href="/dashboard" className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-center">
              Sign In
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
