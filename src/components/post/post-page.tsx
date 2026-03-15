import { PostContent } from '@/components/post/post-content'
import { TableOfContents } from '@/components/post/table-of-contents'
import { MarginNotes } from '@/components/post/margin-notes'
import { TagList } from '@/components/post/tag-list'
import { formatDate } from '@/lib/utils'
import type { Post, TOCItem } from '@/types'

interface PostPageProps {
  post: Post
  toc: TOCItem[]
}

export function PostPage({ post, toc }: PostPageProps) {
  return (
    <div className="relative">
      <MarginNotes />
      {toc.length > 0 && (
        <aside className="absolute -left-64 top-0 hidden h-full w-56 xl:block">
          <div className="sticky space-y-4" style={{ top: 'calc(var(--header-height, 80px) + 1.5rem)' }}>
            <p className="min-w-0 text-xs leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
              {post.frontmatter.title}
            </p>
            <TableOfContents items={toc} />
          </div>
        </aside>
      )}

      <article>
        <header className="mb-10 space-y-3 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-baseline justify-between gap-6">
            <h1 className="text-2xl font-semibold leading-snug tracking-tight">
              {post.frontmatter.title}
            </h1>
            <time
              dateTime={post.frontmatter.date}
              className="shrink-0 font-mono text-xs"
              style={{ color: 'var(--color-fg-muted)' }}
            >
              <span className="mr-2 uppercase tracking-widest opacity-50">Date</span>
              {formatDate(post.frontmatter.date, 'yyyy · MM · dd')}
            </time>
          </div>
          {post.frontmatter.tags.length > 0 && <TagList tags={post.frontmatter.tags} />}
        </header>

        <PostContent source={post.rawContent} />
      </article>
    </div>
  )
}
