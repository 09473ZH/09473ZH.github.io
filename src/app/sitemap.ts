import type { MetadataRoute } from 'next'
import { getAllPostMeta } from '@/lib/posts'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-static'

const SITE_URL = siteConfig.url

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllPostMeta('article').map((p) => ({
    url: `${SITE_URL}/articles/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const weekly = getAllPostMeta('weekly').map((p) => ({
    url: `${SITE_URL}/weekly/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/articles`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/weekly`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    ...articles,
    ...weekly,
  ]
}
