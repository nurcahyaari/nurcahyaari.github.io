import { useParams } from 'react-router-dom'
import Markdown from '../components/Markdown.jsx'
import { isEnabled, pages } from '../lib/content.js'
import { useTitle } from '../lib/hooks.js'
import NotFound from './NotFound.jsx'

export default function Page() {
  const { slug } = useParams()
  const page = isEnabled(slug) ? pages.find((p) => p.slug === slug) : null
  useTitle(page?.title)
  if (!page) return <NotFound />

  return (
    <article className="narrow">
      <h1 className="page-title">{page.title}</h1>
      <Markdown>{page.body}</Markdown>
    </article>
  )
}
