import { Link, NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { config, nav } from '../lib/content.js'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          {config.avatar && <img src={config.avatar} alt="" width="28" height="28" />}
          {config.title}
        </Link>
        <nav className="nav" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
