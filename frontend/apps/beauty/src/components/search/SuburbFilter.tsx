'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { PERTH_SUBURBS } from '@/lib/suburbs'

type S = (typeof PERTH_SUBURBS)[number]

export function SuburbFilter() {
  const router = useRouter()
  const sp = useSearchParams()
  const cur = sp?.get('suburb') ?? null
  const [val, setVal] = useState('')
  const [opts, setOpts] = useState<readonly S[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const found = PERTH_SUBURBS.find(s => s.slug === cur)
    setVal(found ? `${found.name} (${found.postCode})` : '')
  }, [cur])

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const onType = useCallback((v: string) => {
    setVal(v)
    if (!v.trim()) { setOpts([]); setOpen(false); return }
    const q = v.toLowerCase()
    const r = PERTH_SUBURBS.filter(s =>
      s.name.toLowerCase().startsWith(q) ||
      s.name.toLowerCase().includes(q) ||
      s.postCode.startsWith(v.trim())
    ).slice(0, 8)
    setOpts(r); setOpen(r.length > 0)
  }, [])

  const pick = useCallback((s: S) => {
    setVal(`${s.name} (${s.postCode})`); setOpen(false)
    const next = new URLSearchParams()
    if (sp) {
      sp.forEach((v, k) => { if (k !== 'page') next.set(k, v) })
    }
    if (next.has('sortBy')) { next.set('sort', next.get('sortBy')!); next.delete('sortBy') }
    next.set('suburb', s.slug)
    router.push(`/search?${next.toString()}`)
  }, [router, sp])

  const clear = useCallback(() => {
    setVal(''); setOpen(false)
    const next = new URLSearchParams()
    if (sp) {
      sp.forEach((v, k) => { if (k !== 'page' && k !== 'suburb') next.set(k, v) })
    }
    router.push(`/search?${next.toString()}`)
  }, [router, sp])

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: 220 }}>
      <div style={{
        display: 'flex', alignItems: 'center', height: 44,
        border: `1.5px solid ${cur ? 'var(--brand-rose)' : 'var(--border)'}`,
        borderRadius: 8, background: 'white', padding: '0 12px',
      }}>
        <span style={{ fontSize: 16, marginRight: 8 }}>📍</span>
        <input
          type="text" value={val}
          onChange={e => onType(e.target.value)}
          onFocus={() => {
            if (!val) { setOpts(PERTH_SUBURBS.slice(0, 6) as unknown as S[]); setOpen(true) }
            else if (opts.length) setOpen(true)
          }}
          placeholder="Suburb or postcode..."
          style={{
            flex: 1, border: 'none', outline: 'none',
            fontFamily: 'var(--font-body)', fontSize: 14,
            background: 'transparent', color: 'var(--text-primary)',
          }}
        />
        {cur && (
          <button onMouseDown={e => { e.preventDefault(); clear() }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 20 }}>×</button>
        )}
      </div>

      {open && opts.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 999,
          background: 'white', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: '0 8px 32px rgba(28,20,16,0.12)',
          maxHeight: 280, overflowY: 'auto',
        }}>
          {!val && <div style={{ padding: '8px 14px 4px', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border)' }}>Popular suburbs</div>}
          {opts.map((s, i) => (
            <button key={s.slug}
              onMouseDown={e => { e.preventDefault(); pick(s) }}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                width: '100%', padding: '11px 16px', border: 'none', background: 'none',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)',
                borderBottom: i < opts.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{s.name}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: 50 }}>{s.postCode}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
