import PostCard from '../components/PostCard.jsx'
import { config, posts } from '../lib/content.js'
import { useTitle } from '../lib/hooks.js'

const List = ({ items }) => (
  <div className="post-list">
    {items.map((p) => <PostCard key={p.slug} post={p} />)}
  </div>
)

const Grid = ({ items }) => (
  <div className="post-grid">
    {items.map((p) => <PostCard key={p.slug} post={p} variant="card" />)}
  </div>
)

const Magazine = ({ items }) => {
  const [first, ...rest] = items
  return (
    <div className="magazine">
      {first && <PostCard post={first} variant="feature" />}
      {rest.length > 0 && <Grid items={rest} />}
    </div>
  )
}

const LAYOUTS = { list: List, grid: Grid, magazine: Magazine }

export default function Home() {
  useTitle()
  const Layout = LAYOUTS[config.layout] ?? List
  return (
    <>
      <section className={`intro intro-${config.layout}`}>
        <h1>{config.title}</h1>
        {config.description && <p>{config.description}</p>}
      </section>
      {posts.length ? <Layout items={posts} /> : <p className="empty">No posts yet.</p>}
    </>
  )
}
