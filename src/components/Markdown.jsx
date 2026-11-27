import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'

const rehypePlugins = [
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: 'append',
      properties: { className: ['anchor'], ariaHidden: true, tabIndex: -1 },
      content: { type: 'text', value: '#' },
    },
  ],
  [rehypeHighlight, { detect: false }],
]

const components = {
  // Site links stay in the app; outside links open in a new tab.
  a: ({ href = '', node, ...props }) => {
    if (href.startsWith('/')) return <Link to={href} {...props} />
    if (/^https?:/.test(href)) return <a href={href} target="_blank" rel="noopener noreferrer" {...props} />
    return <a href={href} {...props} />
  },
  img: ({ node, ...props }) => <img loading="lazy" decoding="async" {...props} />,
}

export default function Markdown({ children }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={rehypePlugins} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
