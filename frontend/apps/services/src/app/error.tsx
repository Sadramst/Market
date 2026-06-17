'use client'

import Link from 'next/link'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <span className="text-6xl mb-4 block">⚠️</span>
      <h1 className="text-[24px] mb-2" style={{ fontFamily: 'var(--font-inter)', color: '#0f172a', fontWeight: 700 }}>Something went wrong</h1>
      <p className="text-[15px] font-light mb-6" style={{ color: '#475569' }}>{error.message}</p>
      <div className="flex items-center justify-center gap-3">
        <button onClick={reset} className="px-6 py-3 text-[14px] font-medium text-white transition-all" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)', borderRadius: '12px', fontFamily: 'var(--font-inter)' }}>Try Again</button>
        <Link href="/" className="px-6 py-3 text-[14px] font-medium transition-all" style={{ border: '1px solid #cbd5e1', color: '#334155', borderRadius: '12px', fontFamily: 'var(--font-inter)' }}>Back to Home</Link>
      </div>
    </div>
  )
}