import Link from 'next/link'
import type { PostMeta } from '@/types'
import { formatDate } from '@/lib/utils'
import { TagList } from './tag-list'

interface Props {
  post: PostMeta
  compact?: boolean
  showType?: boolean
  showTags?: boolean
  showExcerpt?: boolean
}

export function PostCard({ post, compact = false, showType = false, showTags = true, showExcerpt = true }: Props) {
  const href = `/${post.type === 'article' ? 'articles' : 'weekly'}/${post.slug}`

  return (
    <article className="group py-5 space-y-1.5">
      <Link href={href} className="block">
        <div className="flex items-start justify-between gap-4">
          <h2
            className={`font-medium leading-snug transition-colors group-hover:text-[var(--color-accent)] ${
              compact ? 'text-sm' : 'text-base'
            }`}
          >
            {showType && (
              <span
                className="mr-2 text-xs"
                style={{ color: 'var(--color-fg-muted)' }}
              >
                [{post.type === 'article' ? '文章' : '周记'}]
              </span>
            )}
            {post.frontmatter.title}
          </h2>
          <time
            dateTime={post.frontmatter.date}
            className="shrink-0 text-xs tabular-nums"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            {formatDate(post.frontmatter.date, 'yyyy-MM-dd')}
          </time>
        </div>

        {!compact && showExcerpt && post.frontmatter.excerpt && (
          <p
            className="line-clamp-2 text-sm leading-relaxed"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            {post.frontmatter.excerpt}
          </p>
        )}
      </Link>

      {!compact && showTags && post.frontmatter.tags.length > 0 && (
        <TagList tags={post.frontmatter.tags} />
      )}
    </article>
  )
}
