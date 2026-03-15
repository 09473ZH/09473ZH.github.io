import Link from 'next/link'
import type { PostMeta } from '@/types'

interface PostListProps {
  posts: PostMeta[]
}

export function PostList({ posts }: PostListProps) {
  const grouped = posts.reduce<Record<string, PostMeta[]>>((acc, post) => {
    const year = post.frontmatter.date.slice(0, 4)
    ;(acc[year] ??= []).push(post)
    return acc
  }, {})

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a))

  return (
    <div className="space-y-10">
      {years.map((year) => (
        <section key={year}>
          <div className="mb-3 font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>
            {year}
          </div>
          <div>
            {grouped[year].map((post) => {
              const href = `/${post.type === 'article' ? 'articles' : 'weekly'}/${post.slug}`
              return (
                <Link
                  key={`${post.type}-${post.slug}`}
                  href={href}
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
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
