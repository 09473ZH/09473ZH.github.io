'use client'

import { useEffect } from 'react'

export function ScrollOffset() {
  useEffect(() => {
    const update = () => {
      const header = document.querySelector('header')
      if (header) {
        const h = header.getBoundingClientRect().height
        document.documentElement.style.setProperty('--header-height', `${h}px`)
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return null
}
