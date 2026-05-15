'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_STYLE = {
  background: '#0d0d0d',
  borderBottom: '1px solid #1a1a1a',
  height: 44,
  padding: '0 24px',
}

const linkBase = {
  fontSize: 14,
  color: '#666',
  textDecoration: 'none',
  paddingBottom: 10,
  borderBottom: '2px solid transparent',
  marginBottom: -1,
}

export default function DemoSubnav({ scriptKey }) {
  const pathname = usePathname()
  const base = `/demo/${encodeURIComponent(scriptKey)}`

  const items = [
    { href: base, label: 'Home', match: (p) => p === base },
    { href: `${base}/dashboard`, label: 'Dashboard', match: (p) => p === `${base}/dashboard` },
    { href: `${base}/projects`, label: 'Projects', match: (p) => p === `${base}/projects` },
    { href: `${base}/settings`, label: 'Settings', match: (p) => p === `${base}/settings` },
    { href: `${base}/pricing`, label: 'Pricing', match: (p) => p === `${base}/pricing` },
  ]

  return (
    <nav
      className="fixed inset-x-0 top-12 z-[998] flex items-center justify-center"
      style={{ ...NAV_STYLE, gap: 24 }}
      aria-label="Demo site pages">
      {items.map((item) => {
        const active = item.match(pathname || '')
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            style={{
              ...linkBase,
              color: active ? '#fff' : '#666',
              borderBottomColor: active ? '#F15025' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.color = '#999'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = active ? '#fff' : '#666'
            }}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
