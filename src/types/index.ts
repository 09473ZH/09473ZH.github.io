export interface PostFrontmatter {
  title: string
  date: string
  tags: string[]
  excerpt: string
  cover?: string
  draft?: boolean
  // Weekly-only fields
  week?: number
  year?: number
}

export interface Post {
  slug: string
  type: 'article' | 'weekly'
  frontmatter: PostFrontmatter
  rawContent: string
}

export interface PostMeta {
  slug: string
  type: 'article' | 'weekly'
  frontmatter: PostFrontmatter
}

export interface BookFrontmatter {
  title: string
  author: string
  cover?: string
  date: string
  tags: string[]
  excerpt: string
  draft?: boolean
}

export interface BookMeta {
  slug: string
  frontmatter: BookFrontmatter
}

export interface TOCItem {
  level: number
  text: string
  slug: string
}
