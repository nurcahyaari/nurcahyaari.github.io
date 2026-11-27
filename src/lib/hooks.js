import { useEffect, useState } from 'react'
import { config } from './content.js'

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${config.title}` : config.title
  }, [title])
}

// useActiveHeading returns the id of the heading at the top of the screen.
export function useActiveHeading(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '0px 0px -75% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}
