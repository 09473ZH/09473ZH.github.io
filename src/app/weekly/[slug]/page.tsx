import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getAllPostMeta, extractTOC } from '@/lib/posts'
import { PostPage } from '@/components/post/post-page'
import { siteConfig } from '@/lib/config'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPostMeta('weekly')
  if (posts.length === 0) return [{ slug: '_empty' }]
  return posts.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost('weekly', slug)
  if (!post) return {}

  const { title, excerpt, tags, date } = post.frontmatter
  return {
    title,
    description: excerpt,
    keywords: tags,
    openGraph: {
      title,
      description: excerpt,
      type: 'article',
      publishedTime: date,
      tags,
      url: `${siteConfig.url}/weekly/${slug}`,
    },
  }
}

export default async function WeeklyPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost('weekly', slug)
  if (!post) notFound()

  return <PostPage post={post} toc={extractTOC(post.rawContent)} />
}
