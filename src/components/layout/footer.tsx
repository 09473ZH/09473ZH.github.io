export function Footer() {
  return (
    <footer style={{ color: 'var(--color-fg-muted)' }}>
      <div
        className="mx-auto max-w-2xl px-5 py-6 text-center font-mono text-xs"
        style={{ color: 'var(--color-fg-muted)' }}
      >
        © {new Date().getFullYear()} Zhou Hang
      </div>
    </footer>
  )
}
