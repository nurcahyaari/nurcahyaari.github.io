import { useMemo } from 'react'
import { useActiveHeading } from '../lib/hooks.js'

export default function Toc({ items }) {
  const ids = useMemo(() => items.map((i) => i.id), [items])
  const active = useActiveHeading(ids)
  return (
    <nav className="toc" aria-label="On this page">
      <ol>
        {items.map((i) => (
          <li key={i.id} className={`depth-${i.depth}`}>
            <a href={`#${i.id}`} className={i.id === active ? 'active' : undefined}>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
