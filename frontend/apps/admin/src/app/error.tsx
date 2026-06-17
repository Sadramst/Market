'use client'

import Link from 'next/link'

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.25em] text-indigo-300/70 mb-3">Dashboard Error</p>
        <h1 className="text-2xl font-bold mb-3">Something broke in admin</h1>
        <p className="text-sm text-indigo-100/70 mb-6">{error.message}</p>
        <div className="flex flex-wrap gap-3">
          <button onClick={reset} className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors">Retry</button>
          <Link href="/login" className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Back to login</Link>
        </div>
      </div>
    </div>
  )
}