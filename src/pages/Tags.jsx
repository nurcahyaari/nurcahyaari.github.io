import { Link, useParams } from 'react-router-dom'
import PostCard from '../components/PostCard.jsx'
import { tags, tagSlug } from '../lib/content.js'
import { useTitle } from '../lib/hooks.js'
import NotFound from './NotFound.jsx'

export function Tags() {
  useTitle('Tags')
  return (
    <section className="narrow">
      <h1 className="page-title">Tags</h1>
      <ul className="tag-cloud">
        {tags.map(([tag, items]) => (
          <li key={tag}>
            <Link className="tag" to={`/tags/${tagSlug(tag)}`}>
              #{tag} <span>{items.length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Tag() {
  const { tag: slug } = useParams()
  const found = tags.find(([t]) => tagSlug(t) === slug)
  useTitle(found && `#${found[0]}`)
  if (!found) return <NotFound />

  const [tag, items] = found
  return (
    <section className="narrow">
      <h1 className="page-title">#{tag}</h1>
      <p className="page-lead">
        {items.length} {items.length === 1 ? 'post' : 'posts'}
      </p>
      <div className="post-list">
        {items.map((p) => <PostCard key={p.slug} post={p} />)}
      </div>
    </section>
  )
}
