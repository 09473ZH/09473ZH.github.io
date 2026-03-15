'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/', label: 'Posts' },
  { href: '/weekly', label: 'Weekly' },
  { href: '/books', label: 'Books' },
  { href: '/about', label: 'About' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <>
      {NAV_LINKS.map(({ href, label }) => {
        const active =
          href === '/'
            ? pathname === '/' || pathname.startsWith('/articles')
            : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: active ? 'var(--color-fg)' : 'var(--color-fg-muted)' }}
          >
            {label}
          </Link>
        )
      })}
    </>
  )
}
