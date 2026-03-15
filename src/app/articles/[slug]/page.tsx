import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPost, getAllPostMeta, extractTOC } from '@/lib/posts'
import { PostPage } from '@/components/post/post-page'
import { siteConfig } from '@/lib/config'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPostMeta('article').map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost('article', slug)
  if (!post) return {}

  const { title, excerpt, tags, cover, date } = post.frontmatter
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
      images: cover ? [{ url: cover }] : [],
      url: `${siteConfig.url}/articles/${slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: excerpt,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = getPost('article', slug)
  if (!post) notFound()

  return <PostPage post={post} toc={extractTOC(post.rawContent)} />
}
