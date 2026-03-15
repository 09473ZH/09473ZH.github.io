interface Props {
  tags: string[]
}

export function TagList({ tags }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <a
          key={tag}
          href={`/tags/${encodeURIComponent(tag)}`}
          className="font-mono text-xs transition-opacity hover:opacity-60"
          style={{ color: 'var(--color-fg-muted)' }}
        >
          [{tag}]
        </a>
      ))}
    </div>
  )
}
