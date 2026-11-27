import { Link } from 'react-router-dom'
import { formatDate, tagSlug, isEnabled } from '../lib/content.js'

export function PostMeta({ post }) {
  return (
    <p className="meta">
      {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
      <span aria-hidden="true">·</span>
      <span>{post.minutes} min read</span>
    </p>
  )
}

export function TagList({ tags }) {
  if (!tags.length) return null
  return (
    <ul className="tags">
      {tags.map((t) => (
        <li key={t}>
          {isEnabled('tags') ? (
            <Link className="tag" to={`/tags/${tagSlug(t)}`}>#{t}</Link>
          ) : (
            <span className="tag">#{t}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

// PostCard shows a post in a list. variant: "list", "card" or "feature".
export default function PostCard({ post, variant = 'list' }) {
  return (
    <article className={`card card-${variant}`}>
      <PostMeta post={post} />
      <h2 className="card-title">
        <Link to={`/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      {post.summary && <p className="summary">{post.summary}</p>}
      <TagList tags={post.tags} />
    </article>
  )
}
