import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPostMeta } from '@/lib/posts'

export const metadata: Metadata = {
  title: '周记',
  description: '每周记录与思考',
}

export default function WeeklyPage() {
  const posts = getAllPostMeta('weekly')

  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.frontmatter.date.slice(0, 4)
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  if (posts.length === 0) {
    return (
      <p className="font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>
        — 暂无周记 —
      </p>
    )
  }

  return (
    <div className="space-y-10">
      {years.map((year) => (
        <section key={year}>
          <div
            className="mb-3 font-mono text-xs"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            {year}
          </div>
          <div>
            {grouped[year].map((post) => (
              <Link
                key={post.slug}
                href={`/weekly/${post.slug}`}
                className="flex items-baseline justify-between gap-6 py-1.5 transition-opacity hover:opacity-60"
              >
                <span className="text-sm">{post.frontmatter.title}</span>
                <span
                  className="shrink-0 font-mono text-xs tabular-nums"
                  style={{ color: 'var(--color-fg-muted)' }}
                >
                  {post.frontmatter.date.slice(5)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
