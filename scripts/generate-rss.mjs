#!/usr/bin/env node
/**
 * scripts/generate-rss.mjs
 *
 * 构建时生成 public/rss.xml，供静态部署使用。
 * 用法：node scripts/generate-rss.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:3000'
const SITE_NAME = process.env.SITE_NAME ?? 'My Blog'
const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION ?? 'A minimalist personal blog'

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function readPostMetas(type) {
  const dir = path.join(ROOT, 'content', type === 'article' ? 'articles' : 'weekly')
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), 'utf-8')
      const { data } = matter(raw)
      if (data.draft === true) return null
      return {
        slug: f.replace(/\.md$/, ''),
        type,
        title: String(data.title ?? 'Untitled'),
        date: String(data.date ?? ''),
        excerpt: String(data.excerpt ?? ''),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      }
    })
    .filter(Boolean)
}

const allPosts = [...readPostMetas('article'), ...readPostMetas('weekly')]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 50)

const items = allPosts
  .map((post) => {
    const segment = post.type === 'article' ? 'articles' : 'weekly'
    const url = `${SITE_URL}/${segment}/${post.slug}/`
    return `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n    ')}
  </item>`
  })
  .join('')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

const outPath = path.join(ROOT, 'public', 'rss.xml')
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true })
fs.writeFileSync(outPath, xml, 'utf-8')
console.log(`✓ rss.xml generated (${allPosts.length} posts)`)
