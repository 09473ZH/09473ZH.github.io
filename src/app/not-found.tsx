export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="font-mono text-xs" style={{ color: 'var(--color-fg-muted)' }}>404</p>
      <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>页面不存在</p>
    </div>
  )
}
