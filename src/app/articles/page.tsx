import type { Metadata } from 'next'
import { getAllPostMeta, getAllTags } from '@/lib/posts'
import { PostCard } from '@/components/post/post-card'

export const metadata: Metadata = {
  title: '文章',
  description: '所有文章列表',
}

export default function ArticlesPage() {
  const posts = getAllPostMeta('article')
  const tags = getAllTags('article')

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-2xl font-bold">文章</h1>
        <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>
          共 {posts.length} 篇
        </p>
      </div>

      {Object.keys(tags).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(tags)
            .sort(([, a], [, b]) => b - a)
            .map(([tag, count]) => (
              <a
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-70"
                style={{
                  background: 'var(--color-tag-bg)',
                  color: 'var(--color-tag-fg)',
                }}
              >
                {tag} ({count})
              </a>
            ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p style={{ color: 'var(--color-fg-muted)' }}>暂无文章</p>
      ) : (
        <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
