import Link from 'next/link'
import { getAllBooks } from '@/lib/books'

export default function BooksPage() {
  const books = getAllBooks()

  return (
    <div>
      {books.length === 0 ? (
        <p className="font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>
          — 书架还是空的 —
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-x-6 gap-y-8 sm:grid-cols-4 md:grid-cols-5">
          {books.map((book) => {
            const { title, author, cover } = book.frontmatter
            return (
              <Link
                key={book.slug}
                href={`/books/${book.slug}`}
                className="group block transition-opacity hover:opacity-70"
              >
                <div
                  className="overflow-hidden"
                  style={{
                    aspectRatio: '2/3',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-bg-soft)',
                  }}
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={title} className="h-full w-full object-cover" />
                  ) : (
                    <div
                      className="flex h-full flex-col justify-between p-3"
                      style={{ borderLeft: '3px solid var(--color-accent)' }}
                    >
                      <p className="text-xs leading-snug" style={{ color: 'var(--color-fg)' }}>
                        {title}
                      </p>
                      <p className="font-mono text-[0.6rem]" style={{ color: 'var(--color-fg-muted)' }}>
                        {author}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs leading-snug">{title}</p>
                  <p className="font-mono text-[0.6rem]" style={{ color: 'var(--color-fg-muted)' }}>
                    {author}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
