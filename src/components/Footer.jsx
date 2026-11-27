import { config } from '../lib/content.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>
          © {new Date().getFullYear()} {config.author || config.title}
        </span>
        {config.links?.length > 0 && (
          <ul className="footer-links">
            {config.links.map((l) => (
              <li key={l.url}>
                <a href={l.url} rel="me noopener" target="_blank">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  )
}
