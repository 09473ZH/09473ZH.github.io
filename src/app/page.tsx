import { getAllPostMeta } from '@/lib/posts'
import { PostList } from '@/components/post/post-list'

export default function HomePage() {
  const posts = getAllPostMeta('article')

  if (posts.length === 0) {
    return (
      <p className="font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>
        — 暂无文章 —
      </p>
    )
  }

  return <PostList posts={posts} />
}
