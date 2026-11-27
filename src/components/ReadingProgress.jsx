import { useEffect, useRef } from 'react'

// ReadingProgress is a thin bar at the top that fills as you scroll.
export default function ReadingProgress() {
  const bar = useRef(null)
  useEffect(() => {
    let frame
    const update = () => {
      frame = null
      const max = document.documentElement.scrollHeight - innerHeight
      bar.current?.style.setProperty('--progress', max > 0 ? Math.min(1, scrollY / max) : 0)
    }
    const onScroll = () => {
      frame ??= requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])
  return <div ref={bar} className="progress" aria-hidden="true" />
}
