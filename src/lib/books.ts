import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BookFrontmatter, BookMeta } from '@/types'

const BOOKS_DIR = path.join(process.cwd(), 'content/books')

function parseFrontmatter(raw: Record<string, unknown>): BookFrontmatter {
  return {
    title: String(raw.title ?? 'Untitled'),
    author: String(raw.author ?? ''),
    cover: raw.cover ? String(raw.cover) : undefined,
    date: String(raw.date ?? ''),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    excerpt: String(raw.excerpt ?? ''),
    draft: raw.draft === true,
  }
}

export function getAllBooks(): BookMeta[] {
  if (!fs.existsSync(BOOKS_DIR)) return []
  return fs
    .readdirSync(BOOKS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(BOOKS_DIR, f), 'utf-8')
      const { data } = matter(raw)
      const frontmatter = parseFrontmatter(data)
      if (frontmatter.draft && process.env.NODE_ENV === 'production') return null
      return { slug, frontmatter }
    })
    .filter((b): b is BookMeta => b !== null)
    .sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
}

export function getBookMeta(slug: string): BookMeta | null {
  const filePath = path.join(BOOKS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  const frontmatter = parseFrontmatter(data)
  if (frontmatter.draft && process.env.NODE_ENV === 'production') return null
  return { slug, frontmatter }
}

export function getBookRawContent(slug: string): string | null {
  const filePath = path.join(BOOKS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const { content } = matter(fs.readFileSync(filePath, 'utf-8'))
  return content
}
