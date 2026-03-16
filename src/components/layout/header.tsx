import Link from 'next/link'
import { NavLinks } from './nav-links'
import { ThemeToggle } from './theme-toggle'
import { siteConfig } from '@/lib/config'

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-sm"
      style={{
        borderColor: 'var(--color-border)',
        background: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
      }}
    >
      <div className="mx-auto max-w-2xl px-5 py-5 text-center">
        <Link
          href="/"
          className="font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-60"
        >
          {siteConfig.author}
        </Link>
        <nav className="mt-3 flex items-center justify-center gap-6">
          <NavLinks />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
