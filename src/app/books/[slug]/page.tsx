import { notFound } from 'next/navigation'
import { getBookMeta, getBookRawContent, getAllBooks } from '@/lib/books'
import { extractTOC } from '@/lib/posts'
import { PostContent } from '@/components/post/post-content'
import { TableOfContents } from '@/components/post/table-of-contents'
import { MarginNotes } from '@/components/post/margin-notes'
import { TagList } from '@/components/post/tag-list'
import { formatDate } from '@/lib/utils'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const books = getAllBooks()
  if (books.length === 0) return [{ slug: '_empty' }]
  return books.map((b) => ({ slug: b.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = getBookMeta(slug)
  if (!book) return {}
  return {
    title: book.frontmatter.title,
    description: book.frontmatter.excerpt,
  }
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params
  const book = getBookMeta(slug)
  if (!book) notFound()

  const rawMd = getBookRawContent(slug) ?? ''
  const toc = extractTOC(rawMd)
  const { title, author, cover, date, tags } = book.frontmatter

  return (
    <div className="relative">
      <MarginNotes />
      {toc.length > 0 && (
        <aside className="absolute -left-64 top-0 hidden h-full w-56 xl:block">
          <div className="sticky space-y-4" style={{ top: 'calc(var(--header-height, 80px) + 1.5rem)' }}>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-fg-muted)' }}>
              {title}
            </p>
            <TableOfContents items={toc} />
          </div>
        </aside>
      )}

      <article>
        <header className="mb-10 space-y-3 border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-start gap-5">
            {cover && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cover}
                alt={title}
                className="w-20 shrink-0 rounded-sm object-cover"
                style={{ aspectRatio: '2/3', border: '1px solid var(--color-border)' }}
              />
            )}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-baseline justify-between gap-4">
                <h1 className="text-2xl font-semibold leading-snug tracking-tight">{title}</h1>
                <time
                  dateTime={date}
                  className="shrink-0 font-mono text-xs"
                  style={{ color: 'var(--color-fg-muted)' }}
                >
                  <span className="mr-2 uppercase tracking-widest opacity-50">Date</span>
                  {formatDate(date, 'yyyy · MM · dd')}
                </time>
              </div>
              <p className="font-mono text-sm" style={{ color: 'var(--color-fg-muted)' }}>
                {author}
              </p>
              {tags.length > 0 && <TagList tags={tags} />}
            </div>
          </div>
        </header>

        <PostContent source={rawMd} />
      </article>
    </div>
  )
}
