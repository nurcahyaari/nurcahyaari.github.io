import { Link } from 'react-router-dom'
import { useTitle } from '../lib/hooks.js'

export default function NotFound() {
  useTitle('Not found')
  return (
    <section className="narrow not-found">
      <h1 className="page-title">Page not found</h1>
      <p className="page-lead">The page you are looking for doesn't exist or has moved.</p>
      <Link to="/">← Back to home</Link>
    </section>
  )
}
