interface Props {
  children: React.ReactNode
  note?: string
}

export function Mark({ children, note }: Props) {
  return (
    <span className="mark-anchor" data-note={note ?? ''}>
      <span className="mark-text">{children}</span>
      {note && <span className="mark-note">{note}</span>}
    </span>
  )
}
