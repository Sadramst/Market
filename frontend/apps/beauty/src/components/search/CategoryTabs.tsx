'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const TABS = [
  { slug: 'all', name: 'All', icon: '✨' },
  { slug: 'nails', name: 'Nails', icon: '💅' },
  { slug: 'hair', name: 'Hair', icon: '✂️' },
  { slug: 'lashes', name: 'Lashes', icon: '👁️' },
  { slug: 'brows', name: 'Brows', icon: '🌙' },
  { slug: 'skin-care', name: 'Skin Care', icon: '🌸' },
  { slug: 'makeup', name: 'Makeup', icon: '💄' },
  { slug: 'body', name: 'Body', icon: '🛁' },
  { slug: 'massage', name: 'Massage', icon: '💆' },
  { slug: 'cosmetic', name: 'Cosmetic', icon: '⭐' },
  { slug: 'wellness', name: 'Wellness', icon: '🌿' },
]

export function CategoryTabs({ activeCategory }: { activeCategory?: string }) {
  const sp = useSearchParams()

  const tabUrl = (slug: string) => {
    // Copy ALL existing params — this preserves suburb, sort, q, etc.
    const next = new URLSearchParams()
    sp.forEach((v, k) => {
      if (k !== 'page') next.set(k, v) // Reset page on tab change
    })
    // Normalise sortBy → sort
    if (next.has('sortBy')) {
      next.set('sort', next.get('sortBy')!)
      next.delete('sortBy')
    }
    // Set the new category
    if (slug === 'all') next.delete('category')
    else next.set('category', slug)
    return `/search?${next.toString()}`
    // suburb is automatically preserved because we copied all params
  }

  const active = activeCategory ?? 'all'

  return (
    <div style={{ overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
      <div style={{ display: 'flex', gap: 6, width: 'max-content' }}>
        {TABS.map(tab => {
          const isActive = active === tab.slug
          return (
            <Link key={tab.slug} href={tabUrl(tab.slug)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '8px 16px', borderRadius: 50, whiteSpace: 'nowrap',
                textDecoration: 'none', flexShrink: 0,
                fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500,
                background: isActive ? 'var(--brand-rose)' : 'var(--bg-secondary)',
                color: isActive ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${isActive ? 'var(--brand-rose)' : 'var(--border)'}`,
                transition: 'all 0.2s ease',
              }}>
              {tab.icon} {tab.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
