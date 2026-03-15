'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-8 w-8" />

  const isDark = theme === 'dark'

  function toggle(e: React.MouseEvent) {
    const nextTheme = isDark ? 'light' : 'dark'

    if (!('startViewTransition' in document)) {
      setTheme(nextTheme)
      return
    }

    ;(document as Document & {
      startViewTransition: (cb: () => void) => void
    }).startViewTransition(() => {
      setTheme(nextTheme)
    })
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '开灯' : '关灯'}
      className="flex h-8 w-8 items-center justify-center rounded-md hover:opacity-70 transition-opacity"
    >
      <svg
        width="17" height="17"
        viewBox="0 0 24 24"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          stroke: 'currentColor',
          filter: isDark ? 'none' : 'drop-shadow(0 0 3px rgba(251,191,36,0.6))',
          transition: 'filter 0.4s ease',
        }}
      >
        {/* 灯泡主体（闭合路径，亮灯时填充暖色） */}
        <path
          d="M9 14 A6 6 0 1 1 15 14 L15 17 L9 17 Z"
          fill={isDark ? 'none' : 'rgba(251,191,36,0.25)'}
          stroke="currentColor"
          style={{ transition: 'fill 0.4s ease' }}
        />
        {/* 灯座 */}
        <line x1="9" y1="19" x2="15" y2="19"/>
        <line x1="10" y1="21" x2="14" y2="21"/>
      </svg>
    </button>
  )
}
