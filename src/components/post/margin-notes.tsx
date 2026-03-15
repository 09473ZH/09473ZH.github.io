'use client'

import { useEffect, useRef, useState } from 'react'

interface NoteItem {
  top: number
  text: string
}

export function MarginNotes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [notes, setNotes] = useState<NoteItem[]>([])
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    let cleanups: (() => void)[] = []

    const measure = () => {
      cleanups.forEach((fn) => fn())
      cleanups = []

      const container = containerRef.current
      if (!container) return

      const containerTop = container.getBoundingClientRect().top
      const anchors = document.querySelectorAll<HTMLElement>('.mark-anchor[data-note]')

      const items: NoteItem[] = []

      anchors.forEach((el, i) => {
        const note = el.dataset.note
        if (!note) return

        const top = el.getBoundingClientRect().top - containerTop
        items.push({ top, text: note })

        const enter = () => setActiveIndex(i)
        const leave = () => setActiveIndex(null)
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
        cleanups.push(() => {
          el.removeEventListener('mouseenter', enter)
          el.removeEventListener('mouseleave', leave)
        })
      })

      setNotes(items)
    }

    requestAnimationFrame(measure)
    window.addEventListener('resize', measure)

    return () => {
      window.removeEventListener('resize', measure)
      cleanups.forEach((fn) => fn())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 hidden xl:block"
      aria-hidden
    >
      {notes.map((note, i) => (
        <p
          key={i}
          className="absolute text-xs font-mono leading-relaxed transition-all duration-150"
          style={{
            top: note.top,
            left: 'calc(100% + 3rem)',
            width: '180px',
            color: activeIndex === i
              ? 'var(--color-accent)'
              : 'var(--color-fg-muted)',
            fontWeight: activeIndex === i ? '600' : '400',
            opacity: activeIndex !== null && activeIndex !== i ? 0.35 : 1,
          }}
        >
          {note.text}
        </p>
      ))}
    </div>
  )
}
