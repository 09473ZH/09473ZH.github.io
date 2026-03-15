export function Tip({ children, note }: { children: React.ReactNode; note: string }) {
  return (
    <span className="group relative inline-block">
      <span
        className="cursor-default"
        style={{ borderBottom: '1px dotted var(--color-fg-muted)' }}
      >
        {children}
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-0 mb-1.5 whitespace-nowrap font-mono text-xs opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ color: 'var(--color-fg-muted)' }}
      >
        {note}
      </span>
    </span>
  )
}
