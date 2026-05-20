import Link from "next/link";

export default function AdminHomePage() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative max-w-md w-full px-4">
        {/* Logo & title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-600/30">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Appilico Admin</h1>
          <p className="text-indigo-300/70 text-sm mt-1">Platform management dashboard</p>
        </div>

        {/* Login card */}
        <div className="bg-white/[0.07] backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>
          {/* TODO: Login form wired to auth API */}
          <form className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-indigo-200/60 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" placeholder="admin@appilico.com" className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-indigo-300/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 focus:outline-none transition-all text-sm" />
            </div>
            <div>
              <label className="block text-xs font-medium text-indigo-200/60 mb-1.5 uppercase tracking-wider">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder:text-indigo-300/30 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 focus:outline-none transition-all text-sm" />
            </div>
            <Link href="/dashboard" className="block w-full px-4 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 transition-all text-center text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98]">
              Sign In
            </Link>
          </form>
        </div>

        <p className="text-center text-indigo-400/40 text-xs mt-6">Appilico Platform &copy; {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
