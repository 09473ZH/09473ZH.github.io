'use client'

import { useEffect, useState } from 'react'
import type { TOCItem } from '@/types'

interface Props {
  items: TOCItem[]
}

export function TableOfContents({ items }: Props) {
  const [activeSlug, setActiveSlug] = useState('')

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.slug))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSlug(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px' },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="目录" className="text-left">
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item.slug} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
            <a
              href={`#${item.slug}`}
              className="block text-xs leading-relaxed transition-colors"
              style={{
                color: activeSlug === item.slug ? 'var(--color-accent)' : 'var(--color-fg-muted)',
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
