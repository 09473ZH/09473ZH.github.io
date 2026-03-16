import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostsByTag, getAllTags } from '@/lib/posts'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  return Object.keys(getAllTags()).map((tag) => ({
    tag: encodeURIComponent(tag),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `#${decodedTag}`,
    description: `标签「${decodedTag}」下的所有文章`,
  }
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const posts = getPostsByTag(decodedTag)

  if (posts.length === 0) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-sm font-mono" style={{ color: 'var(--color-fg-muted)' }}>
          #{decodedTag}
          <span className="ml-2 opacity-50">{posts.length}</span>
        </h1>
      </div>

      <div>
        {posts.map((post) => {
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
                {post.frontmatter.date}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
