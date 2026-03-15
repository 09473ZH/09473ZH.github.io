import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import GithubSlugger from 'github-slugger'
import type { Post, PostMeta, PostFrontmatter, TOCItem } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content')

function getContentDir(type: 'article' | 'weekly') {
  return path.join(CONTENT_DIR, type === 'article' ? 'articles' : 'weekly')
}

function parseFrontmatter(raw: Record<string, unknown>): PostFrontmatter {
  return {
    title: String(raw.title ?? 'Untitled'),
    date: String(raw.date ?? new Date().toISOString().split('T')[0]),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    excerpt: String(raw.excerpt ?? ''),
    cover: raw.cover ? String(raw.cover) : undefined,
    draft: raw.draft === true,
    week: raw.week ? Number(raw.week) : undefined,
    year: raw.year ? Number(raw.year) : undefined,
  }
}

export function byDateDesc<T extends { frontmatter: { date: string } }>(a: T, b: T): number {
  return a.frontmatter.date < b.frontmatter.date ? 1 : -1
}

export function getPostSlugs(type: 'article' | 'weekly'): string[] {
  const dir = getContentDir(type)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getPostMeta(type: 'article' | 'weekly', slug: string): PostMeta | null {
  const filePath = path.join(getContentDir(type), `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = parseFrontmatter(data)

  if (frontmatter.draft && process.env.NODE_ENV === 'production') return null

  return {
    slug,
    type,
    frontmatter,
  }
}

export function getAllPostMeta(type: 'article' | 'weekly'): PostMeta[] {
  return getPostSlugs(type)
    .map((slug) => getPostMeta(type, slug))
    .filter((p): p is PostMeta => p !== null)
    .sort(byDateDesc)
}

export function getAllTags(type?: 'article' | 'weekly'): Record<string, number> {
  const types: Array<'article' | 'weekly'> = type ? [type] : ['article', 'weekly']
  const tagCounts: Record<string, number> = {}
  for (const t of types) {
    getAllPostMeta(t).forEach(({ frontmatter: { tags } }) => {
      tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1
      })
    })
  }
  return tagCounts
}

export function getPostsByTag(tag: string): PostMeta[] {
  return [...getAllPostMeta('article'), ...getAllPostMeta('weekly')]
    .filter((p) => p.frontmatter.tags.includes(tag))
    .sort(byDateDesc)
}

export function extractTOC(markdown: string): TOCItem[] {
  const slugger = new GithubSlugger()
  const lines = markdown.split('\n')
  const toc: TOCItem[] = []

  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/\*\*|__|~~|`/g, '').trim()
      toc.push({ level, text, slug: slugger.slug(text) })
    }
  }

  return toc
}

export function getPost(type: 'article' | 'weekly', slug: string): Post | null {
  const filePath = path.join(getContentDir(type), `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const frontmatter = parseFrontmatter(data)

  if (frontmatter.draft && process.env.NODE_ENV === 'production') return null

  return {
    slug,
    type,
    frontmatter,
    rawContent: content,
  }
}
