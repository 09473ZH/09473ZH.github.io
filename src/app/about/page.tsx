import type { Metadata } from 'next'
import { Tip } from '@/components/mdx/tip'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'About',
}

// ── 个性化配置 ────────────────────────────────────────────────────

const ACE_ITEMS = [
  { word: 'Aesthetic', note: '形式本身就是内容的一部分' },
  { word: 'Creative', note: '用已有的东西做出没有的东西' },
  { word: 'Empathic', note: '先理解人，再理解问题' },
]

const BIO = [
  '对「用技术做出有审美的东西」这件事始终保持热情。',
  '这个博客内容涵盖技术学习、读书笔记，以及一些个人思考。',
]

const PROJECTS = [
  {
    name: 'ccops',
    href: 'https://github.com/09473ZH/ccops',
    description: '主机运维管理平台，支持百台内主机运维',
    lang: 'TypeScript',
  },
]

const SOCIAL = [
  {
    label: '09473ZH',
    href: 'https://github.com/09473ZH',
    icon: 'github' as const,
  },
  {
    label: 'alazhouhang@qq.com',
    href: 'mailto:alazhouhang@qq.com',
    icon: 'email' as const,
  },
]

// ───────────────────────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  Go: '#00add8',
  Rust: '#dea584',
  Python: '#3572a5',
}

export default function AboutPage() {
  return (
    <div className="space-y-14 py-8">
      {/* Identity */}
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">{siteConfig.author}</h1>
        <div
          className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm"
          style={{ color: 'var(--color-fg-muted)' }}
        >
          {ACE_ITEMS.map(({ word, note }, i) => (
            <span key={word} className="inline-flex items-baseline gap-2">
              <Tip note={note}>{word}</Tip>
              {i < ACE_ITEMS.length - 1 && <span>·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-3 text-sm leading-relaxed">
        {BIO.map((line, i) => (
          <p key={i} style={i > 0 ? { color: 'var(--color-fg-muted)' } : undefined}>{line}</p>
        ))}
      </div>

      {/* Projects */}
      {PROJECTS.length > 0 && (
        <div className="space-y-4">
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-fg-muted)' }}
          >
            Projects
          </p>
          <ul className="space-y-4">
            {PROJECTS.map((p) => (
              <li key={p.name}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block space-y-1 transition-opacity hover:opacity-70"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span
                      className="flex items-center gap-1 font-mono text-xs"
                      style={{ color: 'var(--color-fg-muted)' }}
                    >
                      <span
                        className="inline-block h-2 w-2 rounded-full"
                        style={{ backgroundColor: LANG_COLORS[p.lang] ?? 'var(--color-fg-muted)' }}
                      />
                      {p.lang}
                    </span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--color-fg-muted)' }}>
                    {p.description}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact */}
      <div className="space-y-3">
        <p
          className="font-mono text-xs uppercase tracking-widest"
          style={{ color: 'var(--color-fg-muted)' }}
        >
          Contact
        </p>
        <div className="flex flex-col gap-2.5">
          {SOCIAL.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
            >
              {s.icon === 'github' && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              )}
              {s.icon === 'email' && (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              )}
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
