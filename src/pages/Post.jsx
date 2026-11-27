import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Markdown from '../components/Markdown.jsx'
import { PostMeta, TagList } from '../components/PostCard.jsx'
import ReadingProgress from '../components/ReadingProgress.jsx'
import Toc from '../components/Toc.jsx'
import { headings, posts } from '../lib/content.js'
import { useTitle } from '../lib/hooks.js'
import NotFound from './NotFound.jsx'

export default function Post() {
  const { slug } = useParams()
  const index = posts.findIndex((p) => p.slug === slug)
  const post = posts[index]
  const toc = useMemo(() => (post ? headings(post.body) : []), [post])
  useTitle(post?.title)

  if (!post) return <NotFound />
  const newer = posts[index - 1]
  const older = posts[index + 1]
  const showToc = toc.length >= 3

  return (
    <>
      <ReadingProgress />
      <article className={`post${showToc ? ' has-toc' : ''}`}>
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>
          {post.summary && <p className="post-summary">{post.summary}</p>}
          <PostMeta post={post} />
          <TagList tags={post.tags} />
        </header>

        {showToc && (
          <details className="toc-mobile">
            <summary>On this page</summary>
            <Toc items={toc} />
          </details>
        )}

        <Markdown>{post.body}</Markdown>

        {showToc && (
          <aside className="toc-aside">
            <div className="toc-sticky">
              <p className="toc-title">On this page</p>
              <Toc items={toc} />
            </div>
          </aside>
        )}

        {(newer || older) && (
          <nav className="post-nav" aria-label="More posts">
            {older && (
              <Link to={`/posts/${older.slug}`} className="prev">
                <small>Previous</small>
                {older.title}
              </Link>
            )}
            {newer && (
              <Link to={`/posts/${newer.slug}`} className="next">
                <small>Next</small>
                {newer.title}
              </Link>
            )}
          </nav>
        )}
      </article>
    </>
  )
}
