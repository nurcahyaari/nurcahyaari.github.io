import { Link } from 'react-router-dom'
import { formatDate, posts } from '../lib/content.js'
import { useTitle } from '../lib/hooks.js'

const byYear = Object.entries(
  posts.reduce((acc, p) => {
    const year = p.date ? new Date(p.date).getFullYear() : 'Undated'
    ;(acc[year] ??= []).push(p)
    return acc
  }, {}),
).sort((a, b) => String(b[0]).localeCompare(String(a[0])))

export default function Archive() {
  useTitle('Archive')
  return (
    <section className="narrow">
      <h1 className="page-title">Archive</h1>
      {byYear.map(([year, items]) => (
        <section key={year} className="archive-year">
          <h2>{year}</h2>
          <ul className="archive-list">
            {items.map((p) => (
              <li key={p.slug}>
                <time dateTime={p.date}>{formatDate(p.date, { month: 'short', day: 'numeric' })}</time>
                <Link to={`/posts/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
